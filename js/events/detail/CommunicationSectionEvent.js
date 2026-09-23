import { CommunicationSectionController } from "../../controllers/detail/CommunicationSectionController.js";

export class CommunicationSectionEvent {

    constructor(repository) {
        this.controller = new CommunicationSectionController(repository);
    }

    bind(root, application, onUpdate) {
        this.bindAdd(root, application, onUpdate);
        this.bindEdit(root, application, onUpdate);
        this.bindDelete(root, application, onUpdate);
        this.bindDraft(root, application);
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

    bindEdit(root, application, onUpdate) {
        root.querySelectorAll("[data-edit-communication]").forEach(button => {
            button.onclick = () =>
                this.controller.editEntry(
                    application,
                    button.dataset.editCommunication,
                    onUpdate
                );
        });
    }

    bindDelete(root, application, onUpdate) {
        root.querySelectorAll("[data-delete-communication]").forEach(button => {
            button.onclick = () =>
                this.controller.deleteEntry(
                    application,
                    button.dataset.deleteCommunication,
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