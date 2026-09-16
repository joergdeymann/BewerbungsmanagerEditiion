import {ContactModel} from './ContactModel.js';
import {BenefitModel} from './BenefitModel.js';

export class JobModel {
    constructor() {
        this.id = 0;
        this.createDate = new Date().toISOString();
        this.company = new CompanyModel();
        
        // Jetzt als leere Listen (Arrays) initialisiert
        this.contacts = []; 
        this.benefits = new BenefitsModel(); 
        
        this.actionHistory = [];
        this.importedRawData = [];
    }

    get data() {
        return {
            id: this.id,
            createDate: this.createDate,
            company: this.company,
            contacts: this.contacts.map(contact => contact.data), 
            benefits: this.benefits, // Angenommen, das ist ein einfaches Array oder wird analog behandelt
            actionHistory: this.actionHistory,
            importedRawData: this.importedRawData
        };
    }

    set data(raw) {
        if (!raw) return;

        this.id = raw.id ?? this.id;
        this.createDate = raw.createDate ?? this.createDate;
        this.company = raw.company ?? this.company;
        this.actionHistory = raw.actionHistory ?? this.actionHistory;
        this.importedRawData = raw.importedRawData ?? this.importedRawData;

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
