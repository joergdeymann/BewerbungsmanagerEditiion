export class StreetModel {
    constructor() {
        this.name = "";
        this.houseNumber = "";
    }

    get data() {
        return {
            name: this.name,
            houseNumber: this.houseNumber
        };
    }

    set data(raw) {
        if (!raw) return;
        this.name = raw.name ?? this.name;
        this.houseNumber = raw.houseNumber ?? this.houseNumber;
    }

    get text() {
        return `${this.name} ${this.houseNumber}`.trim();
    }
}
