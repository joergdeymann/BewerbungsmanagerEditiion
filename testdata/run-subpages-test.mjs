import { Analyzer } from "../js/analysis/Analyzer.js";
import { AnalysisController } from "../js/controllers/edit/AnalysisController.js";
import { ImportConstants } from "../js/constants/ImportConstants.js";
import { CompanySubpages } from "../js/io/CompanySubpages.js";
import { AppModel } from "../js/models/AppModel.js";
import { ImportedTextModel } from "../js/models/ImportedTextModel.js";
import { TextMerge } from "../js/utils/TextMerge.js";
import { ImportStatus } from "../js/ui/edit/ImportStatus.js";
import { Toast } from "../js/views/windows/Toast.js";
import { ImportEditTab } from "../js/views/edit/ImportEditTab.js";

// Prüft die Unterseiten der Firmenseite (Kontakt, Karriere, Impressum): Auffinden, Ladereihenfolge
// (Impressum zuletzt), Ergänzen statt Überschreiben und kein doppelter Text.
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
globalThis.document = { querySelector: () => null };
const quiet = async fn => {
    const original = { log: console.log, info: console.info, warn: console.warn, error: console.error, group: console.group, groupEnd: console.groupEnd, table: console.table };
    for (const key of Object.keys(original)) console[key] = () => {};
    try { return await fn(); } finally { Object.assign(console, original); }
};

const SITE = "https://www.inside-m2m.de/";
const MAIN = "https://www.linkedin.com/jobs/view/4200000001/";
const LONG = "Wir entwickeln Lösungen für das Internet der Dinge und begleiten Kunden von der Idee bis zum Betrieb. ".repeat(3);

const IMPRESSUM = `Impressum
Angaben gemäß § 5 TMG
Inside M2M GmbH
Hauptstraße 12
49565 Bramsche
Vertreten durch: Max Mustermann
Telefon: +49 5461 123456
E-Mail: info@inside-m2m.de
Handelsregister: Amtsgericht Osnabrück, HRB 12345`;

const KONTAKT = `Kontakt
Sprechen Sie uns an
Frau Erika Beispiel
Vertrieb
Telefon: +49 5461 123457
E-Mail: erika.beispiel@inside-m2m.de
Herr Hans Muster
Technik
E-Mail: hans.muster@inside-m2m.de`;

const KARRIERE = `Karriere bei Inside M2M
Das bieten wir dir
Flexible Arbeitszeiten
30 Tage Urlaub
Weiterbildung und Schulungen
Aktuelle Stellenangebote
Frontend Developer (m/w/d)
Wir suchen dich für unser Team in Vollzeit.
Deine Aufgaben
Entwicklung von Web-Anwendungen
Dein Profil
Erfahrung mit JavaScript`;

// ---------- TextMerge ----------
const merged = TextMerge.supplementText("Wir sind ein Team aus Entwicklern.", "Wir sind ein Team aus Entwicklern! Unser Sitz ist in Bramsche.");
const mergedTwice = TextMerge.supplementText(merged, "Unser Sitz ist in Bramsche. Wir sind ein Team aus Entwicklern.");
const paraphrase = TextMerge.isCovered("Wir entwickeln Lösungen für das Internet der Dinge", ["Wir entwickeln Lösungen für das Internet der Dinge und begleiten Kunden"]);
const different = TextMerge.isCovered("Wir bieten 30 Tage Urlaub und flexible Arbeitszeiten", ["Wir entwickeln Lösungen für das Internet der Dinge und begleiten Kunden"]);
const limited = TextMerge.supplementText("", "Satz eins ist hier. Satz zwei ist dort. Satz drei steht da. Satz vier folgt.", 2);

