/**
 * Standorte (Branches) eines Unternehmens: Liste als Text und Anzahl.
 * Die Anzahl kann groesser sein als die Liste, wenn die Anzeige mehr Standorte nennt
 * ("an drei Standorten"), als Adressen angegeben sind.
 */
export class BranchModel {
    constructor() {
        this.locations = [];
        this.count = 0;
    }

    get data() {
        return {
            locations: [...this.locations],
            count: this.count
        };
    }

    set data(raw) {
        if (!raw) return;
        this.locations = Array.isArray(raw.locations) ? [...raw.locations] : this.locations;
        this.count = Number(raw.count) || 0;
    }
}
