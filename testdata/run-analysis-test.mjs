import fs from "fs";
import { Analyzer } from "../js/analysis/Analyzer.js";
import { ParseText } from "../js/analysis/parser/ParseText.js";
import { FormatUtils } from "../js/utils/FormatUtils.js";
import { CompanyTemplate } from "../js/templates/detail/CompanyTemplate.js";
import { ContactTemplate } from "../js/templates/detail/ContactTemplate.js";
import { ContactEditTab } from "../js/views/edit/ContactEditTab.js";
import { CompanyEditTab } from "../js/views/edit/CompanyEditTab.js";
import { AnalysisController } from "../js/controllers/edit/AnalysisController.js";
import { ContactPromptTemplate } from "../js/templates/windows/ContactPromptTemplate.js";
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

const analysisController = new AnalysisController();

const editTab = new ContactEditTab(fakeRoot, { save: async () => {} });
editTab.init(app);
analysisController.apply(app, result);
analysisController.apply(app, result); // erneuter Lauf darf nicht duplizieren

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

// Kontakt-Vollständigkeit: Titel, Position, E-Mail und Telefon aus dem Kontaktblock.
const contactText = [
    "Herr Prof. Dr. Hans-Jorg Beispiel",
    "Geschaeftsfuehrer",
    "Frau Dr. Anna Mustermann",
    "Leiterin Recruiting",
    "Telefon: +49 89 1234567",
    "E-Mail: anna.mustermann@beispiel.de"
].join("\n");
const contactResult = new Analyzer().analyze(contactText);
const [firstContact, secondContact] = contactResult.contacts;

const contactDataChecks = [
    ["Zweiter Ansprechpartner erkannt", firstContact?.name?.lastname === "Beispiel"],
    ["Titel erkannt", secondContact?.name?.title === "Dr"],
    ["Titel, Vor- und Nachname getrennt", secondContact?.name?.firstname === "Anna" && secondContact?.name?.lastname === "Mustermann"],
    ["Position aus der Folgezeile", secondContact?.role === "Leiterin Recruiting"],
    ["E-Mail aus dem Kontaktblock", secondContact?.email === "anna.mustermann@beispiel.de"],
    ["Telefon aus dem Kontaktblock", secondContact?.phone === "+49 89 1234567"],
    ["Kontakt ohne eigene Nummer erbt den Wert aus dem Anzeigentext",
        firstContact?.phone === "+49 89 1234567" || firstContact?.email === "anna.mustermann@beispiel.de"],
];

