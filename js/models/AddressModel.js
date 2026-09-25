import { StreetModel } from "./StreetModel.js";
import { CityModel } from "./CityModel.js";

export class AddressModel {
    constructor() {
        this.street = new StreetModel();
        this.city = new CityModel();
        this.postBox = "";
    }

    // Flache Struktur, damit die Adresse unverändert aus den Importdaten übernommen werden kann.
    get data() {
        return {
            street: this.street.name,
            houseNumber: this.street.houseNumber,
            zipCountry: this.city.zipCountry,
            zip: this.city.zip,
            city: this.city.city,
            country: this.city.country,
            postBox: this.postBox
        };
    }

    set data(raw) {
        if (!raw) return;
        this.street.data = { name: raw.street, houseNumber: raw.houseNumber };
        this.city.data = raw;
        this.postBox = raw.postBox ?? this.postBox;
    }

    // Firmenname und Ansprechpartner stehen nicht in der Adresse selbst, sondern in den übergebenen Models.
    lines(company = null, contact = null) {
        const lines = [];

        if (company && company.name) lines.push(company.name);
        if (contact && contact.name?.full) lines.push(contact.name.full);

        const street = this.postBox ? `Postfach ${this.postBox}` : this.street.text;
        if (street) lines.push(street);

        const city = this.city.text;
        if (city) lines.push(city);
        if (this.city.country) lines.push(this.city.country);

        return lines;
    }

    text(company = null, contact = null) {
        return this.lines(company, contact).join("\n");
    }
}
