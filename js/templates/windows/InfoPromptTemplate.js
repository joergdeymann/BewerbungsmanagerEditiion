export class InfoPromptTemplate {

    create(message, title) {
        return `
        <div id="input-container" class="input-container">
            <div class="input-prompt auto-height">
                <label>${title}</label>
                <p>${message}</p>
                <div class="prompt-buttons prompt-center">
                    <button id="confirmInfo" class="primary">OK</button>
                </div>
            </div>
        </div>
        `;
    }
}