import { ImportConstants } from "../constants/ImportConstants.js";
import { ParserConstants } from "../constants/ParserConstants.js";
import { SectionParser } from "../analysis/parser/SectionParser.js";

const SHOW_TEXT = 4; // NodeFilter.SHOW_TEXT

/**
 * Holt aus dem HTML einer Stellenanzeige den relevanten Bereich, die Rohdaten
 * (Zeile für Zeile) und die enthaltenen Links.
 */
export class ImportJobPage {

    constructor() {
        // Dieselben Überschriften wie die Analyse (ParserConstants.SECTION_HEADLINES).
        this.sectionParser = new SectionParser(ParserConstants.SECTION_HEADLINES);
    }

    /**
     * @param {string} html Vollständiges HTML der Seite.
     * @param {string} pageUrl Adresse der Seite (für relative Links).
     * @returns {{url: string, source: string, lines: string[], text: string,
     *            links: {href: string, label: string, type: string}[], companyAboutUrl: string,
     *            companyUrl: string, blocked: boolean}}
     *          companyAboutUrl / companyUrl = Info-Seite und Hauptseite der Firma, gebildet aus dem
     *          Firmennamen im Link ("" ohne Link). blocked = true, wenn die Seite statt des Inhalts
     *          eine Cookie-Abfrage oder Anmeldung zeigt.
     */
    extract(html, pageUrl) {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const fullLines = this.jobPostingLines(doc);
        const slug = this.companySlug(doc, pageUrl);
        doc.querySelectorAll(ImportConstants.REMOVE_TAGS.join(",")).forEach(node => node.remove());

        // Banner zuerst entfernen: Sonst kann eine Überschrift im Banner den Bereich bestimmen.
        this.removeBanners(doc.body);

        const { container, source } = this.findContainer(doc, pageUrl);

        const lines = this.cutIgnored(this.repairTruncated(this.toLines(container), fullLines));
        const links = this.collectLinks(container, pageUrl);
        return {
            url: pageUrl, source, lines, text: lines.join("\n"), links,
            companyAboutUrl: slug ? ImportConstants.COMPANY_URL_BASE + slug + ImportConstants.COMPANY_ABOUT_SUFFIX : "",
            companyUrl: slug ? ImportConstants.COMPANY_URL_BASE + slug + ImportConstants.COMPANY_HOME_SUFFIX : "",
            blocked: this.isWall(lines)
        };
    }

    /**
     * Cookie-Abfrage oder Anmeldeseite: kein Text oder überwiegend Zeilen, wie sie dort stehen.
     * @param {string[]} lines Zeilen des Bereichs.
     * @returns {boolean} true, wenn die Seite keinen Inhalt liefert.
     */
    isWall(lines) {
        if (!lines.length) return true;

        const wall = lines.filter(line => ImportConstants.WALL_LINE_REGEX.test(line)).length;
        return wall / lines.length >= ImportConstants.WALL_SHARE;
    }

    /**
     * Firmenname aus dem ersten Firmenlink der Seite (linkedin.com/company/<firmenname>/...).
     * Auf einer Firmenseite selbst: "".
     * @param {Document} doc Geparste Seite.
     * @param {string} pageUrl Adresse der Seite.
     * @returns {string} Firmenname im Link oder "".
     */
    companySlug(doc, pageUrl) {
        if (ImportConstants.COMPANY_SLUG_REGEX.test(pageUrl ?? "")) return "";

        const base = this.parseUrl(pageUrl);
        for (const anchor of doc.querySelectorAll("a[href]")) {
            const url = this.parseUrl(anchor.getAttribute("href").trim(), base);
            const slug = url?.href.match(ImportConstants.COMPANY_SLUG_REGEX)?.[1];
            if (slug) return slug;
        }
        return "";
    }

    /**
     * Liest den vollständigen Anzeigentext aus den strukturierten Daten der Seite
     * (JSON-LD, Typ JobPosting). Leer, wenn die Seite keine liefert.
     * @returns {string[]}
     */
    jobPostingLines(doc) {
        const lines = [];
        doc.querySelectorAll("script[type='application/ld+json']").forEach(node => {
            let data;
            try { data = JSON.parse(node.textContent); } catch { return; }

            this.flatten(data).filter(item => this.isJobPosting(item) && typeof item.description === "string")
                .forEach(item => {
                    const part = new DOMParser().parseFromString(item.description, "text/html");
                    lines.push(...this.toLines(part.body));
                });
        });
        return lines;
    }

