export class InputPromptTemplate {

    create(defaultValue = "") {
        return `
        <div id="input-container" class="input-container">
            <div class="input-prompt">
                <div class="field">
                    <label for="input-text">Telefonat / Rückruf dokumentieren:</label>
                    <textarea id="input-text" rows="4" placeholder="Informationen zum Telefonat eingeben ...">${defaultValue}</textarea>
                </div>
                <div class="prompt-buttons">
                    <button id="cancelInput" class="danger">Abbrechen</button>
                    <button id="submitInput" class="primary">Speichern</button>
                </div>
            </div>
        </div>
        `;
    }
}