for (const [label, ok] of contactDataChecks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

// Ersatzkontakt aus den Firmendaten, wenn die Analyse keinen Ansprechpartner liefert.
const fallbackApp = new AppModel();
fallbackApp.company.name = "Muster GmbH";
fallbackApp.company.email = "kontakt@muster.de";
fallbackApp.company.phone = "089 9876543";
fallbackApp.job.title = "Softwareentwickler";

analysisController.apply(fallbackApp, { contacts: [] });

const fallbackContact = fallbackApp.contacts[0];

const fallbackChecks = [
    ["Ersatzkontakt wird im Model gespeichert", fallbackApp.contacts.length === 1],
    ["Ersatzkontakt: Firmenname als Name", fallbackContact?.name?.lastname === "Muster GmbH"],
    ["Ersatzkontakt: Firmen-E-Mail übernommen", fallbackContact?.email === "kontakt@muster.de"],
    ["Ersatzkontakt: Firmen-Telefon übernommen", fallbackContact?.phone === "089 9876543"],
    ["Ersatzkontakt: Position aus der Stellenbezeichnung", fallbackContact?.role === "Softwareentwickler"],
    ["Erneuter Lauf dupliziert den Ersatzkontakt nicht", (() => {
        analysisController.apply(fallbackApp, { contacts: [] });
        return fallbackApp.contacts.length === 1;
    })()]
];

for (const [label, ok] of fallbackChecks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

// Firmendaten aus der Analyse landen sofort im Model und im Kontakt-Reiter.
const fields = {};
const imageContainer = {
    innerHTML: "",
    querySelectorAll: () => [],
    querySelector: () => ({ onclick: null })
};
const companyRoot = {
    querySelector: selector => {
        if (selector === "#companyImages") return imageContainer;
        if (!fields[selector]) fields[selector] = { value: "" };
        return fields[selector];
    },
    querySelectorAll: () => []
};

const companyApp = new AppModel();
const companyTab = new CompanyEditTab(companyRoot);
companyTab.init(companyApp);

analysisController.apply(companyApp, {
    company: {
        name: "Analyse GmbH",
        email: "kontakt@analyse.de",
        phone: "089 1112223",
        website: "https://analyse.de",
        legalForm: "GMBH",
        specialties: ["IT"]
    }
});

// Reiter lesen nur noch aus dem Model: init() statt applyAnalysis().
companyTab.init(companyApp);

const contactSection = { innerHTML: "" };
const contactRoot = {
    querySelector: selector => selector === "#contactSection" ? contactSection : null,
    querySelectorAll: () => []
};

const companyContactTab = new ContactEditTab(contactRoot, { save: async () => {} });
companyContactTab.init(companyApp);

const companyContactHtml = new ContactTemplate().render(companyApp);

const modelSyncChecks = [
    ["Analyse-Firmenname im Model", companyApp.company.name === "Analyse GmbH"],
    ["Analyse-Firmen-E-Mail im Model", companyApp.company.email === "kontakt@analyse.de"],
    ["Analyse-Firmen-Telefon im Model", companyApp.company.phone === "089 1112223"],
    ["E-Mail steht im Firmen-Reiter-Feld", fields["#companyEmail"]?.value === "kontakt@analyse.de"],
    ["Ersatzkontakt aus Firmendaten erzeugt", companyApp.contacts.length === 1],
    ["Kontakt-Reiter zeigt die Firmen-E-Mail", companyContactHtml.includes("kontakt@analyse.de")],
    ["Kontakt-Reiter zeigt das Firmen-Telefon", companyContactHtml.includes("089 1112223")],
    ["Kontakt-Reiter zeigt den Firmennamen", companyContactHtml.includes("Analyse GmbH")]
];

for (const [label, ok] of modelSyncChecks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

// Kontakt-Popup: alle Model-Werte werden in das Fenster übernommen.
const promptModel = fallbackApp.contacts[0];
promptModel.name.title = "Dr";
promptModel.role = "Leiter Recruiting";
promptModel.email = "anna.mustermann@beispiel.de";
promptModel.phone = "+49 89 1234567";
promptModel.img = "https://beispiel.de/anna.png";

const promptHtml = new ContactPromptTemplate().create(promptModel, "Ansprechpartner ändern");

const promptChecks = [
    ["Popup zeigt Nachname aus dem Model", promptHtml.includes('id="contact-lastname" value="Muster GmbH"')],
    ["Popup zeigt Titel aus dem Model", promptHtml.includes('id="contact-title" value="Dr"')],
    ["Popup zeigt Position aus dem Model", promptHtml.includes('id="contact-role" value="Leiter Recruiting"')],
    ["Popup zeigt E-Mail aus dem Model", promptHtml.includes('id="contact-email" type="email" value="anna.mustermann@beispiel.de"')],
    ["Popup zeigt Telefon aus dem Model", promptHtml.includes('id="contact-phone" value="+49 89 1234567"')],
    ["Popup zeigt Bild aus dem Model", promptHtml.includes('id="contact-img" type="url" value="https://beispiel.de/anna.png"')]
];

for (const [label, ok] of promptChecks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

const primaryApp = new AppModel();
primaryApp.company.name = "Primär GmbH";
primaryApp.company.email = "office@primaer.de";
primaryApp.company.phone = "030 5551212";
analysisController.apply(primaryApp, { company: {}, contacts: [] });

const primaryContact = primaryApp.primaryContact;

const primaryChecks = [
    ["Ersatzkontakt liegt in der Kontaktliste", primaryApp.contacts.length === 1],
    ["Ersatzkontakt hat eine eigene ID", !!primaryContact?.id],
    ["job.contactId zeigt auf den Ersatzkontakt", primaryApp.job.contactId === primaryContact?.id],
    ["AppModel.primaryContact liefert den Ersatzkontakt", primaryContact?.name?.lastname === "Primär GmbH"],
    ["UiContact nutzt denselben Primärkontakt", new UiContact(primaryApp).email === "office@primaer.de"],
    ["Kontaktliste markiert den Primärkontakt als aktiv",
        new ContactTemplate().render(primaryApp).includes("contact-row active")],
    ["Anzeige und Popup nutzen dieselbe ID",
        new ContactTemplate().render(primaryApp)
            .includes(`data-edit-contact="${primaryContact?.id}"`) &&
        new ContactPromptTemplate().create(new UiContact(primaryApp).contact)
            .includes('id="contact-email" type="email" value="office@primaer.de"')]
];

for (const [label, ok] of primaryChecks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

// Ersatzkontakt wird bei späteren Firmenaenderungen aktualisiert.
const refreshApp = new AppModel();
refreshApp.company.name = "Refresh GmbH";
analysisController.apply(refreshApp, { company: {}, contacts: [] });
refreshApp.company.email = "neu@refresh.de";
refreshApp.company.phone = "030 9998887";
analysisController.ensureCompanyContact(refreshApp);

const refreshContact = refreshApp.primaryContact;
const refreshHtml = new ContactPromptTemplate().create(refreshContact, "Ansprechpartner ändern");

const refreshChecks = [
    ["E-Mail des Ersatzkontakts wird aktualisiert", refreshContact?.email === "neu@refresh.de"],
    ["Telefon des Ersatzkontakts wird aktualisiert", refreshContact?.phone === "030 9998887"],
    ["Kein zweiter Kontakt entstanden", refreshApp.contacts.length === 1],
    ["Popup zeigt die aktualisierte E-Mail", refreshHtml.includes('value="neu@refresh.de"')],
    ["Popup zeigt das aktualisierte Telefon", refreshHtml.includes('value="030 9998887"')]
];

for (const [label, ok] of refreshChecks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

// Kontaktblock ueber Adress- und Firmenzeilen hinweg (Leerzeilen, Stop-Marker).
const blockText = [
    "Ihr Ansprechpartner",
    "Herr Dr. Max Mustermann",
    "Leiter Personal recruiting",
    "Muster GmbH",
    "Sophie-Scholl-Straße 6",
    "10469 Berlin",
    "",
    "Durchwahl: 030 1234567",
    "E-Mail: max.mustermann@muster.de",
    "",
    "Über uns",
    "Wir sind seit 1998 am Markt und wachsen stark.",
    "Zentrale: 030 9999999",
    "kontakt@muster.de"
].join("\n");

const blockContacts = new Analyzer().analyze(blockText).contacts;
const blockContact = blockContacts[0];

const blockChecks = [
    ["Ansprechpartner trotz Adressblock erkannt", blockContact?.name?.lastname === "Mustermann"],
    ["Position vor der Adresse erkannt", blockContact?.role === "Leiter Personal recruiting"],
    ["Telefon nach Adressblock und Leerzeile erkannt", blockContact?.phone === "030 1234567"],
    ["E-Mail nach Adressblock und Leerzeile erkannt", blockContact?.email === "max.mustermann@muster.de"],
    ["Stop-Marker 'Über uns' begrenzt den Kontaktblock",
        blockContact?.phone === "030 1234567" && blockContact?.email === "max.mustermann@muster.de"]
];

for (const [label, ok] of blockChecks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

// Kontakt ohne eigene Nummer: Fallback auf Zentrale bzw. Firmenadresse.
const fallbackText = [
    "Ihr Ansprechpartner",
    "Herr Dr. Max Mustermann",
    "Leiter Personal recruiting",
    "",
    "Über uns",
    "Zentrale: 030 9999999",
    "kontakt@muster.de"
].join("\n");

const fallbackExtracted = new Analyzer().analyze(fallbackText).contacts[0];

const fallbackValueChecks = [
    ["Telefon aus der Zentrale übernommen", fallbackExtracted?.phone === "030 9999999"],
    ["E-Mail der Firma übernommen", fallbackExtracted?.email === "kontakt@muster.de"],
    ["Eigene Kontaktnummer hat Vorrang", blockContact?.phone === "030 1234567"]
];

for (const [label, ok] of fallbackValueChecks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

const imageApp = new AppModel();
imageApp.company.name = "Bild GmbH";
analysisController.apply(imageApp, { company: {}, contacts: [] });
imageApp.primaryContact.img = "https://bild.de/portrait.png";

const noImageApp = new AppModel();
noImageApp.company.name = "Ohne Bild GmbH";
analysisController.apply(noImageApp, { company: {}, contacts: [] });

const imageChecks = [
    ["Bild aus dem Model wird angezeigt",
        new ContactTemplate().render(imageApp)
            .includes('src="https://bild.de/portrait.png"')],
    ["Bild erbt die Icon-Klasse",
        new ContactTemplate().render(imageApp).includes('class="section-icon section-icon--image"')],
    ["Bild bekommt den Namen als Alternativtext",
        new ContactTemplate().render(imageApp).includes('alt="Bild GmbH"')],
    ["Ohne Bild bleibt das Emoji",
        new ContactTemplate().render(noImageApp).includes('<span class="section-icon">👤</span>')],
    ["Ohne Bild wird kein img gerendert",
        !new ContactTemplate().render(noImageApp).includes("<img")]
];

for (const [label, ok] of imageChecks) {
    console.log(`${ok ? "OK    " : "FEHLER"} | ${label}`);
    if (!ok) failed++;
}

console.log("\n" + (failed === 0 ? "=== ALLE TESTS OK ===" : `=== ${failed} FEHLER ===`));
process.exit(failed === 0 ? 0 : 1);