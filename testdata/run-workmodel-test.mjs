import fs from "fs";
import { Analyzer } from "../js/analysis/Analyzer.js";
import { WorkModelExtractor } from "../js/analysis/extractors/WorkModelExtractor.js";
import { AnalysisController } from "../js/controllers/edit/AnalysisController.js";
import { WorkModelConstants } from "../js/constants/WorkModelConstants.js";
import { AppModel } from "../js/models/AppModel.js";
import { JobModel } from "../js/models/JobModel.js";
import { WorkDayModel } from "../js/models/WorkDayModel.js";
import { WorkModel } from "../js/models/WorkModel.js";
import { JobTemplate } from "../js/templates/detail/JobTemplate.js";
import { JobEditTemplate } from "../js/templates/edit/JobEditTemplate.js";
import { OverviewFilter } from "../js/ui/overview/OverviewFilter.js";
import { JobEditTab } from "../js/views/edit/JobEditTab.js";

// Prüft das ArbeitsModell (AI/workflow/WORKFLOW.md): Models, Erkennung, Editor, Übersichtsfilter, Detailansicht.
const read = name => fs.readFileSync(new URL(`../dok/${name}`, import.meta.url), "utf8");
const quiet = fn => {
    const original = console.log;
    console.log = () => {};
    try { return fn(); } finally { console.log = original; }
};
const analyze = text => quiet(() => new Analyzer().analyze(text));
const extract = (general, all = general, extra = {}) =>
    new WorkModelExtractor({ general: { lines: general }, ...extra }, all).extract();
const words = text => text.split(/\s+/).filter(Boolean).length;

const jobText = read("Beispiel_LinkedIn_InsideM2M.txt");
const infoText = read("Beispiel_LinkedIn_InsideM2M_Info.txt");
const topCard = ["Frontend Developer (M/W/D)", "INSIDE M2M", "Osnabrück, Niedersachsen, Deutschland",
    "Vor 2 Monaten", "Hybrid", "Vollzeit", "Bewerben"].join("\n");

// ---------- Models ----------
const empty = new WorkModel();
const loaded = new WorkModel();
loaded.data = {
    type: ["Vollzeit", "Teilzeit"],
    workTime: ["Gleitzeit"],
    workDays: [{ type: "Hybrid", days: 5, onSite: 3, remote: 2 }],
    notes: ["Einige Bereiche mit täglicher Präsenz"]
};
const legacyList = new WorkModel();
legacyList.data = ["Vor Ort", "Hybrid", "Remote"];
const legacyJob = new JobModel();
legacyJob.data = { employmentType: "Teilzeit", workModel: ["Hybrid"] };
const cleanJob = new JobModel();
cleanJob.data = JSON.parse(JSON.stringify(legacyJob.data));

// ---------- Erkennung ----------
const info = analyze(`${jobText}\n\n----\n\n${infoText}`).job.workModel;
const topInfo = analyze(`${topCard}\n\n----\n\n${infoText}`).job.workModel;
const hybrid = info.workDays[0];

const multi = extract(["Vollzeit", "Teilzeit", "Remote", "Hybrid", "Home Office"]);
const times = extract(["Gleitzeit", "Nachtschicht", "Keine Schichtarbeit", "Bereitschaftsdienst"]);
const proseTime = extract(["Wir bieten dir Gleitzeit und viele weitere Vorteile in einem sehr netten Team hier vor Ort"]);
const free = extract(["Hybrid"], ["Hybrid", "Du arbeitest 2 Tage pro Woche im Homeoffice und 3 Tage vor Ort."]);
const presenceOnly = extract([], ["Übliche Anwesenheit vor Ort", "4 Tage pro Woche"]);
const long = extract(["Hybrid"], ["Arbeitsmodell: Hybrid", [
    "Nach erfolgreicher Probezeit arbeitest du zwei Tage im Homeoffice, einige Bereiche brauchen aber tägliche Präsenz im Büro,",
    "weil dort mit Kunden vor Ort gearbeitet wird und alle Beteiligten viele Absprachen treffen müssen, die sich nicht anders klären lassen."
].join(" ")]);
const noInfo = extract(["Vollzeit", "Bewerben"], ["Vollzeit", "Bewerben"]);
const ferchau = analyze(read("Beispiel_Ferchau.txt")).job;

