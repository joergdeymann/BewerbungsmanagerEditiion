import { InputPromptTemplate } from "../../templates/windows/InputPromptTemplate.js";

export class InputPrompt {

    constructor() {
        this.template = new InputPromptTemplate();
    }

    // Erwartet den Standardtext (Vorausfüllung beim Bearbeiten) sowie
    // optional den Ansprechpartner {name, email, phone} für die Kontaktzeile.
    show(defaultValue = "", contact = null) {
        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            overlay.className = "modal-overlay";
            overlay.innerHTML = this.template.create(defaultValue, contact);

            document.body.appendChild(overlay);

            const inputContainer = overlay.querySelector("#input-container");
            const textarea = overlay.querySelector("#input-text");
            const submitBtn = overlay.querySelector("#submitInput");
            const cancelBtn = overlay.querySelector("#cancelInput");

            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);

            submitBtn.onclick = () => {
                const text = textarea.value.trim();
                overlay.remove();
                resolve(text);
            };

            cancelBtn.onclick = () => {
                overlay.remove();
                resolve(null);
            };

            inputContainer.onclick = event => {
                if (event.target === inputContainer) {
                    event.stopPropagation();
                    event.preventDefault();
                    overlay.remove();
                    resolve(null);
                }
            };

            document.addEventListener("keydown", event => {
                if (event.key === "Escape" && document.body.contains(overlay)) {
                    overlay.remove();
                    resolve(null);
                }
            });
        });
    }
}