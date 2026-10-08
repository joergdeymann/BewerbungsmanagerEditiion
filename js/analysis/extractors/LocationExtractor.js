import { LocationConstants } from "../../constants/LocationConstants.js";
export class LocationExtractor {
    constructor(lines) {
        this.lines = lines;
    }

    extractLocation() {
        return this.extractByZipCity() ?? this.extractByKeyword();
    }

    // Stufe 1: PLZ + Ort (härtestes, eindeutigstes Muster)
    extractByZipCity() {
        const regex = new RegExp(LocationConstants.ZIP_CITY_REGEX.source, LocationConstants.ZIP_CITY_REGEX.flags);

        for (const line of this.lines) {
            regex.lastIndex = 0;
            let match;
            while ((match = regex.exec(line)) !== null) {
                // Zahlenspannen wie "5001-10000 Mitarbeiter:innen" sind keine Adresse -
                // die zweite Zahl sieht sonst wie eine PLZ aus.
                const prefix = line.slice(0, match.index);
                if (/\d+\s*-\s*$/.test(prefix)) continue;

                const country = LocationConstants.countryName(match[1]);

                return { country: country, zip: match[2], city: match[3].trim() };
            }
        }
        return null;
    }

    // Nur fuer Kopfzeilen von Jobboersen ("Osnabrück, Niedersachsen, Deutschland · Vor 2 Monaten").
    // Wird nicht in extractLocation() verwendet, sondern gezielt vom Aufrufer.
    extractByHeaderLine() {
        for (const line of this.lines) {
            const match = line.trim().match(LocationConstants.HEADER_LOCATION_REGEX);
            if (!match) continue;

            const country = LocationConstants.HEADER_COUNTRY_NAMES[match[2].toLowerCase()] ?? match[2];
            return { country, zip: null, city: match[1] };
        }
        return null;
    }

    // Stufe 2: Fallback über Signalwörter, ohne PLZ
    extractByKeyword() {
        for (const line of this.lines) {
            const keywordMatch = line.match(LocationConstants.LOCATION_KEYWORDS_REGEX);
            if (!keywordMatch) continue;

            const rest = line.slice(keywordMatch.index + keywordMatch[0].length);
            const cityMatch = rest.match(LocationConstants.CITY_NAME_REGEX);
            if (cityMatch) {
                return { country:LocationConstants.DEFAULT_COUNTRY,zip: null, city: cityMatch[0].trim() };
            }
        }
        return null;
    }
    

}