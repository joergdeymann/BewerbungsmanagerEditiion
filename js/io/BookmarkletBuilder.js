import { ImportConstants } from "../constants/ImportConstants.js";

/**
 * Läuft als Bookmarklet im Tab der Stellenanzeige (darf keine Imports oder Klassen der App verwenden).
 * Bestätigt Cookie-Abfragen, klappt gekürzte Texte ("… mehr") auf, öffnet die App (oder nutzt das schon offene App-Fenster) und schickt das HTML der Seite dorthin.
 * Die Info-Seite der Firma lädt es danach in einem unsichtbaren Rahmen (mit der Anmeldung des Benutzers) und schickt sie als zweite Seite.
 * Wird als Quelltext in den Lesezeichen-Link eingebettet.
 * @param {{app: string, origin: string, type: string, ready: string, accept: string[]}} cfg
 */
function bookmarkletMain(cfg) {
    const clickLabels = (root, labels) => {
        root.querySelectorAll("button, a, summary, [role='button'], span[tabindex]").forEach(el => {
            const href = el.tagName === "A" ? (el.getAttribute("href") || "") : "";
            if (href && !/^(#|javascript:)/i.test(href)) return;

            const text = (el.innerText || el.textContent || el.getAttribute("aria-label") || "")
                .replace(/[….]+/g, "").replace(/\s+/g, " ").trim().toLowerCase();
            if (labels.includes(text)) el.click();
        });
    };

    clickLabels(document, cfg.accept);
    clickLabels(document, cfg.expand);

    // Info-Seite der Firma: Der Firmenname steht im Link der Anzeige. Die Seite liegt auf derselben
    // Domain wie die Anzeige und wird in einem unsichtbaren Rahmen mit der Anmeldung des Benutzers
    // geladen (keine Zugangsdaten nötig). Sie ist selbst keine Firmenseite? Dann gibt es eine.
    const slugRegex = new RegExp(cfg.companySlug, "i");
    const slugMatch = Array.from(document.querySelectorAll("a[href]")).map(a => a.href.match(slugRegex)).find(Boolean);
    const wantAbout = !!slugMatch && !slugRegex.test(location.href);
    const frameUrl = wantAbout ? location.origin + "/company/" + slugMatch[1] + cfg.aboutSuffix : "";
    const entryUrl = wantAbout ? cfg.companyBase + slugMatch[1] + cfg.aboutSuffix : "";

    const readFrame = () => new Promise(resolve => {
        const frame = document.createElement("iframe");
        frame.style.cssText = "position:fixed;left:-9999px;top:0;width:1200px;height:900px;border:0;";

        const done = html => { clearTimeout(timer); frame.remove(); resolve(html); };
        const timer = setTimeout(() => done(null), cfg.frameTimeout);

        frame.onload = () => setTimeout(() => {
            try {
                const doc = frame.contentDocument;
                clickLabels(doc, cfg.accept);
                clickLabels(doc, cfg.expand);
                setTimeout(() => {
                    try { done(doc.documentElement.outerHTML); } catch (e) { done(null); }
                }, cfg.wait);
            } catch (e) { done(null); }
        }, cfg.frameWait);

        frame.src = frameUrl;
        document.body.appendChild(frame);
    });

    // Vorhandenes App-Fenster weiterverwenden: window.open("", name) liefert es zurück, ohne es
    // neu zu laden. Ein neu angelegtes Fenster ist leer (about:blank, lesbar); ein vorhandenes
    // App-Fenster gehört einer anderen Domain, der Zugriff darauf löst einen Fehler aus.
    const target = window.open("", cfg.windowName);
    if (!target) return;

    let existing = true;
    try { existing = target.location.href !== "about:blank"; } catch (e) { existing = true; }

    const post = () => {
        clickLabels(document, cfg.expand);
        setTimeout(() => {
            target.postMessage(
                { type: cfg.type, url: location.href, html: document.documentElement.outerHTML, aboutExpected: wantAbout },
                cfg.origin
            );

            // html null = Rahmen nicht lesbar: Die App holt die Seite dann über den Server.
            if (wantAbout) {
                readFrame().then(html => target.postMessage({ type: cfg.type, url: entryUrl, html, optional: true }, cfg.origin));
            }
        }, cfg.wait);
    };

    if (existing) {
        try { target.focus(); } catch (e) { /* Fokus kann der Browser verweigern */ }
        post();
        return;
    }

    target.location.href = cfg.app + "?importUrl=" + encodeURIComponent(location.href);

    const onReady = event => {
        if (event.source !== target || event.origin !== cfg.origin) return;
        if (!event.data || event.data.type !== cfg.ready) return;

        window.removeEventListener("message", onReady);
        post();
    };
    window.addEventListener("message", onReady);
}

export class BookmarkletBuilder {

    /** @returns {string} javascript:-Link für die Lesezeichen-Leiste. */
    href() {
        const config = {
            app: location.origin + location.pathname,
            origin: location.origin,
            type: ImportConstants.MESSAGE_TYPE,
            ready: ImportConstants.MESSAGE_READY,
            accept: ImportConstants.COOKIE_ACCEPT_LABELS,
            expand: ImportConstants.EXPAND_LABELS,
            wait: ImportConstants.EXPAND_WAIT_MS,
            windowName: ImportConstants.WINDOW_NAME,
            companySlug: ImportConstants.COMPANY_SLUG_REGEX.source,
            companyBase: ImportConstants.COMPANY_URL_BASE,
            aboutSuffix: ImportConstants.COMPANY_ABOUT_SUFFIX,
            frameWait: ImportConstants.FRAME_WAIT_MS,
            frameTimeout: ImportConstants.FRAME_TIMEOUT_MS
        };
        const code = `(${bookmarkletMain.toString()})(${JSON.stringify(config)});`;
        return "javascript:" + encodeURIComponent(code);
    }
}
