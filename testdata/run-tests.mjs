import { JobConstants } from "../js/constants/JobConstants.js";
import "fake-indexeddb/auto";
import fs from "fs";

import { AppModel } from "../js/models/AppModel.js";
import { ContactModel } from "../js/models/ContactModel.js";
import { ReferenceModel } from "../js/models/ReferenceModel.js";
import { ApplicationStatusHistoryModel } from "../js/models/ApplicationStatusHistoryModel.js";
import { ApplicationHistoryModel } from "../js/models/ApplicationHistoryModel.js";
import { AppDB } from "../js/data/AppDB.js";
import { LocalDB } from "../js/data/LocalDB.js";

const CHANNELS = ["portal", "email", "phone"];

function buildHistoryEntry(channel, i) {
    switch (channel) {
        case "portal":
            return {
                channel,
                entry: {
                    date: `2026-09-0${i}`,
                    portalName: `Portal ${i}`,
                    website: `https://portal${i}.example.com`,
                    username: `user${i}`,
                    password: `verschluesselt-${i}`,
                    information: `Info zum Portal ${i}`
                }
            };
        case "email":
            return {
                channel,
                entry: {
                    date: `2026-09-0${i}`,
                    emailTo: `bewerbung${i}@firma.example.com`,
                    emailFrom: `bewerber${i}@mail.example.com`,
                    subject: `Bewerbung ${i}`,
                    content: `E-Mail-Inhalt ${i}`,
                    attachments: [
                        `anschreiben-${i}.pdf`,
                        `lebenslauf-${i}.pdf`,
                        `zeugnis-${i}.pdf`
                    ]
                }
            };
        case "phone":
            return {
                channel,
                entry: {
                    date: `2026-09-0${i}`,
                    phoneTo: `+49 30 000${i}`,
                    phoneFrom: `+49 170 000${i}`,
                    content: `Telefonat Inhalt ${i}`
                }
            };
    }
}

