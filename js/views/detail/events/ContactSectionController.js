import { ContactPrompt } from "../../windows/ContactPrompt.js";
import { VerifyPrompt } from "../../windows/VerifyPrompt.js";
import { ContactModel } from "../../../models/ContactModel.js";

export class ContactSectionController {

    constructor(repository) {
        this.repository = repository;
        this.prompt = new ContactPrompt();
    }

    bind(root, application, onUpdate) {
        this.bindAdd(root, application, onUpdate);
        this.bindSelect(root, application, onUpdate);
        this.bindEdit(root, application, onUpdate);
        this.bindRemove(root, application, onUpdate);
    }

    bindAdd(root, application, onUpdate) {
        const button = root.querySelector("[data-add-contact]");
        if (!button) return;

        button.onclick = async () => {
            const values = await this.prompt.show({}, "Ansprechpartner hinzufügen");
            if (!values) return;

            const contact = new ContactModel();
            contact.name = values.name;
            contact.role = values.role;
            contact.email = values.email;
            contact.phone = values.phone;

            application.contacts.push(contact);
            await this.repository.save(application);
            onUpdate();
        };
    }

    bindSelect(root, application, onUpdate) {
        root.querySelectorAll("[data-select-contact]").forEach(button => {
            button.onclick = async () => {
                const id = button.dataset.selectContact;
                const index = application.contacts.findIndex(contact => contact.id === id);
                if (index <= 0) return;

                const [selected] = application.contacts.splice(index, 1);
                application.contacts.unshift(selected);

                await this.repository.save(application);
                onUpdate();
            };
        });
    }

    bindEdit(root, application, onUpdate) {
        root.querySelectorAll("[data-edit-contact]").forEach(button => {
            button.onclick = async () => {
                const id = button.dataset.editContact;
                const contact = application.contacts.find(item => item.id === id);
                if (!contact) return;

                const values = await this.prompt.show(contact, "Ansprechpartner ändern");
                if (!values) return;

                contact.name = values.name;
                contact.role = values.role;
                contact.email = values.email;
                contact.phone = values.phone;

                await this.repository.save(application);
                onUpdate();
            };
        });
    }

    bindRemove(root, application, onUpdate) {
        root.querySelectorAll("[data-remove-contact]").forEach(button => {
            button.onclick = async () => {
                const id = button.dataset.removeContact;
                const contact = application.contacts.find(item => item.id === id);
                if (!contact) return;

                const verifyPrompt = new VerifyPrompt();
                const confirmed = await verifyPrompt.show(
                    contact.name || "Ansprechpartner",
                    "Ansprechpartner wirklich entfernen?"
                );
                if (!confirmed) return;

                application.contacts = application.contacts.filter(item => item.id !== id);

                await this.repository.save(application);
                onUpdate();
            };
        });
    }
}