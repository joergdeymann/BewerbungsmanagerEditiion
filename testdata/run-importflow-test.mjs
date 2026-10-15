import fs from "fs";
import { AnalysisController } from "../js/controllers/edit/AnalysisController.js";
import { ImportConstants } from "../js/constants/ImportConstants.js";
import { AppModel } from "../js/models/AppModel.js";
import { EditHeaderTemplate } from "../js/templates/edit/EditHeaderTemplate.js";
import { ImportStatus } from "../js/ui/edit/ImportStatus.js";
import { Toast } from "../js/views/windows/Toast.js";
import { ImportEditTab } from "../js/views/edit/ImportEditTab.js";
import { Analyzer } from "../js/analysis/Analyzer.js";

// Prüft den Ablauf eines Imports: Hauptseite, Nebenseite (LinkedIn /about/), danach immer die Firmenseite
// (Website der Firma), nacheinander, mit Anzeige der gerade geladenen Seite im Kopfbereich.
const read = name => fs.readFileSync(new URL(`../dok/${name}`, import.meta.url), "utf8");
const quiet = async fn => {
    const original = { log: console.log, info: console.info, warn: console.warn, error: console.error, group: console.group, groupEnd: console.groupEnd, table: console.table };
    for (const key of Object.keys(original)) console[key] = () => {};
    try { return await fn(); } finally { Object.assign(console, original); }
};

const MAIN = "https://www.linkedin.com/jobs/view/4200000001/";
const ABOUT = "https://www.linkedin.com/company/inside-m2m/about/";
const HOME = "https://www.linkedin.com/company/inside-m2m/";
const SITE = "https://www.inside-m2m.de/";
const LONG = "Wir entwickeln Lösungen für das Internet der Dinge und begleiten Kunden von der Idee bis zum Betrieb. ".repeat(6);

const result = (url, text, extra = {}) => ({
    html: "", url, source: "Test", lines: text.split("\n"), text, links: [],
    companyAboutUrl: "", companyUrl: "", blocked: false, ...extra
});

/** Baut einen ImportEditTab ohne Browser-DOM; urlImporter und Anzeige werden aufgezeichnet. */
function build(pages, { website } = {}) {
    const events = [];
    const texts = [];
    const toasts = [];
    let active = 0;
    let overlap = false;

    const app = new AppModel();
    if (website !== undefined) app.company.website = website;

    const element = { hidden: true, set textContent(value) { texts.push(value); }, get textContent() { return texts.at(-1) ?? ""; } };
    const button = { disabled: false, textContent: "" };
    const tab = new ImportEditTab({ querySelector: selector => (selector === "#fetchUrl" ? button : null) });

    tab.application = app;
    tab.analyzer = new Analyzer();
    tab.loading = new Set();
    tab.status = new ImportStatus(() => element);
    tab.applyAnalysisToAllTabs = analysis => new AnalysisController().apply(app, analysis);
    tab.urlImporter = {
        fetch: async url => {
            events.push(`load:${url}`);
            active++;
            overlap ||= active > 1;
            await new Promise(resolve => setTimeout(resolve, 5));
            active--;

            const page = pages[url];
            if (page instanceof Error) throw page;
            if (!page) throw new Error(`Keine Antwort für ${url}`);
            return page;
        },
        fromHtml: (html, url) => pages[url]
    };

    return { tab, app, events, texts, toasts, button, element, overlapped: () => overlap };
}

Toast.show = (message, type) => { Toast.last.push({ message, type }); };
Toast.last = [];

const pages = {
    [MAIN]: result(MAIN, read("Beispiel_LinkedIn_InsideM2M.txt"), { companyAboutUrl: ABOUT, companyUrl: HOME }),
    [ABOUT]: result(ABOUT, read("Beispiel_LinkedIn_InsideM2M_Info.txt")),
    [SITE]: result(SITE, LONG)
};

// 1. Voller Ablauf: Hauptseite -> Nebenseite -> Firmenseite
const full = build(pages);
await quiet(() => full.tab.importPage(MAIN, () => full.tab.urlImporter.fetch(MAIN), false, true, "dialog"));
const fullOrder = full.events;
const fullTexts = [...full.texts];
const fullUrls = full.app.importedRawData.map(entry => entry.url);
const fullWebsite = full.app.company.website;

// 2. Wiederholung lädt nichts doppelt
const beforeRepeat = full.events.length;
await quiet(() => full.tab.loadWebsite());
await quiet(() => full.tab.loadWebsite());
const repeated = full.events.length - beforeRepeat;

// 3. Keine Webadresse bekannt: nur Hauptseite
const lonely = build({ [MAIN]: result(MAIN, "Frontend Developer (m/w/d)\nOsnabrück\nWir suchen dich für unser Team.") });
await quiet(() => lonely.tab.importPage(MAIN, () => lonely.tab.urlImporter.fetch(MAIN), false, true, "dialog"));

// 4. Firmenseite nicht erreichbar: Hinweis, Rest bleibt erhalten
Toast.last = [];
const broken = build({ ...pages, [SITE]: new Error("Der Ziel-Server ist nicht erreichbar") });
await quiet(() => broken.tab.importPage(MAIN, () => broken.tab.urlImporter.fetch(MAIN), false, true, "dialog"));
const brokenToasts = [...Toast.last];

// 5. Firmenseite mit zu wenig Text wird nicht übernommen
Toast.last = [];
const thin = build({ ...pages, [SITE]: result(SITE, "Willkommen") });
await quiet(() => thin.tab.importPage(MAIN, () => thin.tab.urlImporter.fetch(MAIN), false, true, "dialog"));
const thinToasts = [...Toast.last];

