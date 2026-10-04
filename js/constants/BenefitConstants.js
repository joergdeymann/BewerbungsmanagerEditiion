/**
 * Zentrale Quelle fuer Benefit-Rubriken.
 *
 * Jede Rubrik gruppiert die Suchbegriffe (tags), die in Stellenanzeigen vorkommen
 * koennen, und traegt die Anzeige-Farbe. Die Begriffe stehen bereits in der
 * Schreibweise, in der sie spaeter im Model und in der Anzeige erscheinen;
 * gesucht wird case-insensitiv.
 */
export class BenefitConstants {

    static BENEFIT_TAGS = [
        {
            label: "Vergütung",
            color: "gold",
            tags: [
                "13. Gehalt",
                "Weihnachtsgeld",
                "Urlaubsgeld",
                "Sonderzahlung",
                "Erfolgsbeteiligung",
                "Bonus",
                "Leistungsprämie",
                "Provision",
                "Vermögenswirksame Leistungen"
            ]
        },
        {
            label: "Mobilität",
            color: "blue",
            tags: [
                "JobRad",
                "Fahrradleasing",
                "Bikeleasing",
                "Dienstrad",
                "Firmenwagen",
                "Dienstwagen",
                "Fahrkostenzuschuss",
                "Fahrtkostenzuschuss",
                "Tankgutschein",
                "Deutschlandticket",
                "Jobticket",
                "Zuschuss zum Deutschlandticket"
            ]
        },
        {
            label: "Arbeitszeit & Arbeitsort",
            color: "teal",
            tags: [
                "Flexible Arbeitszeiten",
                "Gleitzeit",
                "Teilzeit",
                "Homeoffice",
                "Home Office",
                "Mobiles Arbeiten",
                "Mobile Arbeit",
                "Hybrides Arbeiten",
                "Hybride Arbeit",
                "Remote Work",
                "Remote",
                "Workation",
                "4-Tage-Woche",
                "Vier-Tage-Woche"
            ]
        },
        {
            label: "Urlaub & Freizeit",
            color: "green",
            tags: [
                "30 Tage Urlaub",
                "30 Urlaubstage",
                "Zusätzlicher Urlaub",
                "Sonderurlaub",
                "Bezahlte Freistellung",
                "Urlaubskonto"
            ]
        },
        {
            label: "Altersvorsorge & Versicherungen",
            color: "violet",
            tags: [
                "Betriebliche Altersvorsorge",
                "Betriebliche Krankenversicherung",
                "Betriebliche Zusatzversicherung",
                "Betriebliche Unfallversicherung",
                "Unfallversicherung",
                "Krankenversicherung",
                "Altersvorsorge",
                "Rentenversicherung"
            ]
        },
        {
            label: "Gesundheit & Sport",
            color: "red",
            tags: [
                "Gesundheitsförderung",
                "Gesundheitsprogramm",
                "Gesundheitsmanagement",
                "Betriebsarzt",
                "Betriebliche Gesundheitsförderung",
                "Fitnessstudio",
                "Sportmitgliedschaft",
                "Sportangebote",
                "Fitnessangebote",
                "Fitnesszuschuss",
                "Gesundheitsbonus",
                "Wellpass",
                "Hansefit",
                "Fitness First"
            ]
        },
        {
            label: "Familie & Kinder",
            color: "pink",
            tags: [
                "KiTa-Zuschuss",
                "Kinderbetreuungszuschuss",
                "Kindergarten-Zuschuss",
                "Kinderbetreuung",
                "Familienfreundlich",
                "Elternzeit",
                "Zusätzliche Elternzeit"
            ]
        },
        {
            label: "Essen & Verpflegung",
            color: "orange",
            tags: [
                "Essensgeldzuschuss",
                "Essenszuschuss",
                "Mittagessen",
                "Kantine",
                "Betriebskantine",
                "Restaurantgutscheine",
                "Essensgutscheine",
                "Getränke kostenlos",
                "Kostenlose Getränke",
                "Obstkorb",
                "Kostenloses Obst",
                "Einkaufsvergünstigungen"
            ]
        },
        {
            label: "Weiterbildung & Entwicklung",
            color: "cyan",
            tags: [
                "Weiterbildung",
                "Fortbildung",
                "Weiterbildungsbudget",
                "Bildungsurlaub",
                "Schulungen",
                "Seminare",
                "Zertifizierungen",
                "Entwicklungsmöglichkeiten",
                "Persönliche Entwicklung",
                "Berufliche Entwicklung",
                "Karrierechancen"
            ]
        },
        {
            label: "Arbeitsplatz & Ausstattung",
            color: "slate",
            tags: [
                "Diensthandy",
                "Firmenhandy",
                "Dienstlaptop",
                "Firmenlaptop",
                "Homeoffice-Ausstattung",
                "Arbeitsplatzausstattung",
                "Moderne Arbeitsplätze",
                "Moderner Arbeitsplatz"
            ]
        },
        {
            label: "Rabatte & Extras",
            color: "brown",
            tags: [
                "Mitarbeiterrabatt",
                "Personalrabatt",
                "Rabatte",
                "Corporate Benefits",
                "Mitarbeiterangebote",
                "Mitarbeitervergünstigungen",
                "Prämie",
                "Willkommensbonus",
                "Mitarbeiter werben Mitarbeiter",
                "Betriebliche Sozialleistungen",
                "Kostenlose Parkplätze",
                "Parkplatz",
                "Parkplätze",
                "Gute Verkehrsanbindung",
                "Öffentliche Verkehrsmittel",
                "Teamevents",
                "Firmenevents",
                "Sommerfest",
                "Weihnachtsfeier",
                "Flache Hierarchien",
                "DU-Kultur"
            ]
        }
    ];

    // Rubrik, wenn ein Tag keiner Rubrik zugeordnet ist.
    static DEFAULT_COLOR = "neutral";

    /**
     * Liefert die Rubrik zu einem Tag (case-insensitiv).
     * @param {string} tag Tag in der Anzeige-Schreibweise.
     * @returns {object|null} Rubrik oder null.
     */
    static rubricFor(tag) {
        const value = (tag ?? "").trim().toLowerCase();

        return BenefitConstants.BENEFIT_TAGS
            .find(rubric => rubric.tags.some(entry => entry.toLowerCase() === value)) ?? null;
    }

    /**
     * Liefert die Anzeige-Farbe zu einem Tag. Unbekannte Tags bekommen die
     * Standardfarbe.
     * @param {string} tag Tag in der Anzeige-Schreibweise.
     * @returns {string} Farbname aus BENEFIT_TAGS.
     */
    static colorFor(tag) {
        return BenefitConstants.rubricFor(tag)?.color ?? BenefitConstants.DEFAULT_COLOR;
    }
}
