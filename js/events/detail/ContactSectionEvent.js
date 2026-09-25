import { ContactSectionController } from "../../controllers/detail/ContactSectionController.js";

export class ContactSectionEvent {

    constructor(repository) {
        this.controller = new ContactSectionController(repository);
    }

    bind(root, application, onUpdate) {
        this.bindAdd(root, application, onUpdate);
        this.bindSelect(root, application, onUpdate);
        this.bindEdit(root, application, onUpdate);
        this.bindRemove(root, application, onUpdate);
        this.bindCall(root, application, onUpdate);
    }

    bindCall(root, application, onUpdate) {
        const button = root.querySelector("[data-call-contact]");
        if (!button) return;

        button.onclick = () =>
            this.controller.callContact(application, onUpdate);
    }

    bindAdd(root, application, onUpdate) {
        const button = root.querySelector("[data-add-contact]");
        if (!button) return;

        button.onclick = () =>
            this.controller.addContact(application, onUpdate);
    }

    bindSelect(root, application, onUpdate) {
        root.querySelectorAll("[data-select-contact]").forEach(row => {
            row.onclick = (event) => {
                if (event.target.closest("button")) return;

                this.controller.selectContact(
                    application,
                    row.dataset.selectContact,
                    onUpdate
                );
            };
        });
    }

    bindEdit(root, application, onUpdate) {
        root.querySelectorAll("[data-edit-contact]").forEach(button => {
            button.onclick = () =>
                this.controller.editContact(
                    application,
                    button.dataset.editContact,
                    onUpdate
                );
        });
    }

    bindRemove(root, application, onUpdate) {
        root.querySelectorAll("[data-remove-contact]").forEach(button => {
            button.onclick = () =>
                this.controller.removeContact(
                    application,
                    button.dataset.removeContact,
                    onUpdate
                );
        });
    }
}