// 6. Bookmarklet: Info-Seite mit HTML, danach die Firmenseite
const bookmarklet = build(pages, { website: "" });
await quiet(() => bookmarklet.tab.importCompanyPayload(ABOUT, "<html></html>"));
const bookmarkletUrls = bookmarklet.app.importedRawData.map(entry => entry.url);
const bookmarkletLoads = [...bookmarklet.events];

// 7. Adresse der Firmenseite
const sites = build({});
const site = value => { sites.app.company.website = value; return sites.tab.websiteUrl(); };

// 8. Anzeige im Kopfbereich
const shown = { hidden: true, text: "" };
const status = new ImportStatus(() => ({ get hidden() { return shown.hidden; }, set hidden(v) { shown.hidden = v; }, set textContent(v) { shown.text = v; } }));
status.begin("main");
const whileLoading = { ...shown };
status.end("main", true);
const afterEnd = { ...shown };
status.begin("side");
const nextPage = { ...shown };
status.end("side", false);
const failed = { ...shown };
status.hide();
const hidden = { ...shown };
clearTimeout(status.timer);
const noElement = new ImportStatus(() => null);
let noElementOk = true;
try { noElement.begin("company"); noElement.end("company"); clearTimeout(noElement.timer); } catch { noElementOk = false; }

const header = new EditHeaderTemplate().render(new AppModel());

const checks = [
    // Reihenfolge
    ["Ablauf: Hauptseite, dann Nebenseite (/about/), dann Firmenseite", fullOrder.join() === [MAIN, ABOUT, SITE].map(url => `load:${url}`).join()],
    ["Ablauf: alle drei Seiten als Einträge unter Übernommene Texte", fullUrls.join() === [MAIN, ABOUT, SITE].join()],
    ["Ablauf: Webadresse aus der Info-Seite gelesen", fullWebsite === "https://www.inside-m2m.de"],
    ["Ablauf: nacheinander, nie zwei Abrufe gleichzeitig", full.overlapped() === false],
    ["Wiederholung: Firmenseite wird nicht doppelt geladen", repeated === 0],
    ["Knopf nach dem Import wieder frei", full.button.disabled === false && full.button.textContent === "Webadresse der Stellenanzeige"],

    // Anzeige im Kopfbereich
    ["Anzeige: Hauptseite, Nebenseite, Firmenseite in dieser Reihenfolge", fullTexts.join(" | ") === [
        "Hauptseite wird geladen ...", "Hauptseite geladen",
        "Nebenseite wird geladen ...", "Nebenseite geladen",
        "Firmenseite wird geladen ...", "Firmenseite geladen"].join(" | ")],
    ["Anzeige: beim Laden sichtbar mit Seitenart", whileLoading.hidden === false && whileLoading.text === "Hauptseite wird geladen ..."],
    ["Anzeige: nach dem Abruf Ergebnis sichtbar", afterEnd.hidden === false && afterEnd.text === "Hauptseite geladen"],
    ["Anzeige: nächster Abruf ersetzt die Anzeige sofort", nextPage.text === "Nebenseite wird geladen ..." && nextPage.hidden === false],
    ["Anzeige: Fehler wird genannt", failed.text === "Nebenseite nicht geladen"],
    ["Anzeige: ausblenden leert den Text", hidden.hidden === true && hidden.text === ""],
    ["Anzeige: ohne Element im Kopfbereich kein Fehler", noElementOk],
    ["Kopfbereich: Anzeige rechts unten vorbereitet (importStatus, ausgeblendet)", /<span id="importStatus" class="import-status"[^>]*hidden>/.test(header) && header.includes("edit-header")],
    ["Seitenarten haben Namen und Texte", ["main", "side", "company"].every(kind => ImportConstants.PAGE[kind].label && ImportConstants.PAGE[kind].busy && ImportConstants.PAGE[kind].done)
        && ImportConstants.PAGE.main.label === "Hauptseite" && ImportConstants.PAGE.side.label === "Nebenseite" && ImportConstants.PAGE.company.label === "Firmenseite"],

    // Firmenseite
    ["Ohne Webadresse wird keine Firmenseite geladen", lonely.events.join() === `load:${MAIN}`],
    ["Firmenseite nicht erreichbar: Hinweis, Hauptseite und Nebenseite bleiben", broken.app.importedRawData.map(entry => entry.url).join() === [MAIN, ABOUT].join()
        && brokenToasts.some(toast => toast.type === "info" && toast.message.startsWith("Firmenseite nicht übernommen"))],
    ["Firmenseite nicht erreichbar: Anzeige nennt den Fehler", broken.texts.at(-1) === "Firmenseite nicht geladen"],
    ["Firmenseite mit zu wenig Text: nicht übernommen, mit Grund", thin.app.importedRawData.length === 2
        && thinToasts.some(toast => toast.message.includes("kaum Text"))],
    ["Lesezeichen: Info-Seite mit HTML, danach Firmenseite", bookmarkletUrls.join() === [ABOUT, SITE].join() && bookmarkletLoads.join() === `load:${SITE}`],
    ["Webadresse: ohne Schema wird https ergänzt", site("www.firma-test.de") === "https://www.firma-test.de/"],
    ["Webadresse: leer bleibt leer", site("") === "" && site("   ") === ""],
    ["Webadresse: LinkedIn ist keine Firmenseite", site("https://www.linkedin.com/company/inside-m2m/") === ""],
    ["Webadresse: ungültig ergibt leer", site("http://") === ""]
];

let failedCount = 0;
for (const [name, ok] of checks) {
    if (ok) console.log(`OK     | ${name}`);
    else { failedCount++; console.log(`FEHLER | ${name}`); }
}

console.log(failedCount ? `\n=== ${failedCount} VON ${checks.length} FEHLGESCHLAGEN ===` : "\n=== ALLE TESTS OK ===");
process.exit(failedCount ? 1 : 0);
