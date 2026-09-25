import { CallPromptTemplate } from "../../templates/windows/CallPromptTemplate.js";

export class CallPrompt {

    constructor() {
        this.template = new CallPromptTemplate();
    }

    /**
     * Zeigt das Anrufen-Fenster mit Ansprechpartner, Telefon und
     * E-Mail an. Reine Anzeige, es gibt keinen Rückgabewert.
     * @param {{name?: string, phone?: string, email?: string}} contact
     * @returns {Promise<void>}
     */
    show(contact = {}) {
        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            overlay.className = "modal-overlay";
            overlay.innerHTML = this.template.create(contact);

            document.body.appendChild(overlay);

            const container = overlay.querySelector("#call-container");
            const closeBtn = overlay.querySelector("#closeCall");

            const close = () => {
                overlay.remove();
                resolve();
            };

            closeBtn.onclick = close;

            container.onclick = event => {
                if (event.target === container) close();
            };

            document.addEventListener("keydown", function onEscape(event) {
                if (event.key === "Escape" && document.body.contains(overlay)) {
                    document.removeEventListener("keydown", onEscape);
                    close();
                }
            });
        });
    }
}
