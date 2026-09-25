export class NameModel {
    constructor() {
        this.salutation = "";
        this.title = "";
        this.firstname = "";
        this.lastname = "";
    }

    get data() {
        return {
            salutation: this.salutation,
            title: this.title,
            firstname: this.firstname,
            lastname: this.lastname
        };
    }

    set data(raw) {
        if (!raw) return;

        // Abwärtskompatibilität: ältere/importierte Datensätze liefern
        // den Namen als einzelnen String statt als Objekt.
        if (typeof raw === "string") {
            this.lastname = raw;
            return;
        }

        this.salutation = raw.salutation ?? this.salutation;
        this.title = raw.title ?? this.title;
        this.firstname = raw.firstname ?? this.firstname;
        this.lastname = raw.lastname ?? this.lastname;
    }

    // Vollständige Anzeige inkl. Anrede und Titel, z. B. "Herr Dr. Max Mustermann"
    get full() {
        return [this.salutation, this.title, this.firstname, this.lastname]
            .filter(Boolean)
            .join(" ");
    }
}
