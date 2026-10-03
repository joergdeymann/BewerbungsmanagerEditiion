export class CompanyConstants {
    static EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    static PHONE_REGEX = /\b\+?[0-9]{1,3}[ .-][0-9]{3}[ .-][0-9]{3}\b/gi;
    static COMPANY_TYPE_PATTERN = /\b(gmbh|ohg|kg|ag|ug|gbr|ltd|inc|ek)\b/i;
    static COMPANY_HEADER_REGEX = /\b(firmenname|fimenname|firma)\b\s*:?\s*(.*)$/i;
    static PHONE_PATTERN   = /(?:\+\d{1,3}[\s/-]?|\b0)[\d\s/()-]{5,}\d\b/;
    static PHONE_PATTERN_G = /(?:\+\d{1,3}[\s/-]?|\b0)[\d\s/()-]{5,}\d\b/g;
    static EMAIL_PATTERN   = /[\w.+-]+@[\w-]+\.[\w.-]+/;
    static EMAIL_PATTERN_G = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
    static NAME_TOKEN_REGEX = /^[\p{Lu}][\p{L}\p{N}.\-]*$/u;
    static NAME_CONNECTOR_WORDS = new Set(['und', 'der', 'die', 'das', 'von', '&']);
    static WORD_TOKEN_REGEX = /\p{L}[\p{L}-]{2,}/gu;
    static ARTICLE_WORDS = new Set(['ein', 'eine', 'einer', 'einem', 'einen']);
    static COMPANY_TYPE_KEYWORDS = ['unternehmen', 'firma', 'betrieb', 'konzern', 'gruppe', 'mittelstand'];

    static COMMON_WORDS = new Set([
        'und', 'der', 'die', 'das', 'wir', 'du', 'sie', 'ist', 'ein', 'eine',
        'mit', 'für', 'bei', 'als', 'auch', 'auf', 'dich', 'dir', 'uns', 'unser',
        'unsere', 'unseres', 'unserem', 'unseren', 'team', 'teams', 'job',
        'stelle', 'unternehmen', 'mitarbeitende', 'mitarbeiter', 'standort',
        'bewerbung', 'kontakt', 'fragen', 'jahre', 'wenn', 'dann', 'noch',
        'mehr', 'oder', 'aber', 'werden', 'werde', 'kannst', 'kann', 'hast',
        'haben', 'verfügst', 'vertraut', 'inklusive', 'sowie', 'innen'
    ]);

    // Labelzeilen der Firmeninfo (zweizeilig: Label -> Wert in der Folgezeile).
    static COMPANY_INFO_LABELS = {
        website: ['website', 'webseite', 'web-adresse'],
        verifiedAt: ['verifizierte seite', 'verifiziert am', 'verifiziert'],
        industry: ['branche', 'branchen'],
        size: ['größe', 'groesse', 'unternehmensgröße', 'beschäftigte', 'mitarbeiter', 'mitarbeitende'],
        founded: ['gegründet', 'gegruendet', 'gründungsjahr', 'gruendungsjahr', 'gründung'],
        specialties: ['spezialgebiete', 'spezialgebiet', 'spezialisierungen', 'spezialisierung'],
        legalForm: ['rechtsform']
    };

    static ALL_INFO_LABELS = Object.values(CompanyConstants.COMPANY_INFO_LABELS).flat();

    // Zeilen, die in der Firmenbeschreibung keinen Fließtext darstellen.
    static COMPANY_INFO_IGNORE = new Set([
        'start', 'info', 'beiträge', 'jobs', 'was wir machen',
        'personen', 'übersicht', 'commitment'
    ]);

    // Rechtsform-Suffix -> Schlüssel aus LegalFormConstants.FORM (Reihenfolge = Priorität).
    static LEGAL_FORM_PATTERNS = [
        { pattern: /\bgmbh\s*&\s*co\.?\s*kg\b/i, form: 'GMBH_CO_KG' },
        { pattern: /\bgmbh\b/i, form: 'GMBH' },
        { pattern: /\bpartg\b/i, form: 'PARTG' },
        { pattern: /\bkgaa\b/i, form: 'KGAA' },
        { pattern: /\bohg\b/i, form: 'OHG' },
        { pattern: /\bgbr\b/i, form: 'GBR' },
        { pattern: /\bkg\b/i, form: 'KG' },
        { pattern: /\bug\b/i, form: 'UG' },
        { pattern: /\bag\b/i, form: 'AG' },
        { pattern: /\bse\b/i, form: 'SE' },
        { pattern: /\beg\b/i, form: 'EG' }
    ];

    // Erkennt eine Labelzeile und liefert einen ggf. inline enthaltenen Wert ("Branche: IT").
    static matchInfoLabel(line, labels) {
        const text = (line ?? '').trim();
        const lower = text.toLowerCase();

        for (const label of labels) {
            if (lower === label) return { value: '' };
            if (lower.startsWith(`${label}:`)) return { value: text.slice(label.length + 1).trim() };
        }

        return null;
    }

    static isInfoLabelLine(line) {
        return CompanyConstants.matchInfoLabel(line, CompanyConstants.ALL_INFO_LABELS) !== null;
    }

    static matchLegalForm(text) {
        if (!text) return '';

        for (const entry of CompanyConstants.LEGAL_FORM_PATTERNS) {
            if (entry.pattern.test(text)) return entry.form;
        }

        return '';
    }
}
