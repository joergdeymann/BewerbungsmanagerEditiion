// server/CdpClient.js

/**
 * Kleiner Client fuer das Chrome DevTools Protocol (WebSocket). Benoetigt Node.js 22 oder neuer
 * (globales WebSocket).
 */
export class CdpClient {
    static CONNECT_TIMEOUT_MS = 5000;

    constructor(wsUrl) {
        this.wsUrl = wsUrl;
        this.ws = null;
        this.id = 0;
        this.pending = new Map();
        this.waiters = [];
    }

    /** Verbindet sich mit dem Ziel. Wirft einen Fehler, wenn das nicht innerhalb der Zeit gelingt. */
    async connect() {
        if (typeof WebSocket === "undefined") {
            throw new Error("Node.js 22 oder neuer wird benötigt (globales WebSocket fehlt).");
        }

        this.ws = new WebSocket(this.wsUrl);
        this.ws.onmessage = event => this.handleMessage(JSON.parse(event.data));
        this.ws.onclose = () => this.rejectAll(new Error("Verbindung zum Browser wurde beendet."));

        await new Promise((resolve, reject) => {
            const timeout = setTimeout(
                () => reject(new Error("CDP-Verbindung: Zeitüberschreitung.")), CdpClient.CONNECT_TIMEOUT_MS
            );
            this.ws.onopen = () => { clearTimeout(timeout); resolve(); };
            this.ws.onerror = () => {
                clearTimeout(timeout);
                reject(new Error("CDP-WebSocket konnte nicht geöffnet werden."));
            };
        });
    }

    handleMessage(message) {
        if (message.id && this.pending.has(message.id)) {
            const pending = this.pending.get(message.id);
            this.pending.delete(message.id);

            if (message.error) pending.reject(new Error(message.error.message));
            else pending.resolve(message.result);
            return;
        }

        if (!message.method) return;

        this.waiters = this.waiters.filter(waiter => {
            if (waiter.method !== message.method) return true;
            waiter.resolve(message.params);
            return false;
        });
    }

    rejectAll(error) {
        this.pending.forEach(pending => pending.reject(error));
        this.pending.clear();
        this.waiters.forEach(waiter => waiter.reject(error));
        this.waiters = [];
    }

    /** Sendet einen Befehl und liefert dessen Ergebnis. */
    send(method, params = {}) {
        const id = ++this.id;
        return new Promise((resolve, reject) => {
            this.pending.set(id, { resolve, reject });
            this.ws.send(JSON.stringify({ id, method, params }));
        });
    }

    /**
     * Wartet auf ein Ereignis (z. B. "Page.loadEventFired"). Vor dem ausloesenden Befehl aufrufen.
     * @param {string} method Name des Ereignisses.
     * @param {number} timeoutMs Wartezeit; danach wird der Fehler "timeout" geworfen.
     */
    once(method, timeoutMs) {
        return new Promise((resolve, reject) => {
            const waiter = { method, resolve: value => { clearTimeout(timer); resolve(value); }, reject };
            const timer = setTimeout(() => {
                this.waiters = this.waiters.filter(item => item !== waiter);
                reject(new Error("timeout"));
            }, timeoutMs);
            this.waiters.push(waiter);
        });
    }

    close() {
        try { this.ws?.close(); } catch { /* bereits geschlossen */ }
    }
}
