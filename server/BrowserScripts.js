// server/BrowserScripts.js
// Skripte, die im Browser (Chrome) laufen. Jede Funktion wird als Text an den Browser geschickt
// und darf deshalb nichts aus diesem Modul verwenden. Die Kommentare am Anfang sind Marker.

/**
 * Zustand der Seite: Anmeldung, Captcha, Sperre, Textlaenge. "why" nennt den Grund einer Sperre.
 * Nur sichtbare Elemente zaehlen: Auf LinkedIn-Seiten liegen unsichtbare Formulare und Captcha-Teile
 * im Code, auch wenn nichts zu tun ist.
 */
export function stateScript() {
    /*state*/
    const url = location.href;
    const text = document.body ? (document.body.innerText || document.body.textContent || "") : "";

    const visible = element => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return box.width > 20 && box.height > 20 && style.visibility !== "hidden" && style.display !== "none";
    };
    const anyVisible = selector => Array.from(document.querySelectorAll(selector)).some(visible);

    const why = [];
    if (/linkedin\.com\/(login|authwall|uas\/login|checkpoint\/lg)/i.test(url)) why.push("login: Anmelde-Adresse");
    if (anyVisible("input[name=\"session_key\"], input[name=\"session_password\"]")) why.push("login: Anmeldeformular sichtbar");
    if (/linkedin\.com\/checkpoint\/challenge/i.test(url)) why.push("captcha: Sicherheitsprüfung (Adresse)");
    if (anyVisible("iframe[src*=\"captcha\"], iframe[src*=\"challenge\"], iframe[title*=\"captcha\" i]")) why.push("captcha: Prüfung sichtbar");
    if (/verify you are human|security verification|sicherheitsüberprüfung|kein roboter|are you a robot/i.test(text)) {
        why.push("captcha: Text der Sicherheitsprüfung");
    }

    const login = why.some(item => item.startsWith("login"));
    const captcha = why.some(item => item.startsWith("captcha"));
    const blocked = /unusual activity|access denied|temporarily restricted/i.test(text);

    return { url, title: document.title, login, captcha, blocked, textLength: text.length, why: why.join("; ") };
}

/** Klickt Knoepfe und #-Links, deren Beschriftung in der Liste steht (keine echten Links). */
export function clickScript(labels) {
    /*click*/
    let clicked = 0;
    document.querySelectorAll("button, a, summary, [role='button'], span[tabindex]").forEach(element => {
        const href = element.tagName === "A" ? (element.getAttribute("href") || "") : "";
        if (href && !/^(#|javascript:)/i.test(href)) return;

        const text = (element.innerText || element.textContent || element.getAttribute("aria-label") || "")
            .replace(/[….]+/g, "").replace(/\s+/g, " ").trim().toLowerCase();
        if (labels.includes(text)) { element.click(); clicked++; }
    });
    return clicked;
}

/**
 * Liest die sichtbare Seite als schlankes HTML. LinkedIn liefert mehrere MB Code und Daten mit
 * (versteckte Elemente, <code>-Daten, Skripte); die sichtbare Seite hat nur wenige KB.
 * Uebernommen werden Elemente und Text, Links (href) und JSON-LD-Daten. Nicht uebernommen werden
 * Skripte, Daten, unsichtbare und nur fuer Screenreader gedachte Elemente (doppelter Text) sowie
 * Navigation und Seitenleisten. Hat die Seite ein <main> mit dem Grossteil des Textes, gilt nur dieses.
 * @returns {{html: string, text: string, url: string, title: string}}
 */
export function readScript() {
    /*read*/
    const SKIP_TAGS = ["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG", "IFRAME", "CANVAS", "CODE", "LINK", "META", "HEAD", "PICTURE", "IMG", "VIDEO", "AUDIO"];
    const SKIP_SELECTOR = "aside, nav, footer, #global-nav, .global-nav, [role=\"navigation\"], [role=\"complementary\"], [role=\"dialog\"], [aria-modal=\"true\"]";
    const SCREEN_READER_ONLY = /(^|\s)(visually-hidden|sr-only|a11y-text|screen-reader-text)(\s|$)/i;

    const textOf = element => element.innerText || element.textContent || "";
    const escapeText = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const escapeAttribute = value => escapeText(value).replace(/"/g, "&quot;");

    const hidden = element => {
        if (element.hasAttribute("hidden")) return true;
        const style = getComputedStyle(element);
        return style.display === "none" || style.visibility === "hidden";
    };

    const walk = node => {
        if (node.nodeType === 3) return escapeText(node.textContent);
        if (node.nodeType !== 1) return "";

        const tag = node.tagName.toUpperCase();
        if (SKIP_TAGS.includes(tag) || node.matches(SKIP_SELECTOR)) return "";
        if (SCREEN_READER_ONLY.test(node.getAttribute("class") || "") || hidden(node)) return "";
        if (tag === "BR") return "<br>";

        let inner = "";
        node.childNodes.forEach(child => { inner += walk(child); });

        const name = tag.toLowerCase();
        const href = tag === "A" ? (node.href || node.getAttribute("href")) : "";
        return `<${name}${href ? ` href="${escapeAttribute(href)}"` : ""}>${inner}</${name}>`;
    };

    const main = document.querySelector("main");
    const bodyLength = textOf(document.body).length;
    const mainLength = main ? textOf(main).length : 0;
    const root = main && mainLength >= 500 && mainLength >= bodyLength * 0.5 ? main : document.body;

    const jsonLd = Array.from(document.querySelectorAll("script[type=\"application/ld+json\"]"))
        .map(script => `<script type="application/ld+json">${script.textContent.replace(/<\//g, "<\\/")}</script>`)
        .join("");

    const html = `<html><head><title>${escapeText(document.title)}</title>${jsonLd}</head><body>${walk(root)}</body></html>`;
    return { html, text: textOf(root), url: location.href, title: document.title };
}