// ---------- Übernahme, Editor ----------
const app = new AppModel();
app.job.workModel.data = { type: ["Teilzeit"], workTime: ["Gleitzeit"], notes: ["Alter Hinweis"] };
new AnalysisController().applyJob(app, { workModel: { type: [], workTime: [], workDays: [{ type: "Hybrid", days: 5, onSite: 3, remote: 2 }], notes: [] } });

const fields = {};
const checkbox = (cssClass, value) => ({ cssClass, value, checked: false });
const options = [
    ...WorkModelConstants.TYPE.map(value => checkbox("work-type-option", value)),
    ...WorkModelConstants.WORK_TIME.map(value => checkbox("work-time-option", value))
];
const row = type => {
    const inputs = {
        ".work-day__enabled": { checked: false },
        ".work-day__days": { value: "" },
        ".work-day__on-site": { value: "" },
        ".work-day__remote": { value: "" }
    };
    return { dataset: { type }, inputs, querySelector: selector => inputs[selector] };
};
const rows = WorkModelConstants.WORK_DAY_TYPES.map(row);
const root = {
    querySelector: selector => (fields[selector] ??= { value: "" }),
    querySelectorAll: selector => {
        if (selector === ".work-day") return rows;
        return options.filter(option => `.${option.cssClass}` === selector);
    }
};
const editTab = new JobEditTab(root);
const editApp = new AppModel();
editApp.job.workModel.data = {
    type: ["Vollzeit"], workTime: ["Nachtschicht"],
    workDays: [{ type: "Hybrid", days: 5, onSite: 3, remote: 2 }],
    notes: ["Einige Bereiche mit täglicher Präsenz", "Nach der Probezeit 2 Tage Homeoffice"]
};
editTab.init(editApp);
const rowOf = type => rows.find(entry => entry.dataset.type === type).inputs;
const shown = {
    vollzeit: options.find(option => option.value === "Vollzeit").checked,
    teilzeit: options.find(option => option.value === "Teilzeit").checked,
    nacht: options.find(option => option.value === "Nachtschicht").checked,
    notes: fields["#workNotes"].value,
    hybridOn: rowOf("Hybrid")[".work-day__enabled"].checked,
    hybridSite: rowOf("Hybrid")[".work-day__on-site"].value,
    hybridRemote: rowOf("Hybrid")[".work-day__remote"].value,
    vorOrtOn: rowOf("Vor Ort")[".work-day__enabled"].checked,
    vorOrtDefault: rowOf("Vor Ort")[".work-day__on-site"].value
};

options.find(option => option.value === "Teilzeit").checked = true;
options.find(option => option.value === "Vollzeit").checked = false;
options.find(option => option.value === "Nachtschicht").checked = false;
rowOf("Remote")[".work-day__enabled"].checked = true;
rowOf("Remote")[".work-day__days"].value = "4";
rowOf("Remote")[".work-day__on-site"].value = "";
rowOf("Hybrid")[".work-day__enabled"].checked = false;
fields["#workNotes"].value = "Erster Hinweis\n\n  Zweiter Hinweis  ";
const saveApp = new AppModel();
editTab.save(saveApp);
const saved = saveApp.job.workModel.data;

// ---------- Übersicht, Detailansicht, Template ----------
const filter = new OverviewFilter({ getAll: () => [] });
const hybridApp = new AppModel();
hybridApp.job.workModel.data = { type: ["Vollzeit"], workDays: [{ type: "Hybrid", days: 5, onSite: 3, remote: 2 }] };
const legacyRaw = { job: { employmentType: "Teilzeit", workModel: ["Remote"] } };