// Baut einen vollständigen AppModel-Datensatz. Jede Liste/Unterliste bekommt 3 Einträge.
function buildTestRecord(recordIndex) {
    const app = new AppModel();

    app.status = JobConstants.STATUS.BEWORBEN;
    app.updatedAt = new Date().toISOString();

    // job
    app.job.companyId = recordIndex;
    app.job.contactId = recordIndex;
    app.job.title = `Testjob ${recordIndex}`;
    app.job.workLocation.data = {
        street: `Arbeitsweg ${recordIndex}`,
        houseNumber: `${recordIndex}`,
        zipCountry: "D",
        zip: `4962${recordIndex}`,
        city: `Musterstadt ${recordIndex}`,
        country: "Deutschland",
        postBox: ""
    };
    app.job.employmentType = "Vollzeit";
    app.job.workModel = ["Vor Ort", "Hybrid"];
    app.job.salary = 40000 + recordIndex * 1000;
    app.job.vacationPay = 1000 + recordIndex * 100;
    app.job.christmasPay = 1500 + recordIndex * 100;
    app.job.referenceNumber = `REF-${recordIndex}`;
    app.job.tasks = [1, 2, 3].map(n => `Aufgabe ${n} (Job ${recordIndex})`);
    app.job.tags = [1, 2, 3].map(n => `Tag${n}-${recordIndex}`);

    // company
    app.company.id = recordIndex;
    app.company.name = `Testfirma ${recordIndex} GmbH`;
    app.company.legalForm = "GmbH";
    app.company.relationship = "Hauptsitz";
    app.company.industry = "IT";
    app.company.size = "50-200";
    app.company.founded = "2001";
    app.company.website = `https://firma${recordIndex}.example.com`;
    app.company.verifiedAt = "2026-09-01";
    app.company.description = `Beschreibung Firma ${recordIndex}`;
    app.company.specialties = [1, 2, 3].map(n => `Spezialgebiet${n}-${recordIndex}`);
    app.company.images = [1, 2, 3].map(n => `bild${n}-${recordIndex}.png`);
    app.company.address.data = {
        street: `Musterweg ${recordIndex}`,
        houseNumber: `${recordIndex}`,
        zipCountry: "D",
        zip: `4961${recordIndex}`,
        city: `Quakenbrück`,
        country: "Deutschland",
        postBox: ""
    };

    // contacts (3)
    for (let i = 1; i <= 3; i++) {
        const contact = new ContactModel();
        contact.id = i;
        contact.role = i === 1 ? "HR" : "Fachbereich";
        contact.name = `Kontakt ${i} (${recordIndex})`;
        contact.img = `kontakt${i}-${recordIndex}.png`;
        contact.email = `kontakt${i}@firma${recordIndex}.example.com`;
        contact.phone = `+49 30 111${recordIndex}${i}`;
        app.contacts.push(contact);
    }

    // qualifications (required/preferred/personal je 3 tags + 3 content)
    for (const area of ["required", "preferred", "personal"]) {
        for (let i = 1; i <= 3; i++) {
            app.qualifications.add(area, `${area}-Inhalt ${i} (${recordIndex})`, `${area}-Tag${i}`);
        }
    }

    // benefits (3 tags + 3 content)
    for (let i = 1; i <= 3; i++) {
        app.benefits.add(`Benefit ${i} (${recordIndex})`, `BenefitTag${i}`);
    }

    // application
    app.application.appliedAt = "2026-09-01";
    app.application.channel = "portal";
    app.application.coverLetter = `Anschreiben Text ${recordIndex}`;
    app.application.resume = `Lebenslauf Text ${recordIndex}`;
    app.application.emailCoverLetter = `Mailanschreiben Text ${recordIndex}`;
    app.application.signature = `Unterschrift ${recordIndex}`;

    // statusHistory (3), Endstatus variiert je Datensatz für sichtbare Unterschiede in der Übersicht
    const finalStatusByRecord = [
        JobConstants.STATUS.ENTWURF,
        JobConstants.STATUS.BEWORBEN,
        JobConstants.STATUS.EINGANG,
        JobConstants.STATUS.RUECKRUF,
        JobConstants.STATUS.ABGELEHNT
    ];
    const finalStatus = finalStatusByRecord[(recordIndex - 1) % finalStatusByRecord.length];
    const statuses = [JobConstants.STATUS.BEWORBEN, JobConstants.STATUS.EINGANG, finalStatus];
    for (let i = 0; i < 3; i++) {
        const entry = new ApplicationStatusHistoryModel();
        entry.date = `2026-09-0${i + 1}`;
        entry.status = statuses[i];
        entry.reason = `Grund ${i + 1}`;
        app.application.statusHistory.push(entry);
    }
    app.application.status = finalStatus;

    // history (3), zyklisch durch die drei Kanaltypen
    for (let i = 1; i <= 3; i++) {
        const raw = buildHistoryEntry(CHANNELS[(i - 1) % CHANNELS.length], i);
        const entry = new ApplicationHistoryModel();
        entry.data = raw;
        app.application.history.push(entry);
    }

    // references (3)
    for (let i = 1; i <= 3; i++) {
        const ref = new ReferenceModel();
        ref.id = i;
        ref.name = `Quelle ${i} (${recordIndex})`;
        ref.url = `https://quelle${i}-${recordIndex}.example.com`;
        ref.capturedAt = "2026-09-01";
        ref.content = `Inhalt der Quelle ${i} (${recordIndex})`;
        app.references.push(ref);
    }

    // actionHistory / importedRawData (3 einfache Einträge)
    app.actionHistory = [1, 2, 3].map(n => `Aktion ${n} (${recordIndex})`);
    app.importedRawData = [1, 2, 3].map(n => `Rohdatenzeile ${n} (${recordIndex})`);

    return app;
}

