import { ImportConstants } from "../constants/ImportConstants.js";

/**
 * Nimmt Seiten vom Bookmarklet entgegen und reicht sie an den Import-Reiter des
 * geöffneten Editors weiter. Ist gerade kein Editor offen, wird ein neuer geöffnet
 * und die Seite dort zugestellt. Das Bookmarklet nutzt dasselbe App-Fenster für
 * jeden Import, die Daten landen also im bereits offenen Editor.
 */
export class ImportInbox {
    static #queue = [];
    static #subscriber = null;
    static #listening = false;
    static #received = false;

    /** Hört dauerhaft auf Nachrichten des Bookmarklets (einmal beim Start der App aufrufen). */
    static listen() {
        if (this.#listening) return;
        this.#listening = true;

        window.addEventListener("message", event => {
            const data = event.data;
            if (data?.type !== ImportConstants.MESSAGE_TYPE) return;
            if (!event.source || event.source === window) return;

            // Zusatzseite (Info-Seite der Firma) darf ohne HTML kommen: Dann wird sie über den Server geholt.
            const optional = data.optional === true;
            if (typeof data.html !== "string" && !(optional && data.html === null)) return;

            ImportInbox.#received = true;
            ImportInbox.deliver({
                url: String(data.url || ""),
                html: data.html,
                optional,
                aboutExpected: data.aboutExpected === true,
                source: "bookmarklet"
            });
        });
    }

    /**
     * Stellt eine Seite zu. Ist kein Editor offen, wird ein neuer Editor geöffnet.
     * @param {{url: string, html: string|null, optional?: boolean, aboutExpected?: boolean, source?: string}} payload
     *        Seite; html ist null, wenn nur die URL bekannt ist. optional = Info-Seite der Firma,
     *        aboutExpected = das Bookmarklet liefert die Info-Seite selbst (kein Abruf über den Server),
     *        source = bookmarklet oder fallback (siehe ImportConstants.SOURCE_LABELS).
     */
    static deliver(payload) {
        try { window.focus(); } catch { /* Fokus kann der Browser verweigern */ }

        if (!/^#\/(new|edit\/)/.test(location.hash)) location.hash = "#/new";
        this.push(payload);
    }

    /**
     * Übergibt die Seite dem Import-Reiter. Ist er nicht (mehr) sichtbar, wartet sie,
     * bis sich ein Editor anmeldet.
     */
    static push(payload) {
        const subscriber = this.#subscriber;

        if (subscriber && subscriber.isAlive()) subscriber.listener(payload);
        else this.#queue.push(payload);
    }

    /**
     * Meldet den Import-Reiter an. Eine bereits wartende Seite wird nach dem
     * Aufbau des Editors zugestellt.
     * @param {(payload: {url: string, html: string|null}) => void} listener
     * @param {() => boolean} isAlive Gibt false zurück, sobald der Reiter nicht mehr angezeigt wird.
     */
    static subscribe(listener, isAlive = () => true) {
        this.#subscriber = { listener, isAlive };
        if (!this.#queue.length) return;

        const waiting = this.#queue;
        this.#queue = [];
        queueMicrotask(() => waiting.forEach(payload => listener(payload)));
    }

    /**
     * Für das neu geöffnete Fenster: meldet dem Bookmarklet "bereit" und ruft die URL über den
     * Server ab, falls innerhalb der Wartezeit keine Seite ankommt.
     * @param {string} fallbackUrl URL der Stellenanzeige.
     */
    static expectBookmarklet(fallbackUrl) {
        this.#received = false;
        window.opener?.postMessage({ type: ImportConstants.MESSAGE_READY }, "*");

        setTimeout(() => {
            if (!ImportInbox.#received) ImportInbox.deliver({ url: fallbackUrl, html: null, source: "fallback" });
        }, ImportConstants.FALLBACK_DELAY_MS);
    }
}
