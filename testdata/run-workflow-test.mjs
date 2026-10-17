import fs from "fs";
import { Analyzer } from "../js/analysis/Analyzer.js";
import { WorkLocationResolver } from "../js/analysis/extractors/WorkLocationResolver.js";
import { AnalysisController } from "../js/controllers/edit/AnalysisController.js";
import { LocationConstants } from "../js/constants/LocationConstants.js";
import { AppModel } from "../js/models/AppModel.js";
import { TextBlockFormatter } from "../js/utils/TextBlockFormatter.js";
import { TextCleaner } from "../js/analysis/parser/TextCleaner.js";
import { SourcesTemplate } from "../js/templates/detail/SourcesTemplate.js";
import { CompanyTemplate } from "../js/templates/detail/CompanyTemplate.js";

// Prüft den Sprint aus AI/workflow/WORKFLOW.md: Länderkürzel/Land, Kopfbereich der Anzeige (Titel, Hybrid,
// Vollzeit), Arbeitsort aus der Standortliste, Formatierung der Selbstbeschreibung, Quellen mit Domain.
// Der Import-Teil am Ende braucht jsdom (npm install --no-save jsdom) und wird sonst übersprungen.
const read = name => fs.readFileSync(new URL(`../dok/${name}`, import.meta.url), "utf8");
const quiet = fn => {
    const original = console.log;
    console.log = () => {};
    try { return fn(); } finally { console.log = original; }
};
const analyze = text => quiet(() => new Analyzer().analyze(text));

const jobText = read("Beispiel_LinkedIn_InsideM2M.txt");
const infoText = read("Beispiel_LinkedIn_InsideM2M_Info.txt");
const topCard = [
    "Frontend Developer (M/W/D)", "INSIDE M2M", "Osnabrück, Niedersachsen, Deutschland",
    "Vor 2 Monaten", "21 Kandidat:innen haben auf „Bewerben“ geklickt", "Hybrid", "Vollzeit", "Bewerben", "Speichern"
].join("\n");

const checks = [];
const check = (label, ok) => checks.push([label, !!ok]);
const controller = new AnalysisController();

// ---------- 1. Länderkürzel und Land ----------
check("Browsereinstellung de-AT -> A", LocationConstants.defaultCountryCode({ languages: ["de-AT", "de"] }) === "A");
check("Browsereinstellung fr-CH -> CH", LocationConstants.defaultCountryCode({ language: "fr-CH" }) === "CH");
check("Browsereinstellung en-US (nicht unterstützt) -> D", LocationConstants.defaultCountryCode({ language: "en-US" }) === "D");
check("Ohne Browserangabe -> D", LocationConstants.defaultCountryCode(null) === "D");
check("codeForCountry: Deutschland, Österreich, unbekanntes Land",
    LocationConstants.codeForCountry("Deutschland") === "D" && LocationConstants.codeForCountry("Österreich") === "A" && LocationConstants.codeForCountry("Atlantis") === "");

const only = (data) => controller.completeCountry({ street: "", houseNumber: "", zip: "", city: "", zipCountry: "", country: "", ...data });
check("Nur Ort: D und Deutschland", (r => r.zipCountry === "D" && r.country === "Deutschland")(only({ city: "Osnabrück" })));
check("Nur Land Österreich: Kürzel A", (r => r.zipCountry === "A" && r.country === "Österreich")(only({ city: "Wien", country: "Österreich" })));
check("Nur Kürzel A: Land Österreich", (r => r.zipCountry === "A" && r.country === "Österreich")(only({ zip: "1010", zipCountry: "A" })));
check("Unbekanntes Land bleibt, kein erfundenes Kürzel", (r => r.zipCountry === "" && r.country === "Atlantis")(only({ city: "Atlantis-Stadt", country: "Atlantis" })));
check("Unbekanntes Kürzel: kein erfundenes Land", (r => r.zipCountry === "ZZ" && r.country === "")(only({ city: "Testort", zipCountry: "ZZ" })));
check("Leere Adresse bleibt leer", (r => r.zipCountry === "" && r.country === "")(only({})));

// ---------- 2. Kopfbereich in der Analyse: Titel, Beschäftigungsart, Arbeitsmodell ----------
const withTop = analyze(`${topCard}\n${jobText}\n\n----\n\n${infoText}`);
check("Stelle: Titel erkannt", withTop.job.title === "Frontend Developer (M/W/D)");
check("Beschäftigungsart Vollzeit erkannt", withTop.job.workModel.type.includes("Vollzeit"));
check("Arbeitsmodell Hybrid erkannt", withTop.job.workModel.workDays.map(day => day.type).join() === "Hybrid");

