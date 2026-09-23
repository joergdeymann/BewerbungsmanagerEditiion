import { VerifyPromptTemplate } from "../../templates/windows/VerifyPromptTemplate.js";

export class VerifyPrompt {

    constructor() {
        this.template = new VerifyPromptTemplate();
    }

    // Erwartet den Standardtext (Vorausfüllung beim Bearbeiten)
    show(
        textPreview = "",
        title = "Eintrag wirklich löschen?",
        buttons = {
            cancel: { class: "primary", value: "Nein" },
            confirm: { class: "danger", value: "Ja" }
        }
    ) {
        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            overlay.className = "modal-overlay";
            overlay.innerHTML = this.template.create(textPreview, title, buttons);

            document.body.appendChild(overlay);
            const inputContainer = overlay.querySelector("#input-container");
            const confirmBtn = overlay.querySelector("#confirmDelete");
            const cancelBtn = overlay.querySelector("#cancelDelete");

            confirmBtn.onclick = () => {
                overlay.remove();
                resolve(true);
            };

            cancelBtn.onclick = () => {
                overlay.remove();
                resolve(false);
            };

            inputContainer.onclick = event => {
                if (event.target === inputContainer) {
                    event.stopPropagation();
                    event.preventDefault();
                    overlay.remove();
                    resolve(false);
                }
            };

            document.addEventListener("keydown", event => {
                if (event.key === "Escape" && document.body.contains(overlay)) {
                    overlay.remove();
                    resolve(false);
                }
            });
        });
    }
}