// ---------- CompanySubpages ----------
const links = [
    { href: "https://www.inside-m2m.de/leistungen/", label: "Leistungen", type: "intern" },
    { href: "https://www.inside-m2m.de/kontakt/", label: "Kontakt", type: "intern" },
    { href: "https://www.inside-m2m.de/team/kontakt-formular/", label: "Formular", type: "intern" },
    { href: "https://www.inside-m2m.de/karriere/", label: "Karriere", type: "intern" },
    { href: "https://www.inside-m2m.de/impressum/", label: "Impressum", type: "intern" },
    { href: "https://www.inside-m2m.de/impressum/", label: "Impressum", type: "intern" },
    { href: "https://www.inside-m2m.de/datenschutz/", label: "Datenschutz", type: "intern" },
    { href: "https://www.facebook.com/kontakt", label: "Kontakt bei Facebook", type: "extern" },
    { href: "https://www.inside-m2m.de/downloads/karriere.pdf", label: "Karriere", type: "intern" }
];
const found = CompanySubpages.find(links, SITE);
const subdomain = CompanySubpages.find([{ href: "https://jobs.inside-m2m.de/", label: "Offene Stellen", type: "extern" }, { href: "https://karriere.inside-m2m.de/", label: "Karriere", type: "extern" }], SITE);
const byPath = CompanySubpages.find([{ href: "https://www.inside-m2m.de/de/imprint", label: "Rechtliches", type: "intern" }], SITE);
const none = CompanySubpages.find([{ href: "https://www.inside-m2m.de/leistungen/", label: "Leistungen", type: "intern" }], SITE);
const reversed = CompanySubpages.find([...links].reverse(), SITE);

// ---------- AnalysisController.supplement ----------
const analyzer = new Analyzer();
const analyse = async text => quiet(() => analyzer.analyze(text));
const impressum = await analyse(IMPRESSUM);
const kontakt = await analyse(KONTAKT);
const karriere = await analyse(KARRIERE);
const controller = new AnalysisController();

const existing = new AppModel();
existing.company.name = "INSIDE M2M";
existing.company.phone = "+49 1111 1";
existing.company.description = "Wir sind ein Team aus Entwicklern.";
existing.company.address.data = { ...existing.company.address.data, city: "Osnabrück" };
existing.job.title = "Frontend Developer (m/w/d)";
existing.job.tasks = ["Alte Aufgabe"];
existing.benefits.data = { tags: ["30 Tage Urlaub"], content: ["30 Tage Urlaub"] };
existing.contacts.length = 0;

controller.supplement(existing, impressum);
const afterImpressum = {
    name: existing.company.name, phone: existing.company.phone, email: existing.company.email, legalForm: existing.company.legalForm,
    street: existing.company.address.data.street, zip: existing.company.address.data.zip, city: existing.company.address.data.city
};
controller.supplement(existing, kontakt);
const contactNames = existing.contacts.map(contact => `${contact.name.firstname} ${contact.name.lastname}`.trim());
controller.supplement(existing, kontakt);
const contactCountTwice = existing.contacts.length;
controller.supplement(existing, karriere);
const benefitsAfter = existing.benefits.data;
controller.supplement(existing, karriere);
const benefitsTwice = existing.benefits.data;
existing.company.description = TextMerge.supplementText(existing.company.description, "Wir sind ein Team aus Entwicklern. Neu hier.");

const empty = new AppModel();
controller.supplement(empty, impressum);
const emptyName = empty.company.name;
const noLegal = new AppModel();
controller.supplement(noLegal, kontakt);
const guessedName = noLegal.company.name;
const workLocation = empty.job.workLocation.data;

// ---------- Ablauf im Import ----------
const result = (url, text, extra = {}) => ({
    html: "", url, source: "Test", lines: text.split("\n"), text, links: [],
    companyAboutUrl: "", companyUrl: "", blocked: false, ...extra
});

function build(pages) {
    const events = [];
    const texts = [];
    const toasts = [];
    const app = new AppModel();
    const element = { hidden: true, set textContent(value) { texts.push(value); }, get textContent() { return texts.at(-1) ?? ""; } };
    const tab = new ImportEditTab({ querySelector: selector => (selector === "#fetchUrl" ? { disabled: false, textContent: "" } : null) });

    Toast.show = (message, type) => { toasts.push({ message, type }); };
    tab.application = app;
    tab.analyzer = new Analyzer();
    tab.loading = new Set();
    tab.status = new ImportStatus(() => element, 0);
    tab.sideWait = null;
    tab.applyAnalysisToAllTabs = (analysis, mode) => (mode === "supplement" ? controller.supplement(app, analysis) : controller.apply(app, analysis));
    tab.urlImporter = {
        fetch: async url => {
            events.push(url);
            await sleep(2);
            const page = pages[url];
            if (page instanceof Error) throw page;
            if (!page) throw new Error(`Keine Antwort für ${url}`);
            return page;
        }
    };

    return { tab, app, events, texts, toasts };
}

