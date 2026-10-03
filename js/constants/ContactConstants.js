export class ContactConstants {

    // Anrede (inkl. Dativ "Herrn") direkt vor einem Personennamen.
    // Maximal Vor- + Nachname, damit kein Satzanfang mit erfasst wird.
    static SALUTATION_NAME_REGEX = /\b(Herr|Frau)(?:n)?\.?\s+([A-ZÄÖÜ][\p{L}-]+(?:\s+[A-ZÄÖÜ][\p{L}-]+)?)/u;

    // Anrede-Normalisierung (Dativ -> Nominativ).
    static SALUTATION_MAP = {
        herr: "Herr",
        frau: "Frau"
    };

    // Eine Rollen-/Positionszeile ist kurz und enthält weder Ziffern noch URL/Rechtsform.
    static ROLE_MAX_LENGTH = 60;

    static LEGAL_FORM_HINT = /\b(gmbh|ohg|kg|ag|ug|gbr|ltd|inc|e\.?\s?v\.?)\b/i;
}
