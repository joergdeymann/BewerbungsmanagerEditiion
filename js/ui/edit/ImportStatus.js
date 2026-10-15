import { ImportConstants } from "../../constants/ImportConstants.js";

/**
 * Anzeige im Kopfbereich ("Neue Bewerbung", rechts unten): welche Seite gerade geladen wird
 * (Hauptseite, Nebenseite, Firmenseite). Nach dem letzten Abruf bleibt das Ergebnis kurz
 * stehen und verschwindet dann.
 */
export class ImportStatus {
    /**
     * @param {() => (HTMLElement|null)} [findElement] Liefert das Anzeigeelement (wird bei jeder
     *        Meldung neu gesucht, der Kopfbereich kann neu aufgebaut worden sein).
     */
    constructor(findElement = () => document.querySelector(ImportConstants.STATUS_SELECTOR)) {
        this.findElement = findElement;
        this.pending = 0;
        this.timer = null;
    }

    /**
     * Ein Abruf beginnt.
     * @param {"main"|"side"|"company"} kind Seitenart (Schlüssel von ImportConstants.PAGE).
     */
    begin(kind) {
        clearTimeout(this.timer);
        this.pending++;
        this.show(`${ImportConstants.PAGE[kind].label} wird geladen ...`);
    }

    /**
     * Ein Abruf ist beendet. Läuft kein weiterer, bleibt das Ergebnis kurz sichtbar.
     * @param {"main"|"side"|"company"} kind Seitenart (Schlüssel von ImportConstants.PAGE).
     * @param {boolean} [ok] false, wenn der Abruf fehlgeschlagen ist.
     */
    end(kind, ok = true) {
        this.pending = Math.max(0, this.pending - 1);
        if (this.pending) return;

        const label = ImportConstants.PAGE[kind].label;
        this.show(ok ? `${label} geladen` : `${label} nicht geladen`);

        this.timer = setTimeout(() => this.hide(), ImportConstants.STATUS_HIDE_MS);
        this.timer.unref?.();
    }

    show(text) {
        const element = this.findElement();
        if (!element) return;

        element.textContent = text;
        element.hidden = false;
    }

    hide() {
        const element = this.findElement();
        if (!element) return;

        element.textContent = "";
        element.hidden = true;
    }
}
