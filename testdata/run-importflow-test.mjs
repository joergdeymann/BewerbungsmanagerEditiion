import fs from "fs";
import { AnalysisController } from "../js/controllers/edit/AnalysisController.js";
import { ImportConstants } from "../js/constants/ImportConstants.js";
import { AppModel } from "../js/models/AppModel.js";
import { EditHeaderTemplate } from "../js/templates/edit/EditHeaderTemplate.js";
import { EditNavigationTemplate } from "../js/templates/edit/EditNavigationTemplate.js";
import { ImportStatus } from "../js/ui/edit/ImportStatus.js";
import { Toast } from "../js/views/windows/Toast.js";
import { ImportEditTab } from "../js/views/edit/ImportEditTab.js";
import { Analyzer } from "../js/analysis/Analyzer.js";

// Prüft den Ablauf eines Imports: Hauptseite, Nebenseite (LinkedIn /about/), danach immer die Firmenseite
// (Website der Firma), nacheinander, mit Anzeige der gerade geladenen Seite im Kopfbereich.
const read = name => fs.readFileSync(new URL(`../dok/${name}`, import.meta.url), "utf8");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
globalThis.document = { querySelector: () => null }; // importFromPayload wechselt auf den Import-Reiter
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
    tab.status = new ImportStatus(() => element, 0);
    tab.sideWait = null;
    tab.applyAnalysisToAllTabs = (analysis, mode) => (mode === "supplement" ? new AnalysisController().supplement(app, analysis) : new AnalysisController().apply(app, analysis));
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
await sleep(60);
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
await sleep(60);
const brokenToasts = [...Toast.last];

// 5. Firmenseite mit zu wenig Text wird nicht übernommen
Toast.last = [];
const thin = build({ ...pages, [SITE]: result(SITE, "Willkommen") });
await quiet(() => thin.tab.importPage(MAIN, () => thin.tab.urlImporter.fetch(MAIN), false, true, "dialog"));
const thinToasts = [...Toast.last];

// 6. Bookmarklet: Info-Seite mit HTML, danach die Firmenseite
const bookmarklet = build(pages, { website: "" });
await quiet(() => bookmarklet.tab.importCompanyPayload(ABOUT, "<html></html>"));
await sleep(30);
const bookmarkletUrls = bookmarklet.app.importedRawData.map(entry => entry.url);
const bookmarkletLoads = [...bookmarklet.events];

// 7. Adresse der Firmenseite
const sites = build({});
const site = value => { sites.app.company.website = value; return sites.tab.websiteUrl(); };

// 8. Anzeige im Kopfbereich
const shown = { hidden: true, text: "" };
const fake = () => ({ get hidden() { return shown.hidden; }, set hidden(value) { shown.hidden = value; }, set textContent(value) { shown.text = value; }, get textContent() { return shown.text; } });
const status = new ImportStatus(fake, 0);
status.begin("main");
const whileLoading = { ...shown };
status.end("main", true);
await sleep(15);
const afterEnd = { ...shown };
status.begin("side");
await sleep(15);
const nextPage = { ...shown };
status.end("side", false);
await sleep(15);
const failed = { ...shown };
status.hide();
const hidden = { ...shown };
const noElement = new ImportStatus(() => null, 0);
let noElementOk = true;
try { noElement.begin("company"); noElement.end("company"); } catch { noElementOk = false; }

// 8b. Mindestdauer und Reihenfolge schneller Schritte
const quick = { hidden: true, text: "", seen: [] };
const quickElement = { get hidden() { return quick.hidden; }, set hidden(value) { quick.hidden = value; }, set textContent(value) { quick.text = value; if (value) quick.seen.push(value); } };
const slow = new ImportStatus(() => quickElement, 40);
slow.begin("main");
slow.end("main", true);
slow.begin("side");
slow.end("side", true);
const instantly = quick.text;
await sleep(20);
const stillFirst = quick.text;
await sleep(200);
const quickSeen = [...quick.seen];

