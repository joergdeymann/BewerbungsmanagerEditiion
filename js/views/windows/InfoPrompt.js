import { InfoPromptTemplate } from "../../templates/windows/InfoPromptTemplate.js";

export class InfoPrompt {

    constructor() {
        this.template = new InfoPromptTemplate();
    }

    // Zeigt einen reinen Hinweis mit einer Bestätigung ("OK").
    show(message, title = "Hinweis") {
        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            overlay.className = "modal-overlay";
            overlay.innerHTML = this.template.create(message, title);

            document.body.appendChild(overlay);
            const container = overlay.querySelector("#input-container");
            const confirmBtn = overlay.querySelector("#confirmInfo");

            const close = () => {
                overlay.remove();
                resolve();
            };

            confirmBtn.onclick = close;

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