import { ContactPromptTemplate } from "../../templates/windows/ContactPromptTemplate.js";

export class ContactPrompt {

    constructor() {
        this.template = new ContactPromptTemplate();
    }

    // Erwartet optional Startwerte {name, role, email, phone}.
    // Löst mit dem ausgefüllten Objekt auf, oder mit null bei Abbruch.
    show(contact = {}, title = "Ansprechpartner") {
        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            overlay.className = "modal-overlay";
            overlay.innerHTML = this.template.create(contact, title);

            document.body.appendChild(overlay);

            const container = overlay.querySelector("#contact-container");
            const submitBtn = overlay.querySelector("#submitContact");
            const cancelBtn = overlay.querySelector("#cancelContact");

            overlay.querySelector("#contact-name").focus();

            const submit = () => {
                overlay.remove();
                resolve({
                    name: overlay.querySelector("#contact-name").value.trim(),
                    role: overlay.querySelector("#contact-role").value.trim(),
                    email: overlay.querySelector("#contact-email").value.trim(),
                    phone: overlay.querySelector("#contact-phone").value.trim()
                });
            };

            submitBtn.onclick = submit;

            cancelBtn.onclick = () => {
                overlay.remove();
                resolve(null);
            };

            container.onclick = event => {
                if (event.target === container) {
                    overlay.remove();
                    resolve(null);
                }
            };

            document.addEventListener("keydown", function onEscape(event) {
                if (event.key === "Escape" && document.body.contains(overlay)) {
                    document.removeEventListener("keydown", onEscape);
                    overlay.remove();
                    resolve(null);
                }
            });
        });
    }
}