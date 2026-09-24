import { ContactPrompt } from "../../views/windows/ContactPrompt.js";
import { VerifyPrompt } from "../../views/windows/VerifyPrompt.js";
import { ContactModel } from "../../models/ContactModel.js";

export class ContactSectionController {

    constructor(repository) {
        this.repository = repository;
        this.prompt = new ContactPrompt();
    }

    async persist(application) {
        if (application.id) {
            await this.repository.save(application);
        }
    }

    async addContact(application, onUpdate) {
        const values = await this.prompt.show({}, "Ansprechpartner hinzufügen");
        if (!values) return;

        const contact = new ContactModel();
        contact.name = values.name;
        contact.role = values.role;
        contact.email = values.email;
        contact.phone = values.phone;

        application.contacts.push(contact);
        await this.persist(application);
        onUpdate();
    }

    async selectContact(application, id, onUpdate) {
        const index = application.contacts.findIndex(contact => contact.id === id);
        if (index <= 0) return;

        const [selected] = application.contacts.splice(index, 1);
        application.contacts.unshift(selected);

        await this.persist(application);
        onUpdate();
    }

    async editContact(application, id, onUpdate) {
        const contact = application.contacts.find(item => item.id === id);
        if (!contact) return;

        const values = await this.prompt.show(contact, "Ansprechpartner ändern");
        if (!values) return;

        contact.name = values.name;
        contact.role = values.role;
        contact.email = values.email;
        contact.phone = values.phone;

        await this.persist(application);
        onUpdate();
    }

    async removeContact(application, id, onUpdate) {
        const contact = application.contacts.find(item => item.id === id);
        if (!contact) return;

        const verifyPrompt = new VerifyPrompt();
        const confirmed = await verifyPrompt.show(
            contact.name || "Ansprechpartner",
            "Ansprechpartner wirklich entfernen?"
        );
        if (!confirmed) return;

        application.contacts = application.contacts.filter(item => item.id !== id);

        await this.persist(application);
        onUpdate();
    }
}