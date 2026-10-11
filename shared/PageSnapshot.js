/**
 * Liest die sichtbare Seite als schlankes HTML. Wird als Text in den Browser geschickt (Lesezeichen
 * auf der LinkedIn-Seite, Chrome des Servers) und darf deshalb nichts aus diesem Modul verwenden.
 *
 * LinkedIn liefert mehrere MB Code und Daten mit (versteckte Elemente, <code>-Daten, Skripte); die
 * sichtbare Seite hat nur wenige KB. Uebernommen werden Elemente, Text, Links (href) und JSON-LD.
 * Nicht uebernommen werden Skripte, Daten, unsichtbare und nur fuer Screenreader gedachte Elemente.
 * Mit options.structure (Firmenseiten) zusaetzlich Navigation, Seitenleisten und Fussbereich; hat die
 * Seite dann ein <main> mit dem Grossteil des Textes, gilt nur dieses.
 *
 * Die Standorte einer Firma stehen nur in den <code>-Daten (die Seite zeigt sie als Karte). Sie werden
 * als Block "Orte" mit Adresszeilen angehaengt, so wie ihn der Parser kennt.
 *
 * @param {Document} doc Die Seite (document oder das Dokument eines gleich-originigen iframes).
 * @param {{structure?: boolean}} [options]
 * @returns {{html: string, text: string, url: string, title: string, locations: number}}
 */
export function snapshotPage(doc, options) {
    /*read*/
    const structure = !!(options && options.structure);
    const view = doc.defaultView;

    const SKIP_TAGS = ["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG", "IFRAME", "CANVAS", "CODE", "LINK", "META", "HEAD", "PICTURE", "IMG", "VIDEO", "AUDIO"];
    const SKIP_STRUCTURE = "aside, nav, footer, #global-nav, .global-nav, [role=\"navigation\"], [role=\"complementary\"], [role=\"dialog\"], [aria-modal=\"true\"]";
    const SCREEN_READER_ONLY = /(^|\s)(visually-hidden|sr-only|a11y-text|screen-reader-text)(\s|$)/i;
    const MAX_NAME_WORDS = 6;

    const textOf = element => element.innerText || element.textContent || "";
    const escapeText = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const escapeAttribute = value => escapeText(value).replace(/"/g, "&quot;");

    const hidden = element => {
        if (element.hasAttribute("hidden")) return true;
        const style = view.getComputedStyle(element);
        return style.display === "none" || style.visibility === "hidden";
    };

    const walk = node => {
        if (node.nodeType === 3) return escapeText(node.textContent);
        if (node.nodeType !== 1) return "";

        const tag = node.tagName.toUpperCase();
        if (SKIP_TAGS.includes(tag)) return "";
        if (structure && node.matches(SKIP_STRUCTURE)) return "";
        if (SCREEN_READER_ONLY.test(node.getAttribute("class") || "") || hidden(node)) return "";
        if (tag === "BR") return "<br>";

        let inner = "";
        node.childNodes.forEach(child => { inner += walk(child); });

        const name = tag.toLowerCase();
        const href = tag === "A" ? (node.href || node.getAttribute("href")) : "";
        return `<${name}${href ? ` href="${escapeAttribute(href)}"` : ""}>${inner}</${name}>`;
    };

    // Objekt suchen, das den Schluessel als Liste enthaelt (die Daten sind tief verschachtelt).
    const findKey = (node, key, depth) => {
        if (!node || typeof node !== "object" || depth > 7) return null;
        if (!Array.isArray(node) && Array.isArray(node[key])) return node;

        const children = Array.isArray(node) ? node : Object.keys(node).map(name => node[name]);
        for (const child of children) {
            const hit = findKey(child, key, depth + 1);
            if (hit) return hit;
        }
        return null;
    };

    // Standorte aus den Daten der Seite: "Orte", Hauptstandort zuerst ("Primär"), je Standort Name und Adresse.
    const locationBlock = () => {
        const entries = [];
        const known = new Set();

        doc.querySelectorAll("code").forEach(code => {
            const text = code.textContent || "";
            if (entries.length || text.length < 200 || text.indexOf("groupedLocations") < 0) return;

            let data;
            try { data = JSON.parse(text); } catch (error) { return; }

            const company = findKey(data, "groupedLocations", 0);
            if (!company) return;

            company.groupedLocations.forEach(group => (group.locations || []).forEach(location => {
                const address = location.address || {};
                const line = [address.line1, address.line2, address.city, [address.geographicArea, address.postalCode].filter(Boolean).join(" ")]
                    .filter(Boolean).join(", ");
                if (!line || known.has(line)) return;

                known.add(line);
                const name = (location.description || "").trim();
                const usable = name && name.split(/\s+/).length <= MAX_NAME_WORDS && !/[.!?:]$/.test(name);
                entries.push({ primary: location.headquarter === true, name: usable ? name : "", line });
            }));
        });

        if (!entries.length) return { html: "", count: 0 };

        entries.sort((a, b) => Number(b.primary) - Number(a.primary));
        const lines = ["Orte"];
        entries.forEach(entry => {
            if (entry.primary) lines.push("Primär");
            if (entry.name) lines.push(entry.name);
            lines.push(entry.line);
        });
        return { html: lines.map(line => `<p>${escapeText(line)}</p>`).join(""), count: entries.length };
    };

    const main = structure ? doc.querySelector("main") : null;
    const bodyLength = textOf(doc.body).length;
    const mainLength = main ? textOf(main).length : 0;
    const root = main && mainLength >= 500 && mainLength >= bodyLength * 0.5 ? main : doc.body;

    const jsonLd = Array.from(doc.querySelectorAll("script[type=\"application/ld+json\"]"))
        .map(script => `<script type="application/ld+json">${script.textContent.replace(/<\//g, "<\\/")}</script>`)
        .join("");

    const locations = locationBlock();
    const title = doc.title || "";
    const html = `<html><head><title>${escapeText(title)}</title>${jsonLd}</head><body>${walk(root)}${locations.html}</body></html>`;

    return { html, text: textOf(root), url: doc.location ? doc.location.href : "", title, locations: locations.count };
}
