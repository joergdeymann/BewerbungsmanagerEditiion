export class VerifyPromptTemplate {

    create(textPreview, title, buttons) {
        return `
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
    }
}