// ---------- 3. Arbeitsort: Osnabrück = Bissendorf (aus Text und Standortliste) ----------
const app = new AppModel();
controller.apply(app, withTop);
const work = app.job.workLocation.data;
check("Arbeitsort: Bissendorf statt beide Filialen", work.city === "Bissendorf");
check("Arbeitsort: Adresse aus der Standortliste (Gewerbepark 9-11, 49143)", work.street === "Gewerbepark" && work.houseNumber === "9-11" && work.zip === "49143");
check("Arbeitsort: D und Deutschland", work.zipCountry === "D" && work.country === "Deutschland");
check("Firmenadresse: D und Deutschland ergänzt", app.company.address.data.zipCountry === "D" && app.company.address.data.country === "Deutschland");

const jobOnly = analyze(`${topCard}\n${jobText}`);
const appJobOnly = new AppModel();
controller.apply(appJobOnly, jobOnly);
check("Nur Stellenseite: Ort Bissendorf aus \"BISSENDORF (bei Osnabrück)\"", appJobOnly.job.workLocation.data.city === "Bissendorf");

const noEvidence = analyze(`${topCard}\nWir suchen Verstärkung an den Standorten Garbsen und Berlin.\nDeine Aufgaben\nDu entwickelst Software.`);
check("Ohne Hinweis auf die Region bleibt die Kopfzeile (Osnabrück)", noEvidence.job.workLocation.city === "Osnabrück");
check("Adress-Hinweis (\"Standorten\") ohne Adresse verdeckt die Kopfzeile nicht mehr", noEvidence.job.workLocation.city === "Osnabrück" && noEvidence.job.workLocation.country === "Deutschland");

const resolver = new WorkLocationResolver(["Wir suchen in BISSENDORF (bei Osnabrück) und GARBSEN (bei Hannover)"]);
check("Resolver: eigene Adresse mit PLZ bleibt unverändert", resolver.resolve({ city: "Osnabrück", zip: "49074" }).city === "Osnabrück");
check("Resolver: Sonderzeichen im Ort brechen den Ausdruck nicht", resolver.resolve({ city: "St. (Test)" }).city === "St. (Test)");

// ---------- 4. Selbstbeschreibung formatiert ----------
const description = analyze(jobText).company.description;
const html = new TextBlockFormatter().toHtml(description);
check("Selbstbeschreibung: Zwischenüberschriften fett (Was Sie bekommen:, Warum INSIDE M2M?)",
    html.includes("<strong>Was Sie bekommen:</strong>\n• ") && html.includes("<strong>Warum INSIDE M2M?</strong>\n• "));
check("Selbstbeschreibung: Aufzählungspunkte mit Punkt (10 + 5)", (html.match(/^• /gm) ?? []).length === 15);
check("Selbstbeschreibung: Sätze als eigene Absätze mit Leerzeile dazwischen", html.startsWith("Als IoT Pioniere") && html.includes("Systeme branchenübergreifend und weltweit.\n\nWir beraten Sie"));
check("Selbstbeschreibung: Ortsliste mit Symbol als eigener Absatz", html.includes("\n\n📍Garbsen, Bissendorf, Berlin\n\n"));
check("Formatter: HTML im Text wird maskiert", !new TextBlockFormatter().toHtml("<script>x()</script>").includes("<script>"));
check("Formatter: einzelne kurze Zeile bleibt Text ohne Aufzählungspunkt, leerer Text ergibt nichts",
    new TextBlockFormatter().toHtml("Kurz") === "Kurz" && new TextBlockFormatter().toHtml("") === "");

const detail = new AppModel();
detail.company.description = description;
const rendered = new CompanyTemplate().render(detail);
check("Detailansicht: Beschreibung in einem einzigen <p class=\"text-content\"> (vorhandener Rahmen und Zeilenumbruch)",
    rendered.includes('<p class="text-content"><strong>') === false && rendered.includes('<p class="text-content">Als IoT Pioniere')
    && (rendered.match(/<p class="text-content">/g) ?? []).length === 1);
check("Detailansicht: ohne Beschreibung \"—\"", new CompanyTemplate().render(new AppModel()).includes('<p class="text-content">—</p>'));

