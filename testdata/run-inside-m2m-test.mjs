import fs from "fs";
import { Analyzer } from "../js/analysis/Analyzer.js";
import { RequirementSplitter } from "../js/analysis/parser/RequirementSplitter.js";
import { BranchExtractor } from "../js/analysis/extractors/BranchExtractor.js";
import { IndustryConstants } from "../js/constants/IndustryConstants.js";
import { AnalysisController } from "../js/controllers/edit/AnalysisController.js";
import { AppModel } from "../js/models/AppModel.js";
import { CompanyModel } from "../js/models/CompanyModel.js";

// Prüft die Sprint-Punkte zu Aufgaben/Anforderungen, Firmendaten und Standorten
// am LinkedIn-Beispiel INSIDE M2M (Stellenseite und Info-Seite der Firma).
const read = name => fs.readFileSync(new URL(`../dok/${name}`, import.meta.url), "utf8");
const jobText = read("Beispiel_LinkedIn_InsideM2M.txt");
const infoText = read("Beispiel_LinkedIn_InsideM2M_Info.txt");

const quiet = fn => {
    const original = console.log;
    console.log = () => {};
    try { return fn(); } finally { console.log = original; }
};

const jobOnly = quiet(() => new Analyzer().analyze(jobText));
const both = quiet(() => new Analyzer().analyze(`${jobText}\n\n----\n\n${infoText}`));

const has = (lines, part) => lines.some(line => line.includes(part));
const q = jobOnly.qualifications;
const tasks = jobOnly.job.tasks;

const app = new AppModel();
new AnalysisController().apply(app, both);
const roundTrip = new CompanyModel();
roundTrip.data = JSON.parse(JSON.stringify(app.company.data));

const checks = [
    // 1. Aufgaben und Anforderungen getrennt
    ["Aufgaben: 7 Einträge", tasks.length === 7],
    ["Aufgaben enthalten keine Anforderungen", !has(tasks, "verfügst") && !has(tasks, "Erfahrung in") && !has(tasks, "Teamfähigkeit")],
    ["Anforderung 'abgeschlossenes Studium' in required", has(q.required.content, "abgeschlossenes Studium")],
    ["'Erfahrung in folgenden Gebieten:' in required", has(q.required.content, "Erfahrung in folgenden Gebieten")],
    ["Unterpunkte (Git, Docker, Adobe XD, TypeScript) bei Erfahrung", ["Git", "Docker", "Grafikdesign, Adobe XD", "gute Kenntnisse in TypeScript"].every(x => q.required.content.includes(x))],
    ["'fließende ... Kenntnisse' in required", has(q.required.content, "fließende Deutsch")],
    ["persönliche Eigenschaften in personal", has(q.personal.content, "eigenverantwortlich") && has(q.personal.content, "Teamfähigkeit")],
    ["Nichts doppelt", [...q.required.content, ...q.personal.content, ...q.preferred.content].length === 14],
    ["RequirementSplitter: ohne Marker bleibt alles Aufgabe", new RequirementSplitter().split(["Du baust Software", "Du testest"]).requirements.length === 0],
    ["RequirementSplitter: abgeschlossen + Berufsausbildung", new RequirementSplitter().isRequirement("Eine abgeschlossene Berufsausbildung als Fachinformatiker")],

    // 3./4. Firmendaten aus der Stellenseite
    ["Gegründet 2004 (Firmengründung im Jahr 2004)", jobOnly.company.founded === "2004"],
    ["Mitarbeiter 51-200", jobOnly.company.size === "51-200"],
    ["Branche 'IT-Dienstleistungen und IT-Beratung'", jobOnly.company.industry === "IT-Dienstleistungen und IT-Beratung"],
    ["Standorte: Anzahl 3 ('an drei Standorten')", jobOnly.company.branches.count === 3],
    ["Standorte: Liste Garbsen, Bissendorf, Berlin", JSON.stringify(jobOnly.company.branches.locations) === JSON.stringify(["Garbsen", "Bissendorf", "Berlin"])],
    ["Keine Jahreszahl als Straße", !jobOnly.company.street?.name],
    ["Keine Zahl als Webadresse", !/\/\/\d/.test(jobOnly.company.website ?? "")],

    // Info-Seite zusätzlich
    ["Info-Seite: Hauptsitz Berenbosteler Str. 76 B", both.company.street?.name === "Berenbosteler Str." && both.company.street?.houseNumber === "76 B"],
    ["Info-Seite: PLZ/Ort 30823 Garbsen", both.company.location?.zip === "30823" && both.company.location?.city === "Garbsen"],
    ["Info-Seite: 3 Standorte mit Adresse", both.company.branches.count === 3 && both.company.branches.locations.every(x => /\d{5}$/.test(x))],
    ["Info-Seite: Telefon", both.company.phone === "0049 5137 90950-11"],
    ["Info-Seite: Website", both.company.website === "https://www.inside-m2m.de"],
    ["Info-Seite: Spezialgebiete als Liste", both.company.specialties.length >= 10],
    ["Info-Seite: Arbeitsmodell Hybrid", both.job.workModel.includes("Hybrid")],
    ["Beschreibung ohne doppelte Zeilen", new Set(both.company.description.split("\n")).size === both.company.description.split("\n").length],
    ["Beschreibung ohne Kopfzeilen-Reste", !/verknüpfte Mitglieder|Follower|51-200/.test(both.company.description)],

    // Eigentumsform (ownership) getrennt von der Rechtsform
    ["Info-Seite: Typ 'Privatunternehmen' als ownership", both.company.ownership === "Privatunternehmen"],
    ["Rechtsform bleibt GmbH, ownership ist ein anderes Feld", both.company.legalForm.toLowerCase() === "gmbh" && both.company.ownership !== both.company.legalForm],
    ["Ohne Info-Seite keine erfundene Eigentumsform", jobOnly.company.ownership === ""],
    ["Model: ownership im Rundlauf", app.company.ownership === "Privatunternehmen" && roundTrip.ownership === "Privatunternehmen"],

    // Model
    ["Model: BranchModel gefüllt", app.company.branches.count === 3 && app.company.branches.locations.length === 3],
    ["Model: data-Rundlauf (JSON) behält Standorte", roundTrip.branches.count === 3 && roundTrip.branches.locations.length === 3],

    // Branchen-Zuordnung
    ["IndustryConstants: IT-Dienstleistungen -> IT_SERVICES", IndustryConstants.match("IT-Dienstleistungen und IT-Beratung") === "IT_SERVICES"],
    ["IndustryConstants: Maschinenbau", IndustryConstants.match("Maschinen- und Anlagenbau") === "MECHANICAL_ENGINEERING"],
    ["IndustryConstants: unbekannt -> leer", IndustryConstants.match("Sonstiges") === ""],
    ["BranchExtractor: 'an zwei Standorten' -> 2", new BranchExtractor(["Wir sind an zwei Standorten."]).extract().count === 2]
];

let failed = 0;
for (const [label, ok] of checks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

console.log(failed ? `\n=== ${failed} FEHLER ===` : "\n=== ALLE TESTS OK ===");
process.exit(failed ? 1 : 0);