    flatten(data) {
        if (Array.isArray(data)) return data.flatMap(item => this.flatten(item));
        if (data && typeof data === "object") return [data, ...this.flatten(data["@graph"] ?? [])];
        return [];
    }

    isJobPosting(item) {
        const type = item["@type"];
        return Array.isArray(type) ? type.includes("JobPosting") : type === "JobPosting";
    }

    /**
     * Ersetzt gekürzte Zeilen ("Wir suchen …") durch die volle Zeile aus den
     * strukturierten Daten und entfernt reine "mehr"-Knöpfe.
     */
    repairTruncated(lines, fullLines) {
        const norm = text => text.toLowerCase().replace(/\s+/g, " ");

        return lines
            .filter(line => !ImportConstants.EXPAND_LINE_REGEX.test(line))
            .map(line => {
                if (!ImportConstants.TRUNCATED_REGEX.test(line)) return line;

                const stem = norm(line.replace(ImportConstants.TRUNCATED_REGEX, ""));
                if (stem.length < ImportConstants.MIN_STEM) return line;

                const full = fullLines.find(candidate => norm(candidate).startsWith(stem));
                return full ?? line;
            });
    }

    /**
     * Bestimmt den Anzeigenbereich: Ausgangspunkt ist der Anker "Details zum Jobangebot".
     * Erweitert wird um den nächstgelegenen Stellentitel und alle Abschnittsüberschriften
     * (ParserConstants.SECTION_HEADLINES) - jeweils auf das kleinste gemeinsame
     * Elternelement. Ohne Anker: Titel bzw. erste Überschrift; ohne beides die ganze Seite.
     */
    findContainer(doc, pageUrl) {
        const body = doc.body;

        // Eine Firmenseite ist selbst der Inhalt: ganze Seite (ohne Banner).
        if (ImportConstants.COMPANY_SLUG_REGEX.test(pageUrl ?? "")) return { container: body, source: "Firmenseite" };

        const phrase = this.findByPhrase(body);
        const titles = this.titleCandidates(body);
        const headings = this.headingCandidates(body);

        const seed = phrase ?? titles[0] ?? headings[0];
        if (!seed) return { container: body, source: "Ganze Seite (kein Anker gefunden)" };

        const extras = [...headings];
        const title = this.nearest(seed, titles);
        if (title) extras.push(title);
        extras.sort((a, b) => this.depth(this.commonAncestor(seed, b)) - this.depth(this.commonAncestor(seed, a)));

        let container = this.climb(seed, body);
        let added = 0;

        for (const element of extras) {
            if (container.contains(element)) continue;

            const next = this.commonAncestor(container, element);
            if (!next || next === doc.documentElement) continue;
            if (next.textContent.length > container.textContent.length * ImportConstants.GROWTH_LIMIT) continue;

            container = next;
            added++;
        }

        const start = phrase ? "Details zum Jobangebot" : (titles[0] ? "Titel" : "Überschrift");
        return { container, source: `${start} + ${added} Erweiterung(en)` };
    }

    /** Stellentitel: Texte mit "(m/w/d)" und alle h1, außerhalb von Navigation und Fußbereich. */
    titleCandidates(body) {
        const marks = this.textNodes(body)
            .filter(node => ImportConstants.ANCHOR_GENDER_REGEX.test(node.textContent))
            .map(node => node.parentElement);

        const found = [...marks, ...body.querySelectorAll("h1")];
        return [...new Set(found)].filter(el => !el.closest(ImportConstants.TITLE_EXCLUDE_SELECTOR));
    }

    /** Elemente, deren (kurzer) Text eine bekannte Abschnittsüberschrift ist. */
    headingCandidates(body) {
        const found = new Set();

        this.textNodes(body).forEach(node => {
            const element = node.parentElement;
            const text = node.textContent.replace(/\s+/g, " ").trim();
            if (!element || !text || text.length > ImportConstants.HEADING_MAX_CHARS) return;
            if (element.textContent.trim().length > ImportConstants.HEADING_MAX_CHARS) return;
            if (element.closest(ImportConstants.HEADING_EXCLUDE_SELECTOR)) return;
            if (this.isIgnoredHeading(text)) return;
            if (this.sectionParser.findSection(text)) found.add(element);
        });

        return [...found];
    }

    /** "Ähnliche Jobs" u. ä. (ParserConstants.IGNORE_SECTIONS) gehören nicht zur Anzeige. */
    isIgnoredHeading(text) {
        const lower = text.toLowerCase();
        return ParserConstants.IGNORE_SECTIONS.anyOf.some(term => lower.includes(term));
    }

