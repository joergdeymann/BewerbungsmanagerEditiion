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
        this.bindDraft(root);
    }

    bindAdd(root, application, onUpdate) {
        const addButton = root.querySelector("#addCommunication");
        if (!addButton) return;

        addButton.onclick = () => {
            const textarea = root.querySelector("#communicationText");
            const text = textarea.value.trim();
            if (!text) return;

            this.controller.addEntry(application, text, onUpdate);
            this.controller.clearDraft(application);
        };
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

    bindDraft(root, application) {
        const textarea = root.querySelector("#communicationText");
        if (!textarea) return;

        const draft = this.controller.loadDraft(application);
        if (draft) {
            textarea.value = draft.text;
            textarea.setSelectionRange(draft.selectionStart, draft.selectionEnd);
            if (draft.text) {
                textarea.focus();
            }
        }

        const persistDraft = () => {
            if (!textarea.value) {
                this.controller.clearDraft(application);
                return;
            }

            this.controller.saveDraft(application, {
                text: textarea.value,
                selectionStart: textarea.selectionStart,
                selectionEnd: textarea.selectionEnd
            });
        };

        textarea.addEventListener("input", persistDraft);
        textarea.addEventListener("keyup", persistDraft);
        textarea.addEventListener("click", persistDraft);
    }




}