export class ContactConstants {

    // Anrede (inkl. Dativ "Herrn") mit dem Rest der Zeile als Namens-/Datenteil.
    static SALUTATION_START_REGEX = /\b(Herr|Frau)(?:n)?\.?\s+(.+)$/u;

    // Akademische Titel, die zwischen Anrede und Namen stehen können.
    static TITLE_REGEX = /^(?:Prof\.?\s*Dr\.?|Prof\.?|Dr\.?(?:\s*med\.?)?|Dipl\.-[\p{L}-]+|Dipl\.?|Ing\.?|MBA|M\.Sc\.?|B\.Sc\.?|lic\.?)$/u;

    // Ein Namensbestandteil: großgeschriebenes Wort mit optionalem Bindestrich/Punkt.
    static NAME_TOKEN_REGEX = /^[\p{Lu}][\p{L}\p{N}'’-]*$/u;

    // Harte Obergrenze fuer die Suche nach dem Namen (verhindert, dass der
    // Kontaktblock den gesamten restlichen Text einsammelt).
    static CONTACT_BLOCK_SIZE = 25;

    // Anzahl Zeilen, die nach einer Leerzeile noch zum Kontaktblock gezaehlt
    // werden (Anzeigen trennen Kontaktbloecke haeufig mit Leerzeilen).
    static CONTACT_TAIL_SIZE = 4;

    // Zeilen, die den Kontaktblock sicher beenden (Abschnittsueberschriften,
    // Firmenprofil, Bewerbungsablauf).
    static CONTACT_BLOCK_STOP_REGEX = /^(?:über uns|ueber uns|ihre vorteile|vorteile|warum wir|wer wir sind|bewerbung|bewerbungsformular|so bewerben|ihr ansprechpartner|ansprechpartner:?|kontakt:?|im detail|fazit|aufgaben|anforderungen|qualifikationen|benefits|über euch|euer team)\b/iu;

    // Beschriftungen, die eine Kontaktzeile eindeutig machen. Zugehoerige Werte
    // werden bevorzugt, wenn eine E-Mail oder Telefonnummer mehrfach vorkommt.
    static CONTACT_LABEL_REGEX = /(?:e-?mail|mail|telefon|tel\.?|mobil|phone|fax|kontakt|durchwahl)/iu;

    // Anrede-Normalisierung (Dativ -> Nominativ).
    static SALUTATION_MAP = {
        herr: "Herr",
        frau: "Frau"
    };

    // Eine Rollen-/Positionszeile ist kurz und enthält weder Ziffern noch URL/Rechtsform.
    static ROLE_MAX_LENGTH = 60;

    static LEGAL_FORM_HINT = /\b(gmbh|ohg|kg|ag|ug|gbr|ltd|inc|e\.?\s?v\.?)\b/i;
}
