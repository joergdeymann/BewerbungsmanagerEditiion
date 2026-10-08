/**
 * Regeln fuer Standorte (Branches) eines Unternehmens.
 */
export class BranchConstants {
    // Zahlwoerter fuer Angaben wie "an drei Standorten".
    static NUMBER_WORDS = {
        zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7,
        acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12
    };

    // "drei Standorten", "5 Niederlassungen", "zwei weitere Filialen"
    static STATED_COUNT_REGEX = /\b(\d{1,3}|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf)\s+(?:weiteren\s+|deutschen\s+|internationalen\s+)?(?:standort|niederlassung|filiale)\w*/i;

    // Zeilen, nach denen eine Standortliste mit Adressen beginnt (LinkedIn-Info-Seite).
    static BLOCK_LABELS = ["orte", "standorte", "locations"];

    // Markierung des Hauptstandorts innerhalb der Liste.
    static PRIMARY_MARKERS = ["primär", "primary", "hauptstandort"];

    // Zeilen der Liste, die keinen Standort darstellen (Ueberschrift pro Land).
    static COUNTRY_LINES = new Set([
        "deutschland", "österreich", "schweiz", "germany", "austria", "switzerland"
    ]);

    // Schreibweise des Landes -> einheitlicher Name.
    static COUNTRY_NAMES = {
        deutschland: "Deutschland", germany: "Deutschland",
        österreich: "Österreich", austria: "Österreich",
        schweiz: "Schweiz", switzerland: "Schweiz"
    };

    // Zeilen mit einer Aufzaehlung der Orte ("📍Garbsen, Bissendorf, Berlin").
    static PIN_MARKERS = ["📍", "standorte:"];

    // Adresszeile: Komma-getrennt und mit Postleitzahl am Ende ("..., Deutschland 30823", "..., BE 10405").
    static ADDRESS_LINE_REGEX = /,.*\b\d{4,5}\s*$/;

    static MAX_ADDRESS_CHARS = 140;
    static MAX_NAME_WORDS = 6;
}
