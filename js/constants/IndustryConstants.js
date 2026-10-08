/**
 * Branchen und ihre Stichwoerter. Eine kurze Zeile, die eines der Stichwoerter enthaelt,
 * gilt als Branchenangabe (z. B. "IT-Dienstleistungen und IT-Beratung").
 * Schluessel englisch, label deutsch, keywords kleingeschrieben.
 */
export class IndustryConstants {
    static INDUSTRIES = [
        { key: "IT_SERVICES", label: "IT-Dienstleistungen und IT-Beratung", keywords: ["it-dienstleistung", "it-beratung", "it-service", "it services", "it consulting", "systemhaus", "it-outsourcing", "managed services"] },
        { key: "SOFTWARE", label: "Softwareentwicklung", keywords: ["softwareentwicklung", "software development", "softwarehaus", "software-entwicklung", "softwareunternehmen", "saas", "software"] },
        { key: "INTERNET", label: "Internet und Online-Dienste", keywords: ["internet", "online-dienst", "online-plattform", "webentwicklung", "webagentur", "digitalagentur"] },
        { key: "TELECOM", label: "Telekommunikation", keywords: ["telekommunikation", "telecommunications", "mobilfunk", "netzbetreiber"] },
        { key: "HARDWARE", label: "Hardware und Elektronik", keywords: ["hardware", "elektronik", "halbleiter", "semiconductor", "computer-hardware", "unterhaltungselektronik"] },
        { key: "AUTOMOTIVE", label: "Automobil und Fahrzeugbau", keywords: ["automobil", "automotive", "fahrzeugbau", "kfz", "zulieferer"] },
        { key: "MECHANICAL_ENGINEERING", label: "Maschinen- und Anlagenbau", keywords: ["maschinenbau", "anlagenbau", "maschinen- und anlagenbau", "werkzeugbau", "mechanical engineering"] },
        { key: "MANUFACTURING", label: "Industrie und Fertigung", keywords: ["fertigung", "produktion", "industrie", "manufacturing", "herstellung"] },
        { key: "ELECTRICAL", label: "Elektrotechnik", keywords: ["elektrotechnik", "elektroindustrie", "automatisierungstechnik", "energietechnik"] },
        { key: "AEROSPACE", label: "Luft- und Raumfahrt", keywords: ["luftfahrt", "raumfahrt", "aerospace", "aviation", "luft- und raumfahrt"] },
        { key: "ENGINEERING_SERVICES", label: "Ingenieurdienstleistungen", keywords: ["ingenieurdienstleistung", "engineering services", "technische dienstleistung", "ingenieurbüro", "engineering"] },
        { key: "CHEMICALS", label: "Chemie", keywords: ["chemie", "chemical", "kunststoff", "lacke"] },
        { key: "PHARMA", label: "Pharma und Biotechnologie", keywords: ["pharma", "biotechnologie", "biotech", "arzneimittel", "life science"] },
        { key: "MEDICAL_TECHNOLOGY", label: "Medizintechnik", keywords: ["medizintechnik", "medical device", "medizinprodukte", "medtech"] },
        { key: "HEALTHCARE", label: "Gesundheitswesen", keywords: ["gesundheitswesen", "krankenhaus", "klinik", "pflege", "healthcare", "gesundheitsdienstleistung", "arztpraxis"] },
        { key: "ENERGY", label: "Energie und Versorgung", keywords: ["energieversorgung", "energiewirtschaft", "erneuerbare energien", "stromversorger", "stadtwerke", "energie und versorgung", "solar", "windkraft", "utilities"] },
        { key: "CONSTRUCTION", label: "Bauwesen", keywords: ["baugewerbe", "bauwesen", "bauunternehmen", "hochbau", "tiefbau", "architektur", "construction"] },
        { key: "REAL_ESTATE", label: "Immobilien", keywords: ["immobilien", "real estate", "hausverwaltung", "wohnungswirtschaft"] },
        { key: "LOGISTICS", label: "Logistik und Transport", keywords: ["logistik", "transport", "spedition", "supply chain", "lagerhaltung", "paketdienst"] },
        { key: "RETAIL", label: "Einzelhandel", keywords: ["einzelhandel", "retail", "handel", "warenhaus"] },
        { key: "ECOMMERCE", label: "E-Commerce", keywords: ["e-commerce", "onlinehandel", "online-handel", "online shop", "onlineshop"] },
        { key: "WHOLESALE", label: "Großhandel", keywords: ["großhandel", "grosshandel", "wholesale", "import und export"] },
        { key: "FOOD", label: "Lebensmittel und Getränke", keywords: ["lebensmittel", "getränke", "food and beverage", "food & beverage", "nahrungsmittel", "gastronomie"] },
        { key: "CONSUMER_GOODS", label: "Konsumgüter", keywords: ["konsumgüter", "consumer goods", "gebrauchsgüter", "haushaltswaren"] },
        { key: "FASHION", label: "Mode und Textil", keywords: ["mode", "textil", "bekleidung", "fashion", "apparel"] },
        { key: "BANKING", label: "Banken und Finanzdienstleistungen", keywords: ["bank", "finanzdienstleistung", "finanzwesen", "financial services", "kreditinstitut", "fintech", "zahlungsverkehr"] },
        { key: "INSURANCE", label: "Versicherungen", keywords: ["versicherung", "insurance", "rückversicherung"] },
        { key: "CONSULTING", label: "Unternehmensberatung", keywords: ["unternehmensberatung", "management consulting", "managementberatung", "strategieberatung", "wirtschaftsprüfung", "steuerberatung"] },
        { key: "STAFFING", label: "Personaldienstleistungen", keywords: ["personaldienstleistung", "personalvermittlung", "zeitarbeit", "arbeitnehmerüberlassung", "recruiting", "staffing"] },
        { key: "MARKETING", label: "Marketing und Werbung", keywords: ["marketing", "werbung", "werbeagentur", "advertising", "public relations", "kommunikationsagentur"] },
        { key: "MEDIA", label: "Medien und Verlagswesen", keywords: ["medien", "verlag", "publishing", "rundfunk", "fernsehen", "journalismus", "film"] },
        { key: "EDUCATION", label: "Bildung und Forschung", keywords: ["bildung", "hochschule", "universität", "forschung", "education", "weiterbildung", "schule"] },
        { key: "PUBLIC_SECTOR", label: "Öffentlicher Dienst", keywords: ["öffentlicher dienst", "öffentliche verwaltung", "behörde", "government", "kommunalverwaltung"] },
        { key: "NONPROFIT", label: "Gemeinnützige Organisationen", keywords: ["gemeinnützig", "non-profit", "nonprofit", "stiftung", "verband", "soziale einrichtung"] },
        { key: "HOSPITALITY", label: "Tourismus und Hotellerie", keywords: ["tourismus", "hotellerie", "hospitality", "reisebüro", "reiseveranstalter", "freizeit"] },
        { key: "LEGAL", label: "Rechtsberatung", keywords: ["rechtsberatung", "rechtsanwalt", "kanzlei", "legal services"] },
        { key: "AGRICULTURE", label: "Land- und Forstwirtschaft", keywords: ["landwirtschaft", "forstwirtschaft", "agrar", "agriculture", "gartenbau"] },
        { key: "SECURITY", label: "Sicherheitsdienste", keywords: ["sicherheitsdienst", "sicherheitstechnik", "security services", "wachdienst", "cybersecurity", "cyber security"] },
        { key: "ENVIRONMENT", label: "Umwelt und Recycling", keywords: ["umwelt", "recycling", "entsorgung", "abfallwirtschaft", "umwelttechnik"] }
    ];

    /**
     * @param {string} text Zeile oder Begriff.
     * @returns {string} Schluessel der ersten passenden Branche oder "".
     */
    static match(text) {
        const lower = (text ?? "").toLowerCase();
        const entry = IndustryConstants.INDUSTRIES.find(item => item.keywords.some(word => lower.includes(word)));
        return entry ? entry.key : "";
    }

    /**
     * @param {string} key Schluessel einer Branche.
     * @returns {string} Deutsche Bezeichnung oder "".
     */
    static label(key) {
        return IndustryConstants.INDUSTRIES.find(item => item.key === key)?.label ?? "";
    }
}
