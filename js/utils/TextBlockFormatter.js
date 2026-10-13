import { HtmlUtils } from "./HtmlUtils.js";

/**
 * Formatiert einen zeilenweisen Text (z. B. die Selbstbeschreibung einer Firma) lesbar:
 * Zwischenüberschriften, Absätze und Aufzählungen statt einer zusammenhängenden Textwand.
 * Die Ausgabe nutzt nur vorhandene Stile (Rahmen des Feldes, "text-content" mit Zeilenumbrüchen).
 *
 * Regeln je Zeile: Endet sie auf ":" oder "?" und ist kurz, ist sie eine Zwischenüberschrift.
 * Endet sie auf einen Satzschluss, ist sie lang oder beginnt mit einem Symbol (z. B. 📍), ist sie ein Absatz.
 * Kurze Zeilen ohne Satzschluss sind Aufzählungspunkte (ab zwei in Folge oder hinter einer Überschrift).
 */
export class TextBlockFormatter {

    /** Längste Zwischenüberschrift (Wörter). */
    static HEADING_MAX_WORDS = 8;

    /** Längster Aufzählungspunkt (Wörter). */
    static ITEM_MAX_WORDS = 14;

    /**
     * @param {string} text Text mit einer Zeile je Zeilenumbruch.
     * @returns {string} Inline-HTML (alle Texte maskiert) für ein Element mit "white-space: pre-line"
     *          (vorhandene Klasse "text-content"): Überschriften fett, Aufzählungspunkte mit "• ",
     *          zwischen den Blöcken eine Leerzeile.
     */
    toHtml(text) {
        const blocks = this.toBlocks(text);
        let html = "";

        blocks.forEach((block, index) => {
            if (index > 0) html += blocks[index - 1].type === "heading" ? "\n" : "\n\n";
            html += this.renderBlock(block);
        });
        return html;
    }

    /**
     * @param {string} text
     * @returns {{type: "heading"|"paragraph"|"list", lines: string[]}[]}
     */
    toBlocks(text) {
        const blocks = [];
        let items = [];

        const flush = () => {
            if (!items.length) return;
            const afterHeading = blocks[blocks.length - 1]?.type === "heading";
            if (items.length >= 2 || afterHeading) blocks.push({ type: "list", lines: items });
            else items.forEach(line => blocks.push({ type: "paragraph", lines: [line] }));
            items = [];
        };

        for (const raw of String(text ?? "").split(/\r?\n/)) {
            const line = raw.trim();
            if (!line) continue;

            const type = this.classify(line);
            if (type === "item") { items.push(line); continue; }

            flush();
            blocks.push({ type, lines: [line] });
        }
        flush();
        return blocks;
    }

    /**
     * @param {string} line
     * @returns {"heading"|"paragraph"|"item"}
     */
    classify(line) {
        const words = line.split(/\s+/).length;

        if (/^[^\p{L}\p{N}]/u.test(line)) return "paragraph";
        if (/[:?]$/.test(line) && words <= TextBlockFormatter.HEADING_MAX_WORDS) return "heading";
        if (/[.!?…:]$/.test(line) || words > TextBlockFormatter.ITEM_MAX_WORDS) return "paragraph";
        return "item";
    }

    /** @param {{type: string, lines: string[]}} block @returns {string} */
    renderBlock(block) {
        if (block.type === "heading") return `<strong>${HtmlUtils.escape(block.lines[0])}</strong>`;
        if (block.type === "paragraph") return HtmlUtils.escape(block.lines[0]);

        return block.lines.map(line => `• ${HtmlUtils.escape(line)}`).join("\n");
    }
}
