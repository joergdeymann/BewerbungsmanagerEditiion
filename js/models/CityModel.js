export class CityModel {
    constructor() {
        this.zipCountry = "";
        this.zip = "";
        this.city = "";
        this.country = "";
    }

    get data() {
        return {
            zipCountry: this.zipCountry,
            zip: this.zip,
            city: this.city,
            country: this.country
        };
    }

    set data(raw) {
        if (!raw) return;
        this.zipCountry = raw.zipCountry ?? this.zipCountry;
        this.zip = raw.zip ?? this.zip;
        this.city = raw.city ?? this.city;
        this.country = raw.country ?? this.country;
    }

    get text() {
        const zip = this.zipCountry ? `${this.zipCountry}-${this.zip}` : this.zip;
        return `${zip} ${this.city}`.trim();
    }
}
