/**
 * Hilfen zum Zusammenführen von Texten und Listen ohne doppelte Information.
 * Verglichen wird ohne Groß-/Kleinschreibung, Satzzeichen und Leerraum.
 */
export class TextMerge {
    /** Sätze mit mindestens so vielen Wörtern gelten auch bei überwiegend gleichem Inhalt als vorhanden. */
    static OVERLAP_MIN_WORDS = 4;

    /** Anteil gemeinsamer Wörter (bezogen auf den kürzeren Satz), ab dem ein Satz als vorhanden gilt. */
    static OVERLAP_SHARE = 0.8;

    /**
     * @param {string} text Text.
     * @returns {string} kleingeschrieben, nur Buchstaben und Ziffern, einfache Leerzeichen.
     */
    static normalize(text) {
        return String(text ?? "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    }

    /**
     * @param {string} text Text mit Sätzen oder Zeilen.
     * @returns {string[]} Sätze ohne Leerstücke.
     */
    static sentences(text) {
        return String(text ?? "")
            .split(/(?<=[.!?])\s+|\n+/u)
            .map(sentence => sentence.trim())
            .filter(Boolean);
    }

    /**
     * Prüft, ob die Information eines Satzes in vorhandenen Sätzen schon steht.
     * @param {string} sentence Neuer Satz.
     * @param {string[]} existing Vorhandene Sätze oder Einträge.
     * @returns {boolean} true, wenn der Satz nichts Neues enthält.
     */
    static isCovered(sentence, existing) {
        const key = TextMerge.normalize(sentence);
        if (!key) return true;

        const known = existing.map(item => TextMerge.normalize(item)).filter(Boolean);
        if (known.some(item => item === key || item.includes(key))) return true;

        const words = new Set(key.split(" "));
        if (words.size < TextMerge.OVERLAP_MIN_WORDS) return false;

        return known.some(item => {
            const other = new Set(item.split(" "));
            if (other.size < TextMerge.OVERLAP_MIN_WORDS) return false;

            const common = [...words].filter(word => other.has(word)).length;
            return common / Math.min(words.size, other.size) >= TextMerge.OVERLAP_SHARE;
        });
    }

    /**
     * Ergänzt eine Liste um Einträge, die noch nicht vorkommen (Reihenfolge der vorhandenen bleibt).
     * @param {string[]} existing Vorhandene Einträge.
     * @param {string[]} incoming Neue Einträge.
     * @returns {string[]} Neue Liste.
     */
    static union(existing = [], incoming = []) {
        const result = [...existing];

        for (const item of incoming ?? []) {
            if (!TextMerge.isCovered(item, result)) result.push(item);
        }

        return result;
    }

    /**
     * Hängt an einen Text nur die Sätze an, die dort noch nicht stehen.
     * @param {string} existing Vorhandener Text (auch leer).
     * @param {string} incoming Neuer Text.
     * @param {number} [limit] Höchstzahl angehängter Sätze.
     * @returns {string} Text mit den neuen Sätzen.
     */
    static supplementText(existing, incoming, limit = Infinity) {
        const known = TextMerge.sentences(existing);
        const added = [];

        for (const sentence of TextMerge.sentences(incoming)) {
            if (added.length >= limit) break;
            if (TextMerge.isCovered(sentence, [...known, ...added])) continue;

            added.push(sentence);
        }

        return [String(existing ?? "").trim(), ...added].filter(Boolean).join(" ");
    }
}
