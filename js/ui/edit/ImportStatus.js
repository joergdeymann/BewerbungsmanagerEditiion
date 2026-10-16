import { ImportConstants } from "../../constants/ImportConstants.js";

/**
 * Anzeige im Kopfbereich ("Neue Bewerbung", rechts in der Reiterzeile): welche Seite gerade
 * geladen wird (Hauptseite, Nebenseite, Firmenseite) und wie der Abruf ausgegangen ist.
 *
 * Schnelle Schritte (z. B. eine Seite, die das Lesezeichen schon fertig liefert) bleiben je
 * mindestens dwellMs sichtbar und erscheinen nacheinander in der richtigen Reihenfolge; der Import
 * selbst wartet darauf nicht. Nach dem letzten Abruf verschwindet die Anzeige nach STATUS_HIDE_MS.
 */
export class ImportStatus {
    /**
     * @param {() => (HTMLElement|null)} [findElement] Liefert das Anzeigeelement (wird bei jeder
     *        Meldung neu gesucht, der Kopfbereich kann neu aufgebaut worden sein).
     * @param {number} [dwellMs] Mindestdauer jeder Meldung in Millisekunden.
     */
    constructor(
        findElement = () => document.querySelector(ImportConstants.STATUS_SELECTOR),
        dwellMs = ImportConstants.STATUS_MIN_VISIBLE_MS
    ) {
        this.findElement = findElement;
        this.dwellMs = dwellMs;
        this.pending = 0;
        this.queue = [];
        this.last = "";
        this.holding = false;
        this.dwellTimer = null;
        this.hideTimer = null;
    }

    /**
     * Ein Abruf beginnt (oder die App wartet auf eine Seite).
     * @param {"main"|"side"|"company"} kind Seitenart (Schlüssel von ImportConstants.PAGE).
     * @param {string} [detail] Unterseite, z. B. "Kontakt" (Anzeige: "Firmenseite (Kontakt) ...").
     */
    begin(kind, detail = "") {
        this.pending++;
        this.enqueue(`${this.label(kind, detail)} wird geladen ...`);
    }

    /**
     * Ein Abruf ist beendet. Läuft kein weiterer, bleibt das Ergebnis kurz sichtbar.
     * @param {"main"|"side"|"company"} kind Seitenart (Schlüssel von ImportConstants.PAGE).
     * @param {boolean} [ok] false, wenn der Abruf fehlgeschlagen ist.
     * @param {string} [detail] Unterseite, z. B. "Kontakt".
     */
    end(kind, ok = true, detail = "") {
        const label = this.label(kind, detail);

        this.pending = Math.max(0, this.pending - 1);
        this.enqueue(ok ? `${label} geladen` : `${label} nicht geladen`);

        if (!this.pending && !this.holding && !this.queue.length) this.scheduleHide();
    }

    label(kind, detail) {
        const label = ImportConstants.PAGE[kind].label;
        return detail ? `${label} (${detail})` : label;
    }

    enqueue(text) {
        clearTimeout(this.hideTimer);
        if (text === (this.queue.at(-1) ?? this.last)) return;

        this.queue.push(text);
        this.showNext();
    }

    showNext() {
        if (this.holding || !this.queue.length) return;

        this.last = this.queue.shift();
        this.show(this.last);
        this.holding = true;

        this.dwellTimer = this.timer(() => {
            this.holding = false;

            if (this.queue.length) this.showNext();
            else if (!this.pending) this.scheduleHide();
        }, this.dwellMs);
    }

    scheduleHide() {
        clearTimeout(this.hideTimer);
        this.hideTimer = this.timer(() => this.hide(), ImportConstants.STATUS_HIDE_MS);
    }

    timer(callback, delay) {
        const id = setTimeout(callback, delay);
        id.unref?.();
        return id;
    }

    show(text) {
        const element = this.findElement();
        if (!element) return;

        element.textContent = text;
        element.hidden = false;
    }

    hide() {
        this.last = "";

        const element = this.findElement();
        if (!element) return;

        element.textContent = "";
        element.hidden = true;
    }
}
