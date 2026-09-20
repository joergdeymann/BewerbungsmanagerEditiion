export class ContactPrompt {

    // Erwartet optional Startwerte {name, role, email, phone}.
    // Löst mit dem ausgefüllten Objekt auf, oder mit null bei Abbruch.
    show(contact = {}, title = "Ansprechpartner") {
        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            overlay.className = "modal-overlay";

            overlay.innerHTML = `
            <div id="contact-container" class="input-container">
                <div class="input-prompt auto-height">
                    <label>${title}</label>

                    <label for="contact-name">Name</label>
                    <input id="contact-name" value="${this.escape(contact.name)}">

                    <label for="contact-role">Position</label>
                    <input id="contact-role" value="${this.escape(contact.role)}">

                    <label for="contact-email">E-Mail</label>
                    <input id="contact-email" type="email" value="${this.escape(contact.email)}">

                    <label for="contact-phone">Telefon</label>
                    <input id="contact-phone" value="${this.escape(contact.phone)}">

                    <div class="prompt-buttons">
                        <button id="cancelContact" class="danger">Abbrechen</button>
                        <button id="submitContact" class="primary">Speichern</button>
                    </div>
                </div>
            </div>
            `;

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

    escape(value) {
        return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}