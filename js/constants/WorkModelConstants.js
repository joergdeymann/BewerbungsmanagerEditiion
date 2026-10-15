/**
 * Konstanten für das ArbeitsModel (WorkModel): Art der Anstellung, Arbeitszeit,
 * Arbeitstage (vor Ort / remote) und Hinweise. Alle Regeln der Erkennung stehen
 * hier, damit sie ohne Codeänderung an weiteren Beispielen erweitert werden können.
 */
export class WorkModelConstants {
    // ---------- Listen (Auswahl im Editor, Filter in der Übersicht) ----------

    /** Art der Anstellung (Mehrfachauswahl). */
    static TYPE = [
        "Vollzeit",
        "Teilzeit",
        "Werkstudent",
        "Praktikum",
        "Ausbildung",
        "Freelance / Honorarbasis"
    ];

    /** Arbeitszeit (Mehrfachauswahl). */
    static WORK_TIME = [
        "Gleitzeit",
        "Schichtarbeit",
        "Conti-Schicht",
        "Wechselschicht",
        "Frühschicht",
        "Spätschicht",
        "Nachtschicht",
        "Bereitschaftsdienst"
    ];

    /** Typen der Arbeitstage (Reihenfolge = Anzeige und Auswahl). */
    static WORK_DAY_TYPE = {
        ON_SITE: "Vor Ort",
        HYBRID: "Hybrid",
        HOME_OFFICE: "Homeoffice",
        REMOTE: "Remote"
    };

    static WORK_DAY_TYPES = Object.values(WorkModelConstants.WORK_DAY_TYPE);

    /** Standard: Arbeitstage pro Woche. */
    static DEFAULT_DAYS = 5;

    /** Obergrenze für Arbeitstage pro Woche. */
    static MAX_DAYS = 7;

    // ---------- Hinweise (notes) ----------

    /** Ein Hinweis darf höchstens so viele Wörter haben. Kürzere sind besser (Richtwert). */
    static NOTE_MAX_WORDS = 20;
    static NOTE_TARGET_WORDS = 5;

    /** Mindestlänge eines Teilstücks, wenn ein zu langer Satz geteilt wird. */
    static NOTE_MIN_WORDS = 3;

    /** Höchstzahl der Hinweise je Stelle. */
    static NOTE_MAX_COUNT = 6;

    /** Zeilen nach "Arbeitsmodell: ..." die als Hinweistext gelten (höchstens). */
    static LABEL_BLOCK_LINES = 3;

    // ---------- Stichwörter (Kleinschreibung, ganze Zeile bzw. ganzes Wort) ----------

    static TYPE_KEYWORDS = {
        "Vollzeit": ["vollzeit", "full-time", "full time"],
        "Teilzeit": ["teilzeit", "part-time", "part time"],
        "Werkstudent": ["werkstudent", "werkstudentin"],
        "Praktikum": ["praktikum"],
        "Ausbildung": ["ausbildung"],
        "Freelance / Honorarbasis": ["freelance / honorarbasis"]
    };

    static WORK_TIME_KEYWORDS = {
        "Gleitzeit": ["gleitzeit", "gleitende arbeitszeit"],
        "Schichtarbeit": ["schichtarbeit", "schichtdienst"],
        "Conti-Schicht": ["conti-schicht", "conti schicht", "konti-schicht", "kontischicht"],
        "Wechselschicht": ["wechselschicht"],
        "Frühschicht": ["frühschicht", "fruehschicht"],
        "Spätschicht": ["spätschicht", "spaetschicht"],
        "Nachtschicht": ["nachtschicht"],
        "Bereitschaftsdienst": ["bereitschaftsdienst"]
    };

    static WORK_DAY_KEYWORDS = {
        "Vor Ort": ["vor ort", "onsite", "on-site", "on site"],
        "Hybrid": ["hybrid"],
        "Homeoffice": ["homeoffice", "home office", "home-office", "mobiles arbeiten"],
        "Remote": ["remote"]
    };

