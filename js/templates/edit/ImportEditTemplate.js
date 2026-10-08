import { BookmarkletBuilder } from "../../io/BookmarkletBuilder.js";

export class ImportEditTemplate {

    render() {
        return `
            <section id="section-import" class="tab-content" style="display:none;">
                <div class="section-header">
                    <div><span class="section-icon">📥</span><h2>Import / Originaltext</h2></div>
                    <span>
                        <button type="button" id="clearOriginalText" class="danger">Text löschen</button>
                        <button type="button" id="fetchUrl" class="success">Webadresse der Stellenanzeige</button>
                    </span>
                </div>

                <p class="muted bookmarklet-hint">
                    Tipp: Ziehe diesen Link in deine Lesezeichen-Leiste – auf der Stellenanzeige
                    angeklickt, schickt er die geöffnete Seite direkt hierher:
                    <a href="${this.bookmarkletHref()}" class="bookmarklet-link" onclick="return false;">📌 Stelle importieren</a>
                </p>
                <textarea id="originalText" rows="10" placeholder="Füge hier den Ausschreibungstext oder Notizen ein... (wird beim Verlassen des Feldes automatisch übernommen)"></textarea>

                <div class="import-history" id="importHistory">
                    <h3>Übernommene Texte</h3>
                    <p class="muted" id="importHistoryEmpty">Noch keine Texte übernommen.</p>
                    <div id="importHistoryList" class="import-history-list"></div>
                </div>
            </section>
        `;
    }

    bookmarkletHref() {
        return new BookmarkletBuilder().href();
    }
}