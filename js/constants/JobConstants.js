export class JobConstants {

    // Sektionen, in denen die Stellenbezeichnung stehen kann (Reihenfolge = Prioritaet).
    static TITLE_SECTIONS = ["companyInformation", "general", "team", "contact"];

    // Sektionen, in denen die Adresse des Arbeitsplatzes stehen kann.
    static ADDRESS_SECTIONS = ["contact", "general", "team", "companyInformation"];

    // Sektionen, die ohne Adress-Begriff als Kontakt-/Adressblock gelten.
    static CONTACT_ADDRESS_SECTIONS = ["team", "contact"];

    // Anzahl Zeilen nach dem Adress-Begriff, die als Adressblock gelten.
    static ADDRESS_MAX_LINES = 6;

    // Feinfilter fuer die Stellenbezeichnung: Laenge in Zeichen und Woertern.
    static TITLE_MIN_LENGTH = 3;
    static TITLE_MAX_LENGTH = 80;
    static TITLE_MAX_WORDS = 9;

    static STATUS = {
        ENTWURF: "ENTWURF",
        BEWORBEN: "BEWORBEN",
        EINGANG: "EINGANG",
        RUECKRUF: "RUECKRUF",
        ANGENOMMEN: "ANGENOMMEN",
        ABGELEHNT: "ABGELEHNT"
    };

    static WORK_MODEL = [
        "Vor Ort",
        "Hybrid",
        "Remote",
        "Homeoffice"
    ];

    static EMPLOYMENT_TYPE = [
        "Vollzeit",
        "Teilzeit",
        "Werkstudent",
        "Praktikum",
        "Ausbildung",
        "Freelance / Honorarbasis"
    ];

    static STATUS_CLASS = {
        ENTWURF: "status-draft",
        BEWORBEN: "status-applied",
        EINGANG: "status-confirmed",
        RUECKRUF: "status-callback",
        ANGENOMMEN: "status-accepted",
        ABGELEHNT: "status-rejected"
    };

    static STATUS_LABEL = {
        ENTWURF: "Nicht beworben",
        BEWORBEN: "Beworben",
        EINGANG: "Eingangsbestätigung",
        RUECKRUF: "Rückruf erhalten",
        ANGENOMMEN: "Angenommen",
        ABGELEHNT: "Abgelehnt"
    };

    static getClass(status) {
        return this.STATUS_CLASS[status] || this.STATUS_CLASS.ENTWURF;
    }
}