    /** Arbeitszeit wird nur in kurzen Zeilen gesucht (keine Fließtext-Aussagen). */
    static WORK_TIME_MAX_WORDS = 8;

    /** Verneinung in der Zeile: "keine Schichtarbeit", "ohne Bereitschaftsdienst". */
    static NEGATION_REGEX = /(?:^|[^\p{L}])(?:kein|keine|keinen|keiner|ohne|nicht)(?![\p{L}])/iu;

    // ---------- Zeilen und Sätze ----------

    /** Zeile "Arbeitsmodell: Hybrid" (z. B. LinkedIn-Info-Seite des Unternehmens). */
    static LABEL_REGEX = /^arbeitsmodell\s*:\s*(.*)$/iu;

    /** Zeile "Übliche Anwesenheit vor Ort" (Wert in derselben oder der nächsten Zeile). */
    static PRESENCE_LABEL_REGEX = /^übliche anwesenheit vor ort\s*:?\s*(.*)$/iu;

    static PRESENCE_LABEL = "Übliche Anwesenheit vor Ort";

    /** "3 Tage pro Woche", "2 days per week". */
    static DAYS_PER_WEEK_REGEX = /(\d{1,2})\s*(?:tage?|days?)\s*(?:pro|je|in der|per|a|each)\s*(?:woche|week)(?![\p{L}])/iu;

    /** Ohne Wochenangabe: "3 Tage". */
    static DAYS_REGEX = /(\d{1,2})\s*(?:tage?|days?)(?![\p{L}])/iu;

    /** Alle Tagesangaben eines Satzes (global, für matchAll). */
    static DAYS_ALL_REGEX = /(\d{1,2})\s*(?:tage?|days?)(?![\p{L}])/giu;

    /** Satz hat mit Arbeitsmodell zu tun (Voraussetzung für einen Hinweis). */
    static NOTE_KEYWORD_REGEX = /(?:^|[^\p{L}])(?:homeoffice|home[\s-]?office|remote|mobile[nrs]?\s+arbeit\w*|mobile\s+work|vor\s+ort|präsenz|presence|anwesenheit|büro|office|probezeit|probationary|hybrid|schicht\w*|shift\w*|on[\s-]?site)(?![\p{L}])/iu;

    /** Tage im Homeoffice (Satz mit Tagen pro Woche). */
    static HOME_REGEX = /(?:^|[^\p{L}])(?:homeoffice|home[\s-]?office|remote|mobile[nrs]?\s+arbeit\w*|mobile\s+work)(?![\p{L}])/iu;

    /** Tage vor Ort (Satz mit Tagen pro Woche). */
    static SITE_REGEX = /(?:^|[^\p{L}])(?:vor\s+ort|präsenz|on[\s-]?site|im\s+büro|in\s+the\s+office)(?![\p{L}])/iu;

    /** Satzende, gefolgt von einem neuen Satz. */
    static SENTENCE_SPLIT_REGEX = /(?<=[.!?])\s+(?=[\p{Lu}„"'(])/u;

    /** Trennstellen, an denen ein zu langer Satz geteilt werden darf. */
    static PART_SPLIT_REGEX = /;\s+|\s[–—-]\s|,\s+/u;

    /**
     * Liefert den Anzeigenamen zu einem Stichwort (z. B. "Home Office" -> "Homeoffice",
     * "Full-Time" -> "Vollzeit"). Leer, wenn das Stichwort nicht zum ArbeitsModel gehört.
     * @param {string} word Stichwort in beliebiger Schreibweise.
     * @returns {string} Name aus TYPE oder WORK_DAY_TYPES oder "".
     */
    static canonical(word) {
        const value = String(word ?? "").trim().toLowerCase();
        if (!value) return "";

        for (const keywords of [WorkModelConstants.TYPE_KEYWORDS, WorkModelConstants.WORK_DAY_KEYWORDS]) {
            for (const [label, list] of Object.entries(keywords)) {
                if (label.toLowerCase() === value || list.includes(value)) return label;
            }
        }

        return "";
    }
}
