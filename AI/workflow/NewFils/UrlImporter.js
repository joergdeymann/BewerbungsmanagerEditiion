export class UrlImporter {

    async fetch(url) {
        const html = await this.getHtml(url);
        return { html, text: this.htmlToText(html) };
    }

    async getHtml(url) {
        let response;
        try {
            response = await fetch(`/api/fetch-url?url=${encodeURIComponent(url)}`);
        } catch {
            throw new Error(
                "Der lokale Server ist nicht erreichbar. Läuft \"node server.js\"?"
            );
        }

        const contentType = response.headers.get("content-type") || "";

        if (!response.ok) {
            const body = contentType.includes("application/json")
                ? (await response.json()).error
                : `HTTP-Fehler ${response.status}`;
            throw new Error(body || `HTTP-Fehler ${response.status}`);
        }

        return await response.text();
    }

    htmlToText(html) {
        const withoutScripts = html
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/<style[\s\S]*?<\/style>/gi, "");

        const withBreaks = withoutScripts
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n");

        const doc = new DOMParser().parseFromString(withBreaks, "text/html");
        const rawText = doc.body ? doc.body.textContent : "";

        return rawText
            .replace(/\u00a0/g, " ")
            .split(/\r?\n/)
            .map(line => line.replace(/[ \t]+/g, " ").trim())
            .filter(Boolean)
            .join("\n");
    }
}