export class UrlPromptTemplate {

    create() {
        return `
        <div id="url-container" class="input-container">
            <div class="input-prompt auto-height">
                <div class="field">
                    <label for="url-input">Webadresse der Stellenanzeige hier einfügen:</label>
                    <div class="url-input-row">
                        <button type="button" id="pasteUrl" class="secondary" title="Aus Zwischenablage einfügen">📋 Einfügen</button>
                        <input id="url-input" type="url" placeholder="https://...">
                    </div>
                </div>
                <p class="prompt-hint" id="url-hint"></p>
                <div class="prompt-buttons">
                    <button id="cancelUrl" class="danger">Abbrechen</button>
                    <button id="submitUrl" class="primary">Importieren</button>
                </div>
            </div>
        </div>
        `;
    }
}