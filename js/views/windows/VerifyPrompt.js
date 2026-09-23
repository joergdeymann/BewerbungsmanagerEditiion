export class VerifyPrompt {
    constructor(repository, id) {
        this.repository = repository;
        this.id = id;
    }

    // Erwartet den Standardtext (Vorausfüllung beim Bearbeiten)
    show(
        textPreview = "",
        title = "Eintrag wirklich löschen?",
        buttons = {
            cancel: { class: "primary", value: "Nein" },
            confirm: { class: "danger", value: "Ja" }
        }
    ) {        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            overlay.className = "modal-overlay"; 
            
            overlay.innerHTML = `
            <div id="input-container" class="input-container">
                <div class="input-prompt auto-height">
                    <label for="input-text">${title}</label>
                    <p>${textPreview}</p>
                    <div class="prompt-buttons prompt-center">
                        <button id="confirmDelete" class="${buttons.confirm.class}">${buttons.confirm.value}</button>
                        <button id="cancelDelete" class="${buttons.cancel.class}">${buttons.cancel.value}</button>
                    </div>
                </div>
            </div>
            `;

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
