// server/BrowserScripts.js
// Skripte, die im Browser (Chrome) laufen (Seite lesen: shared/PageSnapshot.js). Jede Funktion wird als Text an den Browser geschickt
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