    /** Schneidet die Zeilen ab der Überschrift eines ignorierten Abschnitts ab. */
    cutIgnored(lines) {
        const index = lines.findIndex(line => line.split(/\s+/).length <= 6 && this.isIgnoredHeading(line));
        return index > 0 ? lines.slice(0, index) : lines;
    }

    nearest(seed, elements) {
        return [...elements].sort((a, b) =>
            this.depth(this.commonAncestor(seed, b)) - this.depth(this.commonAncestor(seed, a)))[0] ?? null;
    }

    commonAncestor(a, b) {
        let node = a;
        while (node && !node.contains(b)) node = node.parentElement;
        return node;
    }

    depth(element) {
        let depth = 0;
        for (let node = element; node?.parentElement; node = node.parentElement) depth++;
        return depth;
    }

    textNodes(root) {
        const walker = root.ownerDocument.createTreeWalker(root, SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        return nodes;
    }

    findByPhrase(body) {
        const phrases = ImportConstants.ANCHOR_PHRASES.map(p => p.toLowerCase());
        const hit = this.textNodes(body).find(node => {
            const value = node.textContent.toLowerCase();
            return phrases.some(phrase => value.includes(phrase));
        });
        return hit?.parentElement ?? null;
    }

    /** Steigt vom Anker auf, bis ein Anzeigenbereich erreicht ist. */
    climb(start, body) {
        let node = start;
        while (node.parentElement && node.parentElement !== body) {
            node = node.parentElement;
            if (this.isJobContainer(node)) return node;
        }
        return body;
    }

    isJobContainer(node) {
        return node.matches("article, main, [role='main']")
            || node.textContent.length >= ImportConstants.MIN_CONTAINER_TEXT;
    }

    /** Entfernt kurze Cookie-/Einwilligungs-Banner und Dialoge. */
    removeBanners(container) {
        container.querySelectorAll(ImportConstants.BANNER_SELECTOR).forEach(node => {
            if (node.textContent.length <= ImportConstants.BANNER_MAX_TEXT) node.remove();
        });
    }

    /** Rohdaten zeilenweise: jedes Nicht-Inline-Tag und jedes br beginnt eine neue Zeile. */
    toLines(root) {
        const lines = [];
        let current = "";

        const flush = () => {
            // Jobboersen trennen Angaben mit "·" (Ort · Alter der Anzeige · Bewerberzahl):
            // jede Angabe wird eine eigene Zeile, damit Rauschen nicht den Ort mitreisst.
            current.replace(/\s+/g, " ").split(ImportConstants.LINE_SEPARATOR_REGEX).map(part => part.trim())
                .filter(Boolean).forEach(part => lines.push(part));
            current = "";
        };

        const walk = node => {
            if (node.nodeType === 3) { current += node.textContent; return; }
            if (node.nodeType !== 1) return;

            const tag = node.tagName.toLowerCase();
            const inline = ImportConstants.INLINE_TAGS.has(tag);
            if (tag === "br") { flush(); return; }

            if (!inline) flush();
            node.childNodes.forEach(walk);
            if (!inline) flush();
        };

        walk(root);
        flush();
        return lines;
    }

    /** Alle http(s)-Links des Bereichs, ohne Duplikate, als intern (gleiche Domain) oder extern. */
    collectLinks(container, pageUrl) {
        const base = this.parseUrl(pageUrl);
        const found = new Map();

        container.querySelectorAll("a[href]").forEach(anchor => {
            const href = anchor.getAttribute("href").trim();
            if (!href || href.startsWith("#") || /^(javascript|mailto|tel):/i.test(href)) return;

            const parsed = this.parseUrl(href, base);
            if (!parsed || !/^https?:$/.test(parsed.protocol)) return;

            const url = this.unwrapRedirect(parsed);

            url.hash = "";
            if (found.has(url.href)) return;

            found.set(url.href, {
                href: url.href,
                label: anchor.textContent.replace(/\s+/g, " ").trim(),
                type: base && this.host(url) === this.host(base) ? "intern" : "extern"
            });
        });

        return [...found.values()];
    }

    /** Löst Weiterleitungs-Links auf den echten Ziellink auf (Parameter "url"). */
    unwrapRedirect(url) {
        if (!ImportConstants.REDIRECT_PATH_REGEX.test(url.pathname)) return url;

        const target = this.parseUrl(url.searchParams.get("url") ?? "");
        return target && /^https?:$/.test(target.protocol) ? target : url;
    }

    parseUrl(value, base) {
        try {
            return new URL(value, base ?? undefined);
        } catch {
            return null;
        }
    }

    host(url) {
        return url.hostname.replace(/^www\./i, "");
    }
}