// 9. Lesezeichen: Hauptseite mit angekündigter Info-Seite
const marked = build(pages, { website: "" });
await quiet(() => marked.tab.importFromPayload({ url: MAIN, html: "<html></html>", aboutExpected: true, source: "bookmarklet" }));
await sleep(30);
const waitingTexts = [...marked.texts];
const waitingPending = marked.tab.status.pending;
const waitingLoads = [...marked.events];
await quiet(() => marked.tab.importFromPayload({ url: ABOUT, html: "<html></html>", optional: true, source: "bookmarklet" }));
await sleep(60);
const markedTexts = [...marked.texts];
const markedPending = marked.tab.status.pending;
const markedUrls = marked.app.importedRawData.map(entry => entry.url);

// 9b. Info-Seite kommt nicht an: Wartezeit endet mit Fehler
const lost = build(pages, { website: "" });
await quiet(() => lost.tab.importFromPayload({ url: MAIN, html: "<html></html>", aboutExpected: true, source: "bookmarklet" }));
const lostWaiting = lost.tab.status.pending;
lost.tab.releaseSide(false);
await sleep(30);
const lostTexts = [...lost.texts];

// 9c. Ohne angekündigte Info-Seite wird nicht gewartet
const direct = build(pages, { website: "" });
await quiet(() => direct.tab.importFromPayload({ url: MAIN, html: "<html></html>", aboutExpected: false, source: "bookmarklet" }));
await sleep(30);

const header = new EditHeaderTemplate().render(new AppModel());
const navigation = new EditNavigationTemplate().render();
const importCss = fs.readFileSync(new URL("../css/content/import-status.css", import.meta.url), "utf8");

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
    ["Anzeige: Mindestdauer, schnelle Schritte erscheinen alle und der Reihe nach", instantly === "Hauptseite wird geladen ..." && stillFirst === "Hauptseite wird geladen ..."
        && quickSeen.join(" | ") === ["Hauptseite wird geladen ...", "Hauptseite geladen", "Nebenseite wird geladen ...", "Nebenseite geladen"].join(" | ")],
    ["Lesezeichen: nach der Hauptseite steht \"Nebenseite wird geladen ...\" bis die Info-Seite ankommt", waitingTexts.join(" | ") === "Hauptseite wird geladen ... | Hauptseite geladen | Nebenseite wird geladen ..."
        && waitingPending === 1 && waitingLoads.length === 0],
    ["Lesezeichen: Info-Seite beendet das Warten, danach Firmenseite (nur aus Anzeige-Zustand geprüft)", markedPending === 0 && markedUrls.join() === [MAIN, ABOUT, SITE].join()
        && markedTexts.join(" | ") === ["Hauptseite wird geladen ...", "Hauptseite geladen", "Nebenseite wird geladen ...", "Nebenseite geladen",
            "Firmenseite wird geladen ...", "Firmenseite geladen"].join(" | ")],
    ["Lesezeichen: Info-Seite kommt nicht an, Warten endet mit Hinweis", lostWaiting === 1 && lostTexts.at(-1) === "Nebenseite nicht geladen" && lost.tab.status.pending === 0],
    ["Ohne angekündigte Info-Seite kein Warten", direct.tab.status.pending === 0 && direct.tab.sideWait === null],
    ["Anzeige: beim Laden sichtbar mit Seitenart", whileLoading.hidden === false && whileLoading.text === "Hauptseite wird geladen ..."],
    ["Anzeige: nach dem Abruf Ergebnis sichtbar", afterEnd.hidden === false && afterEnd.text === "Hauptseite geladen"],
    ["Anzeige: nächster Abruf ersetzt die Anzeige sofort", nextPage.text === "Nebenseite wird geladen ..." && nextPage.hidden === false],
    ["Anzeige: Fehler wird genannt", failed.text === "Nebenseite nicht geladen"],
    ["Anzeige: ausblenden leert den Text", hidden.hidden === true && hidden.text === ""],
    ["Anzeige: ohne Element im Kopfbereich kein Fehler", noElementOk],
    ["Kopfbereich: Anzeige in der unteren Zeile (Reiter), ausgeblendet bis zum Laden", /<span id="importStatusBar" class="import-status"[^>]*hidden>/.test(navigation)
        && navigation.indexOf("importStatusBar") > navigation.indexOf("</nav>") && !header.includes("import-status")],
    ["Kopfbereich: Anzeige steht rechts, ohne Verdeckung der Knöpfe", /\.import-status\s*\{[^}]*margin-left:\s*auto/.test(importCss) && !/position:\s*absolute/.test(importCss)],
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
