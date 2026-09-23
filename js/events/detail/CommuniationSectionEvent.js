import { CommunicationSectionController } from "../../controllers/detail/CommunicationSectionController.js";

export class CommunicationSectionEvent {

    constructor(repository) {
        this.controller = new CommunicationSectionController(repository);
    }

    bind(root, application, onUpdate) {
        this.bindAdd(root, application, onUpdate);
        this.bindEdit(root, application, onUpdate);
        this.bindDelete(root, application, onUpdate);
    }

    bindAdd(root, application, onUpdate) {
        const addButton = root.querySelector("#addCommunication");
        if (!addButton) return;

        addButton.onclick = () => {
            const textarea = root.querySelector("#communicationText");
            const text = textarea.value.trim();
            if (!text) return;

            this.controller.addEntry(application, text, onUpdate);
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
}