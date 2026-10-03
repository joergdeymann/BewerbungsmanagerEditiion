import { ContactModel } from "../../models/ContactModel.js";

/**
 * Zentrale Schreibstelle der Textanalyse: Das Ergebnis des Parsers wird
 * vollstaendig in die Models uebernommen. Die Editor-Reiter lesen danach nur noch
 * aus den Models und schreiben ausschliesslich beim expliziten Speichern.
 */
export class AnalysisController {

    /**
     * Uebernimmt ein Analyseergebnis in das Application-Model.
     * @param {object} application Ziel-Model (AppModel).
     * @param {object} result Ergebnis der Textanalyse.
     */
    apply(application, result) {
        if (!application || !result) return;

        this.applyCompany(application, result.company);
        this.applyJob(application, result.job);
        this.applyQualifications(application, result.qualifications);
        this.applyBenefits(application, result.benefits);
        this.applyContacts(application, result.contacts);
    }

    /**
     * Uebernimmt die analysierten Firmendaten in das Company-Model.
     * @param {object} application Ziel-Model.
     * @param {object} company Analysierte Firmendaten.
     */
    applyCompany(application, company) {
        if (!company) return;

        const target = application.company;

        target.name = company.name || target.name;
        target.email = company.email || target.email;
        target.phone = company.phone || target.phone;
        target.website = company.website || target.website;
        target.legalForm = company.legalForm || target.legalForm;
        target.industry = company.industry || target.industry;
        target.size = company.size || target.size;
        target.founded = company.founded || target.founded;
        target.verifiedAt = company.verifiedAt || target.verifiedAt;
        target.description = company.description || target.description;

        if (company.specialties?.length) target.specialties = company.specialties;

        this.applyAddress(target, company);
    }

    /**
     * Uebernimmt Strasse, Ort und Postfach der analysierten Adresse.
     * @param {object} target Company-Model.
     * @param {object} company Analysierte Firmendaten.
     */
    applyAddress(target, company) {
        const current = target.address.data;
        const next = {
            street: company.street?.name,
            houseNumber: company.street?.houseNumber,
            zip: company.location?.zip,
            city: company.location?.city,
            country: company.location?.country,
            postBox: company.postbox
        };

        if (!Object.values(next).some(Boolean)) return;

        target.address.data = {
            street: next.street ?? current.street,
            houseNumber: next.houseNumber ?? current.houseNumber,
            zipCountry: current.zipCountry,
            zip: next.zip ?? current.zip,
            city: next.city ?? current.city,
            country: next.country ?? current.country,
            postBox: next.postBox ?? current.postBox
        };
    }

    /**
     * Uebernimmt Gehalt und Aufgaben der analysierten Stelle.
     * @param {object} application Ziel-Model.
     * @param {object} job Analysierte Stellendaten.
     */
    applyJob(application, job) {
        if (!job) return;

        if (job.wage) application.job.wage.data = job.wage;
        if (job.tasks?.length) application.job.tasks = job.tasks;
        if (job.title) application.job.title = job.title;
    }

    /**
     * Uebernimmt die analysierten Qualifikationen.
     * @param {object} application Ziel-Model.
     * @param {object} qualifications Analysierte Qualifikationen.
     */
    applyQualifications(application, qualifications) {
        if (!qualifications) return;
        application.qualifications.data = qualifications;
    }

    /**
     * Uebernimmt die analysierten Benefits.
     * @param {object} application Ziel-Model.
     * @param {object} benefits Analysierte Benefits.
     */
    applyBenefits(application, benefits) {
        if (!benefits) return;
        application.benefits.data = benefits;
    }

    /**
     * Uebernimmt die Ansprechpartner. Ohne Treffer wird ein Ersatzkontakt aus
     * den Firmendaten angelegt (Sprint aus AI/workflow/WORKFLOW.md). Der erste
     * Kontakt wird als Primaerkontakt in job.contactId hinterlegt, damit
     * Anzeige und Aendern-Popup denselben Kontakt verwenden.
     * @param {object} application Ziel-Model.
     * @param {Array} contacts Analysierte Ansprechpartner.
     */
    applyContacts(application, contacts) {
        if (contacts?.length) {
            contacts.forEach(raw => this.addContact(application, raw));
            this.setPrimaryContact(application);
            return;
        }

        this.ensureCompanyContact(application);
    }