// ---------- 4a. Doppelte Firmenbeschreibung (lange Zeile der Info-Seite + Einzelzeilen der Stellenanzeige) ----------
const infoPage = read("Beispiel_LinkedIn_InsideM2M_Info_Seite.txt");
const merged = analyze(`${jobText}\n\n----\n\n${infoPage}`).company.description.split("\n");
const countOf = part => merged.filter(line => line.includes(part)).length;
check("Beschreibung: \"INSIDE M2M ist Ihr Partner ...\" nur einmal", countOf("Ihr Partner für sichere") === 1);
check("Beschreibung: \"Warum INSIDE M2M?\" und die Ortsliste nur einmal", countOf("Warum INSIDE M2M?") === 1 && countOf("📍Garbsen") === 1 && countOf("Lassen Sie uns gemeinsam") === 1);
check("Beschreibung: keine zusammengesetzte Zeile mehr (Absatz + \"Was Sie bekommen:\")", !merged.some(line => line.includes("Ihr Partner für sichere") && line.includes("Was Sie bekommen:")));
check("Beschreibung: Punkte nur aus der Info-Seite bleiben erhalten",
    ["Von Strategie bis zur schlüsselfertigen", "Bedarfsabhängig: Beratung", "Intelligentes Gerätemanagement", "Echtzeit-Analysen", "Flexibles Hosting"].every(part => countOf(part) === 1));
check("Beschreibung: Impressum- und Datenschutz-Links nicht darin", countOf("impressum") === 0 && countOf("datenschutzerklaerung") === 0);
check("Beschreibung: andere Reihenfolge der Seiten ebenfalls ohne Doppelung",
    analyze(`${infoPage}\n\n----\n\n${jobText}`).company.description.split("\n").filter(line => line.includes("Ihr Partner für sichere")).length === 1);
const cleaner = new TextCleaner("");
const pieces = ["Wir bauen Software für Kunden", "Wir testen sehr gründlich", "Wir liefern pünktlich aus"];
check("TextCleaner: lange Zeile aus mehreren Einzelzeilen entfällt, Einzelzeilen bleiben",
    JSON.stringify(cleaner.removeAggregates([pieces.join(" "), ...pieces])) === JSON.stringify(pieces));
check("TextCleaner: Reihenfolge egal (lange Zeile steht hinten)",
    JSON.stringify(cleaner.removeAggregates([...pieces, pieces.join(" ")])) === JSON.stringify(pieces));
check("TextCleaner: lange Zeile mit viel eigenem Inhalt bleibt",
    cleaner.removeAggregates([`${pieces.join(" ")} und noch ganz viele weitere eigene Aussagen die sonst nirgends stehen`, ...pieces]).length === 4);
check("TextCleaner: nur eine Teilzeile reicht nicht (kein Aggregat)", cleaner.removeAggregates([`${pieces[0]} ${pieces[1]}`, pieces[0]]).length === 2);

// ---------- 4b. Kontakt-Position ist nie die Stellenbezeichnung ----------
const roleOf = (title, extra = "") => analyze(`Frau Anna Muster\n${extra}\n${title}\nINSIDE M2M\nOsnabrück, Niedersachsen, Deutschland\nHybrid\nVollzeit\n${jobText}`);
check("Kontakt: Jobtitel mit (M/W/D) wird nicht zur Position", roleOf("Frontend Engineer, Developer (M/W/D)").contacts[0]?.role === "");
check("Kontakt: Jobtitel ohne (m/w/d) wird nicht zur Position", roleOf("Frontend Engineer").contacts[0]?.role === "");
check("Kontakt: echte Position bleibt erhalten", roleOf("Frontend Engineer (m/w/d)", "Personalreferentin").contacts[0]?.role === "Personalreferentin");
check("Kontakt: Jobtitel bleibt richtig als Jobtitel", roleOf("Frontend Engineer, Developer (M/W/D)").job.title === "Frontend Engineer, Developer (M/W/D)");

// ---------- 4c. Ersatzkontakt: Jobtitel ist keine Position ----------
const substituteApp = new AppModel();
substituteApp.company.name = "INSIDE M2M";
substituteApp.company.email = "info@inside-m2m.de";
substituteApp.job.title = "Frontend Engineer, Developer (M/W/D)";
controller.ensureCompanyContact(substituteApp);
check("Ersatzkontakt: Position bleibt leer, Jobtitel bleibt als Jobtitel", substituteApp.contacts[0]?.role === "" && substituteApp.job.title === "Frontend Engineer, Developer (M/W/D)");
substituteApp.contacts[0].role = "Frontend Engineer, Developer (M/W/D)"; // Altbestand: früher automatisch eingetragen
controller.ensureCompanyContact(substituteApp);
check("Ersatzkontakt: früher eingetragener Jobtitel wird bereinigt", substituteApp.contacts[0].role === "");
substituteApp.contacts[0].role = "Geschäftsführung";
controller.ensureCompanyContact(substituteApp);
check("Ersatzkontakt: von Hand eingetragene Position bleibt", substituteApp.contacts[0].role === "Geschäftsführung");

// ---------- 5. Quellen mit Domain ----------
const sources = new SourcesTemplate().combineSources({
    references: [],
    importedRawData: [
        { url: "https://www.linkedin.com/jobs/view/1/", capturedAt: "2026-10-12" },
        { url: "", capturedAt: "2026-10-12" },
        { url: "kein-url", capturedAt: "2026-10-12" }
    ]
}).map(entry => entry.name);
check("Quellen: Import (linkedin.com)", sources[0] === "Import (linkedin.com)");
check("Quellen: manuell und ungültige Adresse", sources[1] === "Import (manuell)" && sources[2] === "Import (URL)");
const sourcesHtml = new SourcesTemplate().render({ references: [], importedRawData: [], job: { title: "Entwickler" }, company: {} });
const postingOf = application => new SourcesTemplate().render({ references: [], company: {}, ...application });
const linkedPosting = postingOf({ job: { url: "https://www.linkedin.com/jobs/view/1/" }, importedRawData: [{ url: "https://andere.de/", supplement: false }] });
const oldRecord = postingOf({ job: {}, importedRawData: [{ url: "https://www.firma.de/website/", supplement: true }, { url: "https://www.linkedin.com/jobs/view/9/", supplement: false }] });
const noPosting = postingOf({ job: {}, importedRawData: [] });
check("Quellen: Stellenanzeige zeigt den Link aus job.url", /Stellenanzeige<\/label>\s*<p>\s*<a\s+href="https:\/\/www\.linkedin\.com\/jobs\/view\/1\/"/.test(linkedPosting) && !linkedPosting.includes("Noch nicht implementiert"));
check("Quellen: ältere Datensätze ohne Link nutzen den ersten importierten Text der Anzeige (nicht die Firmen-Website)", /Stellenanzeige<\/label>\s*<p>\s*<a\s+href="https:\/\/www\.linkedin\.com\/jobs\/view\/9\/"/.test(oldRecord));
check("Quellen: ohne Link ein Strich", /Stellenanzeige<\/label>\s*<p>—<\/p>/.test(noPosting));
check("Quellen: einzelnes Feld \"Quelle\" entfernt, \"Weitere Quellen\" bleibt", !sourcesHtml.includes("<label>Quelle</label>") && sourcesHtml.includes("Weitere Quellen"));

// ---------- 6. Import: Kopfbereich außerhalb des erkannten Bereichs (jsdom) ----------
let JSDOM = null;
try { ({ JSDOM } = await import("jsdom")); } catch { /* ohne jsdom übersprungen */ }

if (JSDOM) {
    const { ImportJobPage } = await import("../js/io/ImportJobPage.js");
    globalThis.DOMParser = new JSDOM("").window.DOMParser;

    const longText = jobText.split("\n").filter(Boolean).map(line => `<p>${line}</p>`).join("");
    const card = (title, company) => `<li class="card"><a href="#">${title}</a><span>${company}</span><span>Hamburg, Deutschland</span></li>`;
    const others = Array.from({ length: 12 }, (_, i) => card(`Anderer Job ${i} (m/w/d)`, `Firma ${i} GmbH`)).join("");
    const similar = Array.from({ length: 80 }, (_, i) => `<li>Ähnlicher Job ${i}: Beschreibung mit genug Text, damit der Bereich sehr groß wird und das Wachstumslimit greift.</li>`).join("");
    const top = `<div class="top-card"><h1>Frontend Developer (M/W/D)</h1>
        <div><a href="https://www.linkedin.com/company/inside-m2m/">INSIDE M2M</a> · Osnabrück, Niedersachsen, Deutschland · Vor 2 Monaten · 21 Kandidat:innen haben auf „Bewerben“ geklickt</div>
        <div><button>Hybrid</button><button>Vollzeit</button></div><button>Bewerben</button><button>Speichern</button></div>`;
    const page = (header, title = "") => `<html><head><title>${title}</title></head><body>
        <ul class="list">${others}${card("Frontend Developer (M/W/D)", "INSIDE M2M")}</ul>
        <div class="detail">${header}<div class="premium"><p>Bestimmen Sie Ihre geeignete:n Kandidat:innen und wie Sie sich abheben können</p></div>
        <section><h2>Details zum Jobangebot</h2><div>${longText}</div></section>
        <section><h2>Ähnliche Jobs</h2><ul>${similar}</ul></section></div></body></html>`;

    const importer = new ImportJobPage();
    const url = "https://www.linkedin.com/jobs/view/4123456789/";
    const doc = new JSDOM(page(top)).window.document;
    const area = importer.findContainer(doc, url).container.textContent;
    check("Testaufbau: der Kopfbereich liegt außerhalb des erkannten Bereichs ", !area.includes("Osnabrück, Niedersachsen, Deutschland") && !area.includes("21 Kandidat"));

    const result = importer.extract(page(top), url);
    const at = text => result.lines.indexOf(text);
    check("Import: erste Zeile ist der Titel der Stelle", result.lines[0] === "Frontend Developer (M/W/D)");
    check("Import: danach Firma, Ort, Hybrid, Vollzeit", at("INSIDE M2M") === 1 && at("Osnabrück, Niedersachsen, Deutschland") === 2 && at("Hybrid") > 2 && at("Vollzeit") === at("Hybrid") + 1);
    check("Import: Kopfbereich steht vor dem Anzeigentext", at("Vollzeit") < at("Bestimmen Sie Ihre geeignete:n Kandidat:innen und wie Sie sich abheben können"));
    check("Import: Titel nur einmal, keine Karten aus der Trefferliste", result.lines.filter(l => l === "Frontend Developer (M/W/D)").length === 1 && !result.text.includes("Anderer Job"));
    check("Import: ähnliche Jobs bleiben abgeschnitten", !result.text.includes("Ähnlicher Job"));

    const analysed = analyze(result.text);
    check("Import -> Analyse: Titel, Vollzeit, Hybrid, Ort", analysed.job.title === "Frontend Developer (M/W/D)" && analysed.job.workModel.type.includes("Vollzeit")
        && analysed.job.workModel.workDays[0]?.type === "Hybrid" && analysed.job.workLocation.city === "Bissendorf");

    const small = page(top).replace(/<section><h2>Ähnliche Jobs<\/h2>.*<\/section>/s, "");
    const smallResult = importer.extract(small, url);
    check("Import ohne ähnliche Jobs: Kopfbereich vorn, Titel einmal",
        smallResult.lines[0] === "Frontend Developer (M/W/D)" && smallResult.lines.filter(l => l === "Frontend Developer (M/W/D)").length === 1);

    const noTitle = `<html><body><div class="detail"><div class="top-card"><p>Frontend Developer (M/W/D)</p><p>INSIDE M2M</p><p>Osnabrück, Niedersachsen, Deutschland</p><p>Hybrid</p></div>
        <div><p>Bestimmen Sie Ihre geeignete:n Kandidat:innen und wie Sie sich abheben können</p></div><section><h2>Details zum Jobangebot</h2><div>${longText}</div></section></div></body></html>`;
    const unmarked = importer.extract(noTitle.replace("Frontend Developer (M/W/D)</p><p>INSIDE", "Frontend Developer (m/w/d)</p><p>INSIDE"), url);
    check("Import: Titel ohne h1 (nur \"(m/w/d)\") wird über die Zeilen vor dem Bereich gefunden", unmarked.lines[0] === "Frontend Developer (m/w/d)" && unmarked.lines.includes("Hybrid"));

    const inside = importer.extract(`<html><body><main>${top}<div><p>Details zum Jobangebot</p>${longText}</div></main></body></html>`, url);
    check("Import: Titel schon im Bereich -> nicht doppelt", inside.lines.filter(l => l === "Frontend Developer (M/W/D)").length === 1);

    const noList = page("", "(3) Frontend Developer (M/W/D) | INSIDE M2M | LinkedIn").replace(/<ul class="list">.*?<\/ul>/s, "");
    const byTitle = importer.extract(noList, url);
    check("Import: Titel nur im Seitentitel -> wird vorangestellt (ohne Zähler)", byTitle.lines[0] === "Frontend Developer (M/W/D)");

    const company = importer.extract(`<html><body><main><h1>INSIDE M2M</h1>${longText}</main></body></html>`, "https://www.linkedin.com/company/inside-m2m/about/");
    check("Import: Firmenseite bleibt unverändert (kein Kopfbereich ergänzt)", company.source === "Firmenseite" && company.lines[0] === "INSIDE M2M");
} else {
    console.log("HINWEIS: jsdom fehlt - Import-Prüfungen (Abschnitt 6) übersprungen. Mit \"npm install --no-save jsdom\" nachholen.");
}

let failed = 0;
for (const [label, ok] of checks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}
console.log(failed ? `\n=== ${failed} VON ${checks.length} FEHLGESCHLAGEN ===` : `\n=== ALLE ${checks.length} TESTS OK ===`);
process.exit(failed ? 1 : 0);