async function main() {
    const results = [];
    const log = (msg) => { console.log(msg); results.push(msg); };

    // Der Object Store wird jetzt automatisch von AppDB selbst angelegt
    // (LocalDB.create() im Konstruktor), kein manueller Vorab-Schritt mehr nötig.

    // 1) 5 Datensätze über die Models bauen
    const records = [1, 2, 3, 4, 5].map(buildTestRecord);
    log(`[OK] 5 Datensätze über die Models erzeugt.`);

    // 2) Über AppDB (LocalDB) speichern
    const savedIds = [];
    for (const record of records) {
        const db = new AppDB();
        const id = await db.save(record);
        savedIds.push(id);
    }
    log(`[OK] Alle 5 Datensätze über AppDB.save() gespeichert. IDs: ${savedIds.join(", ")}`);

    // Referenzdaten (wie gespeichert) für den Vergleich sichern
    const expected = records.map((r, i) => ({ ...r.data, id: savedIds[i] }));

    // Testdatei in /testdata ablegen, BEVOR der Speicher geleert wird
    const outPath = new URL("./Jobsinput.json", import.meta.url);
    fs.writeFileSync(outPath, JSON.stringify({ app: expected }, null, 4), "utf8");
    log(`[OK] Testdatei geschrieben: testdata/Jobsinput.json`);

    // 3) Hauptspeicher leeren (LocalDB-Cache zurücksetzen, IndexedDB bleibt als "Platte" bestehen -
    //    wir simulieren "frisch geladen" durch Zurücksetzen von LocalDB.db/.storeName)
    LocalDB.db = null;
    LocalDB.storeName = null;
    log(`[OK] Hauptspeicher (LocalDB-Cache) geleert.`);

    // 4) Einen Datensatz laden und mit dem Ausgangsdatensatz vergleichen
    const db2 = new AppDB();
    const loaded = await db2.get(savedIds[2]);
    const loadedData = loaded.data;
    const originalData = expected[2];
    const same = JSON.stringify(loadedData) === JSON.stringify(originalData);
    log(same
        ? `[OK] Geladener Datensatz (id=${savedIds[2]}) stimmt exakt mit dem Ausgangsdatensatz überein.`
        : `[FEHLER] Differenz zwischen geladenem und ursprünglichem Datensatz (id=${savedIds[2]})!`);
    if (!same) {
        log("Erwartet: " + JSON.stringify(originalData));
        log("Erhalten: " + JSON.stringify(loadedData));
    }

    // 5) Wert ändern und speichern -> muss überschreiben, nicht neu anlegen
    const countBefore = (await LocalDB.get()).length;
    loaded.job.title = "Geänderter Jobtitel";
    const overwrittenId = await db2.save(loaded);
    const countAfterOverwrite = (await LocalDB.get()).length;
    const overwriteOk = overwrittenId === savedIds[2] && countAfterOverwrite === countBefore;
    log(overwriteOk
        ? `[OK] Änderung an bestehendem Datensatz überschreibt korrekt (Anzahl Datensätze unverändert: ${countAfterOverwrite}).`
        : `[FEHLER] Überschreiben fehlgeschlagen (Anzahl vorher: ${countBefore}, nachher: ${countAfterOverwrite}, id vorher/nachher: ${savedIds[2]}/${overwrittenId}).`);

    // Re-Check: geänderter Titel tatsächlich persistiert?
    const reloaded = await db2.get(savedIds[2]);
    const titleOk = reloaded.job.title === "Geänderter Jobtitel";
    log(titleOk
        ? `[OK] Geänderter Wert wurde korrekt persistiert.`
        : `[FEHLER] Geänderter Wert wurde NICHT persistiert.`);

    // 6) Datensatz ohne id speichern -> muss neu angelegt/angehängt werden
    const newRecord = buildTestRecord(6);
    newRecord.id = 0; // keine id
    const countBeforeAdd = (await LocalDB.get()).length;
    const newId = await db2.save(newRecord);
    const countAfterAdd = (await LocalDB.get()).length;
    const addOk = countAfterAdd === countBeforeAdd + 1 && !!newId;
    log(addOk
        ? `[OK] Datensatz ohne id wurde korrekt neu angelegt/angehängt (neue id: ${newId}, Anzahl: ${countBeforeAdd} -> ${countAfterAdd}).`
        : `[FEHLER] Datensatz ohne id wurde nicht korrekt angelegt (Anzahl: ${countBeforeAdd} -> ${countAfterAdd}, id: ${newId}).`);

    const allOk = results.every(r => !r.startsWith("[FEHLER]"));
    console.log("\n" + (allOk ? "=== ALLE TESTS OK ===" : "=== ES GIBT FEHLER ==="));
    process.exit(allOk ? 0 : 1);
}

main();