    /**
     * Stellt sicher, dass fuer die Firma ein Ansprechpartner im Model existiert.
     * Wird nach der Analyse und beim Speichern aufgerufen.
     * @param {object} application Ziel-Model.
     */
    ensureCompanyContact(application) {
        if (application.contacts.length) {
            this.refreshCompanyContact(application);
            this.setPrimaryContact(application);
            return;
        }

        const contact = this.createCompanyContact(application);
        if (!contact) return;

        application.contacts.push(contact);
        this.setPrimaryContact(application);
    }

    /**
     * Aktualisiert einen Ersatzkontakt (Name = Firmenname, keine Anrede) mit den
     * aktuellen Firmendaten. Damit weicht die Anzeige nicht von den Firmendaten ab.
     * @param {object} application Ziel-Model.
     */
    refreshCompanyContact(application) {
        const company = application.company;

        application.contacts
            .filter(contact => this.isCompanyContact(contact, company))
            .forEach(contact => {
                contact.name.lastname = company.name;
                contact.email = company.email;
                contact.phone = company.phone;
                contact.role = contact.role || application.job?.title || "";
            });
    }

    /**
     * Prüft, ob ein Kontakt aus den Firmendaten erzeugt wurde.
     * @param {object} contact Kontakt aus application.contacts.
     * @param {object} company Company-Model.
     * @returns {boolean} true, wenn der Kontakt ein Ersatzkontakt ist.
     */
    isCompanyContact(contact, company) {
        return !contact.name?.salutation
            && contact.name?.firstname === ""
            && contact.name?.lastname === company.name;
    }

    /**
     * Legt einen Ersatzkontakt aus den Firmendaten an. Der Kontakt erhaelt seine
     * eigene ID ueber ContactModel und liegt danach in application.contacts.
     * @param {object} application Ziel-Model.
     * @returns {object|null} Neuer Kontakt oder null, wenn keine Firmdaten vorliegen.
     */
    createCompanyContact(application) {
        const company = application.company;
        if (!company.name && !company.email && !company.phone) return null;

        const contact = new ContactModel();
        contact.name.data = { lastname: company.name };
        contact.role = application.job?.title ?? "";
        contact.email = company.email;
        contact.phone = company.phone;

        return contact;
    }

    /**
     * Hinterlegt den ersten Kontakt als Primaerkontakt (job.contactId).
     * @param {object} application Ziel-Model.
     */
    setPrimaryContact(application) {
        application.setPrimaryContact(application.contacts[0] ?? null);
    }

    /**
     * Liefert den Kontakt, den Anzeige und Aendern-Popup verwenden.
     * @param {object} application Ziel-Model.
     * @returns {object|null} Primaerkontakt oder der erste Kontakt der Liste.
     */
    primaryContact(application) {
        return application.primaryContact;
    }

    /**
     * Haelt den Primaerkontakt aktuell, wenn die Liste veraendert wurde.
     * @param {object} application Ziel-Model.
     */
    releasePrimaryContact(application) {
        application.releasePrimaryContact();
    }

    /**
     * Fuegt einen Ansprechpartner hinzu, sofern er noch nicht existiert.
     * @param {object} application Ziel-Model.
     * @param {{name?: object}} raw Analyseergebnis eines Kontakts.
     */
    addContact(application, raw) {
        if (this.hasContact(application, raw)) return;

        const contact = new ContactModel();
        contact.name.data = raw.name;
        contact.role = raw.role ?? "";
        contact.email = raw.email ?? "";
        contact.phone = raw.phone ?? "";

        application.contacts.push(contact);
    }

    /**
     * Prueft, ob ein gleichnamiger Ansprechpartner bereits vorliegt.
     * @param {object} application Ziel-Model.
     * @param {{name?: object}} raw Analyseergebnis eines Kontakts.
     * @returns {boolean} true, wenn der Kontakt bereits existiert.
     */
    hasContact(application, raw) {
        const full = `${raw.name?.firstname} ${raw.name?.lastname}`.trim().toLowerCase();
        if (!full) return false;

        return application.contacts.some(contact =>
            `${contact.name?.firstname} ${contact.name?.lastname}`.trim().toLowerCase() === full
        );
    }
}