const subLinks = [
    { href: `${SITE}impressum/`, label: "Impressum", type: "intern" },
    { href: `${SITE}karriere/`, label: "Karriere", type: "intern" },
    { href: `${SITE}kontakt/`, label: "Kontakt", type: "intern" }
];
const pages = {
    [MAIN]: result(MAIN, "Frontend Developer (m/w/d)\nINSIDE M2M\nOsnabrück, Niedersachsen, Deutschland\nHybrid\nVollzeit\n\nÜber das Unternehmen\nWebsite\nhttps://www.inside-m2m.de\nWir sind ein Team aus Entwicklern.\n" + LONG),
    [SITE]: result(SITE, LONG, { links: subLinks }),
    [`${SITE}kontakt/`]: result(`${SITE}kontakt/`, KONTAKT),
    [`${SITE}karriere/`]: result(`${SITE}karriere/`, KARRIERE),
    [`${SITE}impressum/`]: result(`${SITE}impressum/`, IMPRESSUM)
};

const flow = build(pages);
await quiet(() => flow.tab.importPage(MAIN, () => flow.tab.urlImporter.fetch(MAIN), false, true, "dialog"));
await sleep(80);
const flowEvents = [...flow.events];
const flowTexts = [...flow.texts];
const flowEntries = flow.app.importedRawData.map(entry => ({ url: entry.url, supplement: entry.supplement }));
const flowCompany = flow.app.company;
const flowContacts = flow.app.contacts.map(contact => `${contact.name.firstname} ${contact.name.lastname}`.trim()).filter(Boolean);

// Wiederholung lädt nichts doppelt
const before = flow.events.length;
await quiet(() => flow.tab.loadWebsite());
const repeated = flow.events.length - before;

// Kontakt-Seite nicht erreichbar, Rest wird geladen, ein Hinweis
const broken = build({ ...pages, [`${SITE}kontakt/`]: new Error("Der Ziel-Server ist nicht erreichbar") });
await quiet(() => broken.tab.importPage(MAIN, () => broken.tab.urlImporter.fetch(MAIN), false, true, "dialog"));
await sleep(40);
const brokenUrls = broken.app.importedRawData.map(entry => entry.url);
const brokenToasts = broken.toasts.filter(toast => toast.type === "info");

// Kurze Seiten (80 Zeichen und mehr) werden übernommen, kürzere nicht
const shortPages = build({ ...pages, [`${SITE}kontakt/`]: result(`${SITE}kontakt/`, "Kontakt\nTelefon: +49 5461 123457\nE-Mail: info@inside-m2m.de\nBramsche, Hauptstraße 12 und mehr"), [`${SITE}karriere/`]: result(`${SITE}karriere/`, "Karriere") });
await quiet(() => shortPages.tab.importPage(MAIN, () => shortPages.tab.urlImporter.fetch(MAIN), false, true, "dialog"));
await sleep(40);
const shortUrls = shortPages.app.importedRawData.map(entry => entry.url);

// Ohne Links keine Unterseiten
const noLinks = build({ ...pages, [SITE]: result(SITE, LONG, { links: [] }) });
await quiet(() => noLinks.tab.importPage(MAIN, () => noLinks.tab.urlImporter.fetch(MAIN), false, true, "dialog"));
await sleep(20);

// Neu auswerten: Anzeige zuerst, Seiten der Firmen-Website ergänzen nur
const rerun = build(pages);
await quiet(() => rerun.tab.importPage(MAIN, () => rerun.tab.urlImporter.fetch(MAIN), false, true, "dialog"));
await sleep(60);
rerun.app.company.phone = "";
await quiet(() => rerun.tab.runCombinedAnalysis());
const rerunPhone = rerun.app.company.phone;
const rerunContacts = rerun.app.contacts.length;

