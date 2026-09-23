import { DocumentsSectionController } from "../../controllers/detail/DocumentsSectionController.js";

export class DocumentsSectionEvent {

    constructor(repository) {
        this.controller = new DocumentsSectionController(repository);
    }

    bind(root, application, onUpdate) {
        this.bindUploadTrigger(root);
        this.bindUploadChange(root, application, onUpdate);
        this.bindRemove(root, application, onUpdate);
    }

    bindUploadTrigger(root) {
        root.querySelectorAll("[data-upload-trigger]").forEach(button => {
            button.onclick = () => {
                const input = root.querySelector("#" + button.dataset.uploadTrigger);
                input?.click();
            };
        });
    }

    bindUploadChange(root, application, onUpdate) {
        root.querySelectorAll("[data-upload-field]").forEach(input => {
            if (input.tagName !== "INPUT") return;

            input.onchange = () => {
                const file = input.files?.[0];
                if (!file) return;

                this.controller.uploadFile(
                    application,
                    input.dataset.uploadField,
                    file,
                    onUpdate
                );
            };
        });
    }

    bindRemove(root, application, onUpdate) {
        root.querySelectorAll("[data-remove-upload]").forEach(button => {
            button.onclick = () =>
                this.controller.removeFile(
                    application,
                    button.dataset.uploadField,
                    button.dataset.removeUpload,
                    onUpdate
                );
        });
    }
}