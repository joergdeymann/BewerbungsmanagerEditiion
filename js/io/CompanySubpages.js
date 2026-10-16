import { ImportConstants } from "../constants/ImportConstants.js";

/**
 * Sucht auf der Firmenseite (Website der Firma) die Links zu Kontakt, Karriere und Impressum.
 * Die Reihenfolge der Treffer ist die Ladereihenfolge (ImportConstants.SUBPAGES, Impressum zuletzt).
 */
export class CompanySubpages {
    /**
     * @param {{href: string, label: string}[]} links Links der Firmenseite (Ergebnis des Imports).
     * @param {string} pageUrl Adresse der Firmenseite.
     * @returns {{key: string, label: string, url: string}[]} höchstens ein Treffer je Unterseite.
     */
    static find(links, pageUrl) {
        const base = CompanySubpages.parse(pageUrl);
        if (!base) return [];

        const used = new Set([CompanySubpages.clean(base)]);
        const found = [];

        for (const page of ImportConstants.SUBPAGES) {
            const best = CompanySubpages.best(links ?? [], base, page, used);
            if (!best) continue;

            used.add(best);
            found.push({ key: page.key, label: page.label, url: best });
        }

        return found;
    }

    static best(links, base, page, used) {
        const candidates = [];

        for (const link of links) {
            const url = CompanySubpages.parse(link.href);
            if (!url || !CompanySubpages.sameSite(url, base)) continue;
            if (ImportConstants.SUBPAGE_FILE_REGEX.test(url.pathname)) continue;

            const href = CompanySubpages.clean(url);
            if (used.has(href)) continue;

            const score = CompanySubpages.score(link.label, url, page.words);
            if (score) candidates.push({ href, score });
        }

        candidates.sort((a, b) => b.score - a.score || a.href.length - b.href.length);
        return candidates[0]?.href ?? "";
    }

    /** Linktext gleich dem Begriff = 3, Begriff im Linktext = 2, Begriff im Pfad = 1, sonst 0. */
    static score(label, url, words) {
        const text = String(label ?? "").trim().toLowerCase();
        const path = decodeURIComponent(url.pathname).toLowerCase();

        if (words.includes(text)) return 3;
        if (words.some(word => new RegExp(`(?:^|[^\\p{L}])${word}(?![\\p{L}])`, "u").test(text))) return 2;
        if (words.some(word => path.includes(word))) return 1;

        return 0;
    }

    /** Gleiche Website: derselbe Host oder eine Unterseite der Domain (karriere.firma.de zu www.firma.de). */
    static sameSite(url, base) {
        const root = base.hostname.replace(/^www\./, "");
        const host = url.hostname.replace(/^www\./, "");

        return host === root || host.endsWith(`.${root}`);
    }

    static clean(url) {
        const copy = new URL(url.href);
        copy.hash = "";
        return copy.href;
    }

    static parse(value) {
        try {
            const url = new URL(value);
            return /^https?:$/.test(url.protocol) ? url : null;
        } catch {
            return null;
        }
    }
}
