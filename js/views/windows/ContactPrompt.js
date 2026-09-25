import { ContactPromptTemplate } from "../../templates/windows/ContactPromptTemplate.js";

export class ContactPrompt {

    constructor() {
        this.template = new ContactPromptTemplate();
    }

    // Erwartet optional einen Startkontakt (ContactModel-artig, mit
    // contact.name als {salutation, title, firstname, lastname}).
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

            overlay.querySelector("#contact-firstname").focus();

            const submit = () => {
                overlay.remove();
                resolve({
                    name: {
                        salutation: overlay.querySelector("#contact-salutation").value,
                        title: overlay.querySelector("#contact-title").value.trim(),
                        firstname: overlay.querySelector("#contact-firstname").value.trim(),
                        lastname: overlay.querySelector("#contact-lastname").value.trim()
                    },
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
