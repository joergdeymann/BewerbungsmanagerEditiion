export class LocationConstants {

    // Signalwörter, die auf einen Ort ohne PLZ hindeuten
    static LOCATION_KEYWORDS_REGEX = /\b(standort|sitz|firmensitz|hauptsitz|niederlassung|filiale|arbeitsort|einsatzort)\b\s*:?\s*/i;

    // ein Ortsname direkt nach dem Signalwort, inkl. mehrteiliger Namen
    // ("Frankfurt am Main", "Rheine")
    static CITY_NAME_REGEX = /[\p{Lu}][\p{L}ß]*(?:\s(?:am|an|im|in|bei|der)\s[\p{Lu}][\p{L}ß]*|[\s-][\p{Lu}][\p{L}ß]*)*/u;

        // gängige Länderkürzel (Kfz-Kennzeichen-Format), wie sie vor PLZ in Adressen stehen
    static COUNTRY_CODES = new Set([
        'D', 'A', 'CH', 'F', 'I', 'NL', 'B', 'L', 'E', 'P', 'PL', 'CZ',
        'HU', 'DK', 'S', 'N', 'FIN', 'GB', 'IRL', 'GR', 'RO', 'BG',
        'HR', 'SK', 'SI', 'LT', 'LV', 'EST'
    ]);

    // optionales Länderkürzel + Bindestrich, dann PLZ (4-5 Ziffern, je nach Land), dann Ort
    static ZIP_CITY_REGEX = /\b(?:([A-Z]{1,3})-)?(\d{4,5})[\s,]+([\p{Lu}][\p{L}ß]*(?:[\s-][\p{Lu}][\p{L}]*)*)/gu;
    
    // Kopfzeile von Jobbörsen: "Ort, [Bundesland,] Land · ..." (ohne PLZ)
    static HEADER_LOCATION_REGEX = /^([\p{Lu}][\p{L}ß]*(?:[\s-][\p{Lu}][\p{L}ß]*)*)(?:\s*\([^)]*\))?,\s*(?:[\p{Lu}][\p{L}ß]*(?:[\s-][\p{Lu}][\p{L}ß]*)*,\s*)?(Deutschland|Österreich|Schweiz|Germany|Austria|Switzerland)\b/u;

    // Zeile besteht nur aus einer solchen Ortsangabe.
    static HEADER_LOCATION_ONLY_REGEX = new RegExp(LocationConstants.HEADER_LOCATION_REGEX.source + '\\s*$', 'u');

    static HEADER_COUNTRY_NAMES = { germany: 'Deutschland', austria: 'Österreich', switzerland: 'Schweiz' };

    static DEFAULT_COUNTRY = 'Deutschland';

    // Länderkürzel (Kfz-Kennzeichen-Format) -> ausgeschriebener Ländername
    static COUNTRY_NAMES = {
        D: 'Deutschland',
        A: 'Österreich',
        CH: 'Schweiz',
        F: 'Frankreich',
        I: 'Italien',
        NL: 'Niederlande',
        B: 'Belgien',
        L: 'Luxemburg',
        E: 'Spanien',
        P: 'Portugal',
        PL: 'Polen',
        CZ: 'Tschechien',
        HU: 'Ungarn',
        DK: 'Dänemark',
        S: 'Schweden',
        N: 'Norwegen',
        FIN: 'Finnland',
        GB: 'Vereinigtes Königreich',
        IRL: 'Irland',
        GR: 'Griechenland',
        RO: 'Rumänien',
        BG: 'Bulgarien',
        HR: 'Kroatien',
        SK: 'Slowakei',
        SI: 'Slowenien',
        LT: 'Litauen',
        LV: 'Lettland',
        EST: 'Estland'
    };

    // Liefert zu einem Länderkürzel den ausgeschriebenen Namen (Fallback: Default).
    static countryName(code) {
        if (!code) return LocationConstants.DEFAULT_COUNTRY;

        return LocationConstants.COUNTRY_NAMES[code.toUpperCase()]
            ?? LocationConstants.DEFAULT_COUNTRY;
    }

}
