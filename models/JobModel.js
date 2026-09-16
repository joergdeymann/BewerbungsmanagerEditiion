import { CompanyModel } from './CompanyModel.js';
import { ContactModel } from './ContactModel.js';
import { BenefitsModel } from './BenefitsModel.js';
import { ApplicationModel } from './ApplicationModel.js';
import { ReferenceModel } from './ReferenceModel.js';

export class JobModel {
    constructor() {
        this.id = 0;
        this.createDate = new Date().toISOString();
        this.status = "";
        this.updatedAt = "";
        this.company = new CompanyModel();
        
        // Jetzt als leere Listen (Arrays) initialisiert
        this.contacts = []; 
        this.benefits = new BenefitsModel(); 
        this.application = new ApplicationModel();
        this.references = [];
        
        this.actionHistory = [];
        this.importedRawData = [];
    }

    get data() {
        return {
            id: this.id,
            createDate: this.createDate,
            status: this.status,
            updatedAt: this.updatedAt,
            company: this.company,
            contacts: this.contacts.map(contact => contact.data), 
            benefits: this.benefits, // Angenommen, das ist ein einfaches Array oder wird analog behandelt
            application: this.application.data,
            references: this.references.map(reference => reference.data),
            actionHistory: this.actionHistory,
            importedRawData: this.importedRawData
        };
    }

    set data(raw) {
        if (!raw) return;

        this.id = raw.id ?? this.id;
        this.createDate = raw.createDate ?? this.createDate;
        this.status = raw.status ?? this.status;
        this.updatedAt = raw.updatedAt ?? this.updatedAt;
        this.company = raw.company ?? this.company;
        this.actionHistory = raw.actionHistory ?? this.actionHistory;
        this.importedRawData = raw.importedRawData ?? this.importedRawData;

        if (raw.application) {
            this.application.data = raw.application;
        }

        // DIE ARRAYS IM SETTER ANPASSEN:
        if (raw.contacts && Array.isArray(raw.contacts)) {
            // Wir leeren das aktuelle Array, um Duplikate beim erneuten Laden zu verhindern
            this.contacts = []; 
            
            // Jeden rohen Kontakteintrag in ein echtes Modell umwandeln
            for (const rawContact of raw.contacts) {
                const contactInstance = new ContactModel();
                contactInstance.data = rawContact; // Nutzt den Setter von ContactModel
                this.contacts.push(contactInstance); // Ab in die Liste!
            };
        }

        if (raw.references && Array.isArray(raw.references)) {
            this.references = [];

            for (const rawReference of raw.references) {
                const referenceInstance = new ReferenceModel();
                referenceInstance.data = rawReference;
                this.references.push(referenceInstance);
            }
        }
    }

	static fromData(raw) {
        const model = new JobModel();
        model.id = raw.id;
        model.company = raw.company;
        model.createDate = raw.createDate;
        // ... hier alle Felder zuweisen
        return model;
    }
	
	// HILFSMETHODE: Erstellt und pusht einen neuen Kontakt direkt als Modell
	addContact(contactOrName, email = "", phone = "") {
        if (contactOrName instanceof ContactModel) {
            this.contacts.push(contactOrName);
            return contactOrName;
        }

        const newContact = new ContactModel();
        newContact.name = contactOrName;
        newContact.email = email;
        newContact.phone = phone;
        
        this.contacts.push(newContact);
        return newContact;
    }

    addContact(contact) {	
		this.contacts.push(contact)
	
	}	
	
	
	
}
