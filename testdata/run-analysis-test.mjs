import fs from "fs";
import { Analyzer } from "../js/analysis/Analyzer.js";
import { ParseText } from "../js/analysis/parser/ParseText.js";
import { FormatUtils } from "../js/utils/FormatUtils.js";
import { CompanyTemplate } from "../js/templates/detail/CompanyTemplate.js";
import { ContactTemplate } from "../js/templates/detail/ContactTemplate.js";
import { ContactEditTab } from "../js/views/edit/ContactEditTab.js";
import { UiContact } from "../js/ui/detail/UiContact.js";
import { AppModel } from "../js/models/AppModel.js";

// Verifiziert die Sprint-Punkte aus AI/workflow/WORKFLOW.md am Ferchau-Beispieltext.
const samplePath = new URL("../dok/Beispiel_Ferchau.txt", import.meta.url);
const text = fs.readFileSync(samplePath, "utf8");

const result = new Analyzer().analyze(text);
const company = result.company;

console.log("=== Firmendaten (Ferchau-Beispiel) ===");
console.log(JSON.stringify(company, null, 2));
console.log("");

const sections = new ParseText(text).parse().sections;
const benefitsLines = sections.benefits?.lines ?? [];
const companyInfoLines = sections.companyInformation?.lines ?? [];

const checks = [
    ["Land ist ausgeschrieben (Deutschland)", company.location?.country === "Deutschland"],
    ["Webseite ist eine URL (kein [object Object])", /^https?:\/\//.test(company.website ?? "")],
    ["Branche gefüllt", !!company.industry],
    ["Mitarbeiter/Groesse gefüllt", !!company.size],
    ["Gegruendet gefüllt", !!company.founded],
    ["Verifiziert gesetzt (ISO-Datum)", /^\d{4}-\d{2}-\d{2}$/.test(company.verifiedAt ?? "")],
    ["Spezialgebiete als Liste", Array.isArray(company.specialties) && company.specialties.length > 0],
    ["Firmenbeschreibung gefüllt", !!company.description],
    ["Rechtsform = GMBH", company.legalForm === "GMBH"],
    ["Datum '15. Juni 2023' -> 15.06.2023", FormatUtils.toGermanDate("15. Juni 2023") === "15.06.2023"],
    ["Beschreibung ohne Stellenbezeichnung '(m/w/d)'", !/\(m\/w\/d\)/.test(company.description ?? "")],
    ["'Im Fokus' als Benefits eingeordnet", benefitsLines.some(line => line.includes("Berufliche Weiterbildung"))],
    ["Weiterbildungs-Prosa nicht mehr in companyInformation", !companyInfoLines.some(line => line.includes("Berufliche Weiterbildung"))]
];

let failed = 0;
for (const [label, ok] of checks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

// Render-Smoke-Test: Analyseergebnis in ein Model überführen und die Detailansicht rendern.
const app = new AppModel();
app.company.name = company.name;
app.company.legalForm = company.legalForm;
app.company.industry = company.industry;
app.company.size = company.size;
app.company.founded = company.founded;
app.company.website = company.website;
app.company.verifiedAt = company.verifiedAt;
app.company.description = company.description;
app.company.specialties = company.specialties;
app.company.address.data = {
    street: company.street?.name,
    houseNumber: company.street?.houseNumber,
    zip: company.location?.zip,
    city: company.location?.city,
    country: company.location?.country
};

const html = new CompanyTemplate().render(app);
const renderChecks = [
    ["Detail zeigt Rechtsform mit 'GmbH'", html.includes("Rechtsform") && html.includes("GmbH")],
    ["Detail zeigt Verifiziert als 15.06.2023", html.includes("15.06.2023")],
    ["Detail zeigt Land Deutschland", html.includes("Deutschland")],
    ["Detail zeigt Branche", html.includes("Ingenieurdienstleistungen")]
];

for (const [label, ok] of renderChecks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

// Kontakt-Test: Analyseergebnis in das Model und in den Editor-Kontakt-Reiter übernehmen.
const container = { innerHTML: "" };
const fakeRoot = {
    querySelector: selector => selector === "#contactSection" ? container : null,
    querySelectorAll: () => []
};

const editTab = new ContactEditTab(fakeRoot, { save: async () => {} });
editTab.init(app);
editTab.applyAnalysis(result);
editTab.applyAnalysis(result); // erneuter Lauf darf nicht duplizieren

const contactHtml = new ContactTemplate().render(app);
const emptyApp = new AppModel();
emptyApp.company.name = "Muster GmbH";

const contactChecks = [
    ["Kontakt extrahiert (Anzahl)", result.contacts?.length === 1],
    ["Kontakt-Salutation 'Herr'", result.contacts?.[0]?.name?.salutation === "Herr"],
    ["Kontaktname 'Luca Derjung'", result.contacts?.[0]?.name?.firstname === "Luca" && result.contacts?.[0]?.name?.lastname === "Derjung"],
    ["Kontakt-Rolle 'Talent Acquisition Specialist'", result.contacts?.[0]?.role === "Talent Acquisition Specialist"],
    ["Editor-Transfer: Kontakt im Model", app.contacts.length === 1],
    ["Editor-Transfer: kein Duplikat bei erneutem Lauf", app.contacts.length === 1],
    ["Kontaktliste zeigt den Ansprechpartner", contactHtml.includes("Luca Derjung") && contactHtml.includes("contact-row")],
    ["UiContact nutzt Firmendaten ohne Ansprechpartner", new UiContact(emptyApp).name === "Muster GmbH"]
];

for (const [label, ok] of contactChecks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

console.log("\n" + (failed === 0 ? "=== ALLE TESTS OK ===" : `=== ${failed} FEHLER ===`));
process.exit(failed === 0 ? 0 : 1);