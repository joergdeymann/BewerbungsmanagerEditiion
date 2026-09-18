export class JobConstants {

    static STATUS = {
        ENTWURF: "ENTWURF",
        BEWORBEN: "BEWORBEN",
        EINGANG: "EINGANG",
        RUECKRUF: "RUECKRUF",
        ANGENOMMEN: "ANGENOMMEN",
        ABGELEHNT: "ABGELEHNT"
    };

    static ART_OPTIONS = [
        "Hybrid",
        "Remote",
        "Vor Ort",
        "Teilzeit"
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