// Nur Seiten der Firmen-Website: werden wie die Anzeige behandelt
const onlySite = build(pages);
const siteEntry = new ImportedTextModel();
siteEntry.content = IMPRESSUM;
siteEntry.supplement = true;
onlySite.app.importedRawData.push(siteEntry);
await quiet(() => onlySite.tab.runCombinedAnalysis());

// Eintrag speichern und laden (supplement bleibt erhalten)
const entry = new ImportedTextModel();
entry.supplement = true;
const reloaded = new ImportedTextModel();
reloaded.data = JSON.parse(JSON.stringify(entry.data));
const legacy = new ImportedTextModel();
legacy.data = { content: "alt" };

const checks = [
    // TextMerge
    ["Text: gleicher Satz (andere Satzzeichen) wird nicht doppelt angefügt", merged === "Wir sind ein Team aus Entwicklern. Unser Sitz ist in Bramsche."],
    ["Text: zweites Ergänzen ändert nichts", mergedTwice === merged],
    ["Text: Kürzung eines Satzes zählt als vorhanden", paraphrase === true],
    ["Text: anderer Inhalt zählt als neu", different === false],
    ["Text: Höchstzahl ergänzter Sätze", limited === "Satz eins ist hier. Satz zwei ist dort."],
    ["Liste: Einträge nur einmal, ohne Groß-/Kleinschreibung", JSON.stringify(TextMerge.union(["30 Tage Urlaub"], ["30 tage urlaub", "Homeoffice"])) === JSON.stringify(["30 Tage Urlaub", "Homeoffice"])],

    // Unterseiten finden
    ["Links: Kontakt, Karriere, Impressum in dieser Reihenfolge", found.map(page => page.key).join() === "contact,career,imprint"],
    ["Links: Impressum steht zuletzt", found.at(-1).key === "imprint"],
    ["Links: Linktext vor Pfad, keine Dateien, keine fremden Seiten", found[0].url === "https://www.inside-m2m.de/kontakt/" && found[1].url === "https://www.inside-m2m.de/karriere/" && found.length === 3],
    ["Links: Reihenfolge der Links auf der Seite ist egal", reversed.map(page => page.url).join() === found.map(page => page.url).join()],
    ["Links: Unterseite der Domain (karriere.inside-m2m.de)", subdomain.length === 1 && subdomain[0].url === "https://karriere.inside-m2m.de/"],
    ["Links: Begriff im Pfad genügt (/de/imprint)", byPath.length === 1 && byPath[0].key === "imprint"],
    ["Links: ohne Treffer nichts", none.length === 0 && CompanySubpages.find(links, "kein-link").length === 0],
    ["Unterseiten: Kontakt, Karriere, Impressum (Impressum zuletzt)", ImportConstants.SUBPAGES.map(page => page.key).join() === "contact,career,imprint"],

    // Ergänzen statt Überschreiben
    ["Ergänzen: vorhandener Name und Telefon bleiben", afterImpressum.name === "INSIDE M2M" && afterImpressum.phone === "+49 1111 1"],
    ["Ergänzen: leere Felder aus dem Impressum (E-Mail, Rechtsform)", afterImpressum.email === "info@inside-m2m.de" && afterImpressum.legalForm === "GMBH"],
    ["Ergänzen: Adresse nur in leeren Teilen (Ort bleibt, Strasse und PLZ neu)", afterImpressum.city === "Osnabrück" && afterImpressum.street === "Hauptstraße" && afterImpressum.zip === "49565"],
    ["Ergänzen: Name nur mit Rechtsform (Impressum ja, Kontaktseite nein)", emptyName === "Inside M2M GmbH" && guessedName === ""],
    ["Ergänzen: neue Ansprechpartner der Kontaktseite", contactNames.includes("Erika Beispiel") && contactNames.includes("Hans Muster")],
    ["Ergänzen: Ansprechpartner nicht doppelt", contactCountTwice === existing.contacts.length && contactCountTwice === contactNames.length],
    ["Ergänzen: Benefits aus Karriere ohne Stellenliste", benefitsAfter.tags.includes("Flexible Arbeitszeiten") && !benefitsAfter.content.includes("Frontend Developer (m/w/d)")
        && !benefitsAfter.content.includes("Aktuelle Stellenangebote")],
    ["Ergänzen: vorhandener Benefit nicht doppelt, zweites Ergänzen ohne Änderung", benefitsAfter.content.filter(line => line === "30 Tage Urlaub").length === 1
        && JSON.stringify(benefitsAfter) === JSON.stringify(benefitsTwice)],
    ["Ergänzen: Stelle bleibt unberührt (Titel, Aufgaben)", existing.job.title === "Frontend Developer (m/w/d)" && existing.job.tasks.join() === "Alte Aufgabe"],
    ["Ergänzen: Beschreibung ohne doppelte Sätze", existing.company.description === "Wir sind ein Team aus Entwicklern. Neu hier."],
    ["Ergänzen: Arbeitsort folgt der ergänzten Firmenadresse", workLocation.city === "Bramsche" && workLocation.street === "Hauptstraße"],

    // Ablauf
    ["Ablauf: Firmenseite, dann Kontakt, Karriere, Impressum zuletzt", flowEvents.join() === [MAIN, SITE, `${SITE}kontakt/`, `${SITE}karriere/`, `${SITE}impressum/`].join()],
    ["Ablauf: Anzeige im Kopfbereich nennt die Unterseite", ["Firmenseite wird geladen ...", "Firmenseite (Kontakt) wird geladen ...", "Firmenseite (Karriere) wird geladen ...", "Firmenseite (Impressum) wird geladen ...", "Firmenseite (Impressum) geladen"]
        .every(text => flowTexts.includes(text))
        && flowTexts.indexOf("Firmenseite (Kontakt) wird geladen ...") < flowTexts.indexOf("Firmenseite (Karriere) wird geladen ...")
        && flowTexts.indexOf("Firmenseite (Karriere) wird geladen ...") < flowTexts.indexOf("Firmenseite (Impressum) wird geladen ...")],
    ["Ablauf: Seiten der Firmen-Website sind als ergänzend markiert", flowEntries.length === 5 && flowEntries[0].supplement === false && flowEntries.slice(1).every(entry => entry.supplement === true)],
    ["Ablauf: Impressum ergänzt Rechtsform und Adresse", flowCompany.legalForm === "GMBH" && flowCompany.address.data.street === "Hauptstraße" && flowCompany.address.data.city],
    ["Ablauf: Ansprechpartner der Kontaktseite übernommen", flowContacts.includes("Erika Beispiel") && flowContacts.includes("Hans Muster")],
    ["Ablauf: Wiederholung lädt nichts doppelt", repeated === 0],
    ["Ablauf: Kontaktseite nicht erreichbar, Rest wird geladen", brokenUrls.join() === [MAIN, SITE, `${SITE}karriere/`, `${SITE}impressum/`].join()],
    ["Ablauf: ein Hinweis für nicht übernommene Unterseiten", brokenToasts.length === 1 && brokenToasts[0].message.startsWith("Nicht übernommen: Kontakt")],
    ["Ablauf: kurze Seite ab 80 Zeichen übernommen, zu kurze nicht", shortUrls.includes(`${SITE}kontakt/`) && !shortUrls.includes(`${SITE}karriere/`)],
    ["Ablauf: ohne Links keine Unterseiten", noLinks.events.join() === [MAIN, SITE].join()],
    ["Neu auswerten: Anzeige zuerst, Seiten der Firma ergänzen danach", rerunPhone !== "" && rerunContacts >= 2],
    ["Nur Seiten der Firma vorhanden: werden wie die Anzeige ausgewertet", onlySite.app.company.name === "Inside M2M GmbH"],
    ["Eintrag: ergänzend bleibt beim Speichern erhalten", reloaded.supplement === true && legacy.supplement === false && legacy.content === "alt"]
];

let failed = 0;
for (const [name, ok] of checks) {
    if (ok) console.log(`OK     | ${name}`);
    else { failed++; console.log(`FEHLER | ${name}`); }
}

console.log(failed ? `\n=== ${failed} VON ${checks.length} FEHLGESCHLAGEN ===` : "\n=== ALLE TESTS OK ===");
process.exit(failed ? 1 : 0);
