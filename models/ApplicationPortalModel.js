export class ApplicationPortalModel {
    constructor() {
        this.date = "";
        this.portalName = "";
        this.website = "";
        this.username = "";
        // Nur der verschlüsselte Wert wird hier gehalten, die Ver-/Entschlüsselung erfolgt außerhalb des Models.
        this.password = "";
        this.information = "";
    }

    get data() {
        return {
            date: this.date,
            portalName: this.portalName,
            website: this.website,
            username: this.username,
            password: this.password,
            information: this.information
        };
    }

    set data(raw) {
        if (!raw) return;
        this.date = raw.date ?? this.date;
        this.portalName = raw.portalName ?? this.portalName;
        this.website = raw.website ?? this.website;
        this.username = raw.username ?? this.username;
        this.password = raw.password ?? this.password;
        this.information = raw.information ?? this.information;
    }
}