const detail = new JobTemplate().render(new AppModel());
const detailApp = new AppModel();
detailApp.job.workModel.data = {
    type: ["Vollzeit", "Teilzeit"], workTime: ["Gleitzeit"],
    workDays: [{ type: "Hybrid", days: 5, onSite: 3, remote: 2 }, { type: "Remote", days: 5, onSite: 0, remote: 5 }],
    notes: ["Übliche Anwesenheit vor Ort: 3 Tage pro Woche", "<b>Test</b>"]
};
const detailHtml = new JobTemplate().render(detailApp);
const editHtml = new JobEditTemplate().render();
const workDaysCss = fs.readFileSync(new URL("../css/content/work-days.css", import.meta.url), "utf8");

const checks = [
    // Models
    ["Leeres Model: type, workTime, workDays, notes leer", [empty.type, empty.workTime, empty.workDays, empty.notes].every(list => list.length === 0)],
    ["Model: Daten laden und wieder ausgeben (Rundlauf)", JSON.stringify(loaded.data) === JSON.stringify(JSON.parse(JSON.stringify(loaded.data)))
        && loaded.data.type.length === 2 && loaded.data.workDays[0].onSite === 3],
    ["Model: workDays sind WorkDayModel", loaded.workDays[0] instanceof WorkDayModel],
    ["Altdaten: Liste -> Arbeitstage mit Standardwerten", legacyList.workDays.length === 3 && legacyList.workDayTypes.join() === "Vor Ort,Hybrid,Remote"],
    ["Standard Vor Ort: 5 Tage, 5 vor Ort, 0 remote", JSON.stringify(legacyList.workDays[0].data) === JSON.stringify({ type: "Vor Ort", days: 5, onSite: 5, remote: 0 })],
    ["Standard Remote: 5 Tage, 0 vor Ort, 5 remote", JSON.stringify(legacyList.workDays[2].data) === JSON.stringify({ type: "Remote", days: 5, onSite: 0, remote: 5 })],
    ["Standard Hybrid: 5 Tage, Aufteilung unbekannt", legacyList.workDays[1].onSite === null && legacyList.workDays[1].remote === null && legacyList.workDays[1].days === 5],
    ["Altdaten: employmentType wird zu type", legacyJob.workModel.type.join() === "Teilzeit" && legacyJob.workModel.workDayTypes.join() === "Hybrid"],
    ["JobModel.data enthält kein employmentType mehr", !("employmentType" in legacyJob.data) && typeof legacyJob.data.workModel === "object" && !Array.isArray(legacyJob.data.workModel)],
    ["JobModel: Rundlauf nach Migration unverändert", JSON.stringify(cleanJob.data) === JSON.stringify(legacyJob.data)],
    ["Anzeigetext Hybrid ohne bekannte Tage: nur Typ", legacyList.workDays[1].label === "Hybrid" && new WorkDayModel("Hybrid").label === "Hybrid"],
    ["Anzeigetext: 3 Tage vor Ort · 2 Tage Homeoffice", loaded.workDays[0].label === "Hybrid (3 Tage vor Ort · 2 Tage Homeoffice)"],
    ["Anzeigetext: Einzahl 1 Tag", Object.assign(new WorkDayModel("Hybrid"), { onSite: 1, remote: 4 }).label === "Hybrid (1 Tag vor Ort · 4 Tage Homeoffice)"],

    // Erkennung: LinkedIn-Beispiel INSIDE M2M
    ["Info-Seite: Hybrid mit 5 Tagen", hybrid?.type === "Hybrid" && hybrid.days === 5],
    ["Info-Seite: 3 Tage vor Ort", hybrid?.onSite === 3],
    ["Info-Seite: 2 Tage Homeoffice", hybrid?.remote === 2],
    ["Info-Seite: genau ein Arbeitstage-Eintrag", info.workDays.length === 1],
    ["Info-Seite: Hinweis zur Probezeit im Originalwortlaut", info.notes.some(note => /^After a successful probationary period/.test(note))],
    ["Info-Seite: Hinweis zur täglichen Präsenz", info.notes.some(note => /daily presence/.test(note))],
    ["Info-Seite: Hinweis \"Übliche Anwesenheit vor Ort: 3 Tage pro Woche\"", info.notes.includes("Übliche Anwesenheit vor Ort: 3 Tage pro Woche")],
    ["Hinweise: keine doppelten", new Set(info.notes.map(note => note.toLowerCase())).size === info.notes.length],
    ["Hinweise: höchstens 20 Wörter", info.notes.every(note => words(note) <= WorkModelConstants.NOTE_MAX_WORDS)],
    ["Anzeige mit Kopfzeile: Vollzeit und Hybrid", topInfo.type.join() === "Vollzeit" && topInfo.workDays[0]?.type === "Hybrid" && topInfo.workDays[0].onSite === 3],
    ["Beispiel Ferchau: Vollzeit, Hybrid ohne bekannte Aufteilung", ferchau.workModel.type.join() === "Vollzeit" && ferchau.workModel.workDays[0]?.type === "Hybrid"
        && ferchau.workModel.workDays[0].onSite === null && ferchau.workModel.workDays[0].remote === null],
    ["Arbeitsmodell nicht doppelt als Badge", !ferchau.tags.includes("Hybrid") && !ferchau.tags.includes("Vollzeit")],

    // Erkennung: einzelne Fälle
    ["Mehrere Arten (Vollzeit und Teilzeit)", multi.type.join() === "Vollzeit,Teilzeit"],
    ["Mehrere Arbeitstage in Reihenfolge, Home Office = Homeoffice", multi.workDays.map(day => day.type).join() === "Hybrid,Homeoffice,Remote"],
    ["Remote: 0 vor Ort, 5 remote", JSON.stringify(multi.workDays[2]) === JSON.stringify({ type: "Remote", days: 5, onSite: 0, remote: 5 })],
    ["Arbeitszeit: Gleitzeit, Nachtschicht, Bereitschaftsdienst", times.workTime.join() === "Gleitzeit,Nachtschicht,Bereitschaftsdienst"],
    ["Arbeitszeit: Verneinung (\"Keine Schichtarbeit\") zählt nicht", !times.workTime.includes("Schichtarbeit")],
    ["Arbeitszeit: lange Fließtextzeile wird nicht ausgewertet", proseTime.workTime.length === 0],
    ["Fließtext: 2 Tage Homeoffice und 3 Tage vor Ort", free.workDays[0]?.remote === 2 && free.workDays[0]?.onSite === 3],
    ["Fließtext: Satz wird als Hinweis übernommen", free.notes.join() === "Du arbeitest 2 Tage pro Woche im Homeoffice und 3 Tage vor Ort."],
    ["Nur Anwesenheitszeile: Hybrid mit 4 Tage vor Ort, 1 Tag Homeoffice", presenceOnly.workDays[0]?.type === "Hybrid" && presenceOnly.workDays[0].onSite === 4 && presenceOnly.workDays[0].remote === 1],
    ["Zu langer Satz: Hinweise bleiben unter 20 Wörtern", long.notes.length >= 1 && long.notes.every(note => words(note) <= 20 && words(note) >= 3)],
    ["Ohne Angaben: leere Listen", noInfo.workDays.length === 0 && noInfo.workTime.length === 0 && noInfo.notes.length === 0 && noInfo.type.join() === "Vollzeit"],

    // Übernahme in das Model
    ["Übernahme: gefundene Arbeitstage ersetzen die alten", app.job.workModel.workDayTypes.join() === "Hybrid"],
    ["Übernahme: leere Funde lassen Art, Arbeitszeit und Hinweise unverändert", app.job.workModel.type.join() === "Teilzeit"
        && app.job.workModel.workTime.join() === "Gleitzeit" && app.job.workModel.notes.join() === "Alter Hinweis"],

    // Editor
    ["Editor: Art im Eingabefeld (nur Vollzeit)", shown.vollzeit === true && shown.teilzeit === false],
    ["Editor: Arbeitszeit im Eingabefeld", shown.nacht === true],
    ["Editor: Hinweise zeilengetrennt", shown.notes === "Einige Bereiche mit täglicher Präsenz\nNach der Probezeit 2 Tage Homeoffice"],
    ["Editor: Hybrid angehakt mit 3 vor Ort und 2 zuhause", shown.hybridOn === true && String(shown.hybridSite) === "3" && String(shown.hybridRemote) === "2"],
    ["Editor: nicht gesetzter Typ nicht angehakt, Standardwerte sichtbar", shown.vorOrtOn === false && String(shown.vorOrtDefault) === "5"],
    ["Editor speichern: Art aus den Haken", saved.type.join() === "Teilzeit"],
    ["Editor speichern: Arbeitszeit ohne Haken ist leer", saved.workTime.length === 0],
    ["Editor speichern: nur angehakte Arbeitstage", saved.workDays.length === 1 && saved.workDays[0].type === "Remote"],
    ["Editor speichern: Tage 4, leeres Feld bleibt null", saved.workDays[0].days === 4 && saved.workDays[0].onSite === null],
    ["Editor speichern: Hinweise ohne Leerzeilen", saved.notes.join("|") === "Erster Hinweis|Zweiter Hinweis"],
    ["Editor-Template: Auswahl für alle Arten und Arbeitszeiten", WorkModelConstants.TYPE.every(type => editHtml.includes(`value="${type}"`))
        && WorkModelConstants.WORK_TIME.every(time => editHtml.includes(`value="${time}"`))],
    ["Editor-Template: eine Zeile je Arbeitstage-Typ", (editHtml.match(/class="work-day"/g) ?? []).length === 4 && editHtml.includes('id="workNotes"')],

    ["Editor-CSS: Felder nicht gewählter Arbeitstage werden ausgeblendet, der Typ bleibt", /\.work-day:has\(\.work-day__enabled:not\(:checked\)\)\s+\.work-day__field\s*\{\s*display:\s*none/.test(workDaysCss)
        && !/\.work-day__type[^{]*\{[^}]*display:\s*none/.test(workDaysCss)],

    // Übersichtsfilter
    ["Filter Arbeitsmodell: Hybrid trifft", filter.matchesWorkModel(hybridApp, "Hybrid") && !filter.matchesWorkModel(hybridApp, "Remote")],
    ["Filter Arbeitsmodell: ohne Auswahl trifft immer", filter.matchesWorkModel(hybridApp, "")],
    ["Filter Art: Vollzeit trifft", filter.matchesEmploymentType(hybridApp, "Vollzeit") && !filter.matchesEmploymentType(hybridApp, "Teilzeit")],
    ["Filter: Altdaten (Liste und employmentType)", filter.matchesWorkModel(legacyRaw, "Remote") && filter.matchesEmploymentType(legacyRaw, "Teilzeit")],

    // Detailansicht
    ["Detailansicht: Arten mit Komma", detailHtml.includes("Vollzeit, Teilzeit")],
    ["Detailansicht: Arbeitszeit", detailHtml.includes("Gleitzeit")],
    ["Detailansicht: Arbeitstage mit Aufteilung", detailHtml.includes("Hybrid (3 Tage vor Ort · 2 Tage Homeoffice), Remote")],
    ["Detailansicht: Hinweise und Maskierung", detailHtml.includes("Übliche Anwesenheit vor Ort: 3 Tage pro Woche") && detailHtml.includes("&lt;b&gt;Test&lt;/b&gt;") && !detailHtml.includes("<b>Test</b>")],
    ["Detailansicht: ohne Daten Strich", typeof detail === "string" && /Beschäftigungsart<\/label>\s*<p>—<\/p>/.test(detail)]
];

let failed = 0;
for (const entry of checks) {
    const [name, result] = entry;
    if (result) console.log(`OK     | ${name}`);
    else { failed++; console.log(`FEHLER | ${name}`); }
}

console.log(failed ? `\n=== ${failed} VON ${checks.length} FEHLGESCHLAGEN ===` : "\n=== ALLE TESTS OK ===");
process.exit(failed ? 1 : 0);
