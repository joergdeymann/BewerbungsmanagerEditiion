import { BrowserConstants } from "../../shared/BrowserConstants.js";

/**
 * Konstanten für den Import einer Stellenanzeige (Webadresse und Bookmarklet).
 */
export class ImportConstants {
    /** Nachrichtentyp: Bookmarklet -> App (enthält url und html). */
    static MESSAGE_TYPE = "bewerbungsmanager-import";

    /** Nachrichtentypen zum Finden eines schon offenen App-Fensters: Bookmarklet fragt (ping), die App antwortet (pong). */
    static MESSAGE_PING = "bewerbungsmanager-ping";
    static MESSAGE_PONG = "bewerbungsmanager-pong";

    /** Wartezeit auf die Antwort des Fensters, das die Seite geöffnet hat (window.opener). */
    static PING_WAIT_MS = 600;

    /**
     * Version des Lesezeichens. Ältere Lesezeichen (die gespeicherte Kopie in der Lesezeichen-Leiste
     * bleibt beim Aktualisieren der App unverändert) öffnen bei jedem Klick einen neuen Tab;
     * die App weist dann darauf hin, den Link neu zu ziehen.
     */
    static BOOKMARKLET_VERSION = 3;

    /** LinkedIn aus der App heraus öffnen: ein benannter Tab, der mit der App verbunden bleibt. */
    static LINKEDIN_URL = "https://www.linkedin.com/jobs/";
    static LINKEDIN_WINDOW_NAME = "bewerbungsmanager-linkedin";

    /** Nachrichtentyp: App -> Bookmarklet ("bereit für die Seite"). */
    static MESSAGE_READY = "bewerbungsmanager-import-ready";

    /** Name des App-Fensters: Das Bookmarklet nutzt ein schon geöffnetes Fenster mit diesem Namen weiter. */
    static WINDOW_NAME = "bewerbungsmanager-app";

    /** Firmenname (Gruppe 1) im Link der Stellenanzeige: linkedin.com/company/<firmenname>/... */
    static COMPANY_SLUG_REGEX = /linkedin\.com\/company\/([^/?#]+)/i;

    /** Die Info-Seite der Firma: <COMPANY_URL_BASE><firmenname><COMPANY_ABOUT_SUFFIX> mit Branche, Größe, Standorten. */
    static COMPANY_URL_BASE = "https://www.linkedin.com/company/";
    static COMPANY_ABOUT_SUFFIX = "/about/";

    /** Eine optionale Seite (Info-Seite der Firma) mit weniger Text gilt als leer und wird nicht übernommen. */
    static MIN_OPTIONAL_CHARS = 400;

    /** Info-Seite der Firma im Browser laden (unsichtbarer Rahmen, mit der Anmeldung des Benutzers): Wartezeit bis die Seite aufgebaut ist. */
    static FRAME_WAIT_MS = 3000;

    /** Längste Wartezeit auf den Rahmen, danach ruft die App die Seite über den Server ab. */
    static FRAME_TIMEOUT_MS = 15000;

    /** Woher ein Abruf stammt (für Meldungen und das Protokoll in der Konsole). */
    static SOURCE_LABELS = {
        dialog: "Eingabefenster Webadresse",
        bookmarklet: "Lesezeichen",
        fallback: "automatischer Abruf, weil vom Lesezeichen nichts ankam",
        company: "Info-Seite der Firma",
        website: "Firmenseite"
    };

    /**
     * Die drei Seitenarten eines Imports: Hauptseite (die Anzeige, wird zuerst gelesen),
     * Nebenseite (weitere LinkedIn-Seiten, z. B. die Info-Seite unter /about/) und
     * Firmenseite (die Website der Firma selbst). label = Anzeige im Kopfbereich,
     * busy = Beschriftung des Knopfes während des Abrufs, done = Meldung nach der Übernahme.
     */
    static PAGE = {
        main: {
            label: "Hauptseite",
            busy: "Wird abgerufen...",
            done: 'Seite abgerufen und übernommen (siehe "Übernommene Texte" unten).'
        },
        side: {
            label: "Nebenseite",
            busy: "Info-Seite der Firma wird abgerufen...",
            done: 'Info-Seite der Firma übernommen (zweiter Eintrag unter "Übernommene Texte").'
        },
        company: {
            label: "Firmenseite",
            busy: "Firmenseite wird abgerufen...",
            done: 'Firmenseite übernommen (weiterer Eintrag unter "Übernommene Texte").'
        }
    };

    /** Anzeige im Kopfbereich (rechts unten): Element und Dauer, die das Ergebnis stehen bleibt. */
    static STATUS_SELECTOR = "#importStatusBar";
    static STATUS_HIDE_MS = 3000;

    /** Jede Meldung der Anzeige bleibt mindestens so lange stehen (sonst sieht man schnelle Schritte nicht). */
    static STATUS_MIN_VISIBLE_MS = 600;

    /** Wartet die App auf die Info-Seite vom Lesezeichen: Zeitzugabe zur Wartezeit des Lesezeichens, dann Abbruch. */
    static SIDE_WAIT_EXTRA_MS = 5000;

    /** Wartezeit auf das Bookmarklet, danach wird die URL über den Server abgerufen. */
    static FALLBACK_DELAY_MS = 5000;

    /** Überschriften, über die der relevante Bereich der Anzeige gefunden wird. */
    static ANCHOR_PHRASES = ["Details zum Jobangebot"];

    /** Zweiter Anker: Geschlechtsangabe im Titel, z. B. (m/w/d), (w/m/x), (m|w|d). */
    static ANCHOR_GENDER_REGEX = /\(\s*[mwdfxi]\s*[\/|:]\s*[mwdfxi](?:\s*[\/|:]\s*[mwdfxi])?\s*\)/i;

    /** Überschriften sind kurz: Text des Elements höchstens so lang. */
    static HEADING_MAX_CHARS = 80;

    /** Überschriften in diesen Elementen sind Navigation oder Bedienung, keine Abschnitte der Anzeige. */
    static HEADING_EXCLUDE_SELECTOR = "a, button, label, nav, footer, [role='navigation'], [role='contentinfo']";

    /** Titel (h1 / "(m/w/d)") in Navigation oder Fußbereich zählen nicht. */
    static TITLE_EXCLUDE_SELECTOR = "nav, footer, [role='navigation'], [role='contentinfo']";

    /**
     * Der Bereich darf beim Erweitern um weitere Überschriften höchstens um diesen Faktor wachsen.
     * Schützt bei Seiten mit Trefferliste neben der Anzeige davor, dass die ganze Seite übernommen wird.
     */
    static GROWTH_LIMIT = 4;

    /**
     * Kopfbereich der Anzeige (Titel, Firma, Ort, Arbeitsmodell, Beschäftigungsart): Liegt er außerhalb des
     * erkannten Bereichs, wird er anhand des Titels aus den Zeilen vor dem Bereich nachgeholt.
     * HEADER_SCAN = Zeilen am Anfang des Bereichs, in denen ein Titel schon vorhanden sein darf,
     * HEADER_LOOKBACK = so viele Zeilen vor dem Bereich wird der Titel gesucht, HEADER_MAX_LINES = längster Kopfbereich.
     */
    static HEADER_SCAN = 12;
    static HEADER_LOOKBACK = 40;
    static HEADER_MAX_LINES = 14;

    /** Eine Titelzeile ist kurz. */
    static TITLE_LINE_MAX_CHARS = 100;

    /** Trennt im Seitentitel (<title>) den Stellentitel von Firma und Jobbörse: "Titel | Firma | LinkedIn". */
    static TITLE_SEPARATOR_REGEX = /\s[|–—-]\s/;

    /** Weiterleitungs-Links (z. B. LinkedIn "Bewerben"): der echte Link steckt im Parameter "url". */
    static REDIRECT_PATH_REGEX = /\/(?:safety\/go|redir\/redirect|away)\/?$/i;

    /** Ein übergeordnetes Element gilt als Anzeigenbereich, sobald es so viel Text enthält. */
    static MIN_CONTAINER_TEXT = 1500;

    /** Beschriftungen von "Mehr anzeigen"-Knöpfen (ohne Auslassungspunkte, klein geschrieben). */
    static EXPAND_LABELS = BrowserConstants.EXPAND_LABELS;

    /** Wartezeit nach dem Aufklappen, bis die Seite den vollen Text eingesetzt hat. */
    static EXPAND_WAIT_MS = 1000;

    /** Endet eine Zeile so, ist der Text gekürzt (…, ... und optional "mehr"). */
    static TRUNCATED_REGEX = /\s*(?:…|\.{3})\s*(?:mehr|more)?\s*$/i;

    /** Zeilen, die nur ein Aufklapp-Knopf sind und nicht zum Text gehören. */
    static EXPAND_LINE_REGEX = /^(?:…|\.{3})?\s*(?:mehr(?: anzeigen| lesen)?|weiterlesen|show more|see more|read more)\s*(?:…|\.{3})?$/i;

    /** Mindestlänge des Zeilenanfangs, mit dem eine gekürzte Zeile im Volltext gesucht wird. */
    static MIN_STEM = 25;

    /** Versteckte Elemente (LinkedIn legt seine Daten in <code style="display: none"> ab). Ohne Layout erkennbar. */
    static HIDDEN_SELECTOR = "[hidden], [style*='display:none'], [style*='display: none'], code[id^='bpr-guid'], code[id^='datalet']";

    /** Zeilen, die keine Anzeige sind: Daten (JSON) und interne Kennungen. */
    static JUNK_LINE_REGEX = /^\s*[{[]\s*"|^urn:li:|^bpr-guid/i;

    /** Elemente, die nie Teil der Anzeige sind. */
    static REMOVE_TAGS = ["script", "style", "noscript", "template", "svg", "iframe", "canvas"];

    /** Cookie-/Einwilligungs-Banner und Dialoge, die über der Seite liegen (werden vor der Bereichssuche entfernt). */
    static BANNER_SELECTOR = [
        "[id*='cookie' i]", "[class*='cookie' i]",
        "[id*='consent' i]", "[class*='consent' i]",
        "[id*='gdpr' i]", "[class*='gdpr' i]",
        "[id*='onetrust' i]", "[id^='usercentrics' i]",
        "[id*='global-alert' i]", "[class*='global-alert' i]",
        "[role='dialog']", "[aria-modal='true']"
    ].join(",");

    /** Banner sind kurz; längere Elemente sind Inhalt und werden nie entfernt. */
    static BANNER_MAX_TEXT = 4000;

    /** Zeilen, wie sie auf Cookie-Abfragen und Anmeldeseiten stehen. */
    static WALL_LINE_REGEX = /cookie|akzeptier|ablehnen|zustimm|einwillig|consent|datenschutz|privacy|anmelden|einloggen|sign in|log in|jetzt beitreten|join now|registrier|nutzungsbedingungen|user agreement|authwall/i;

    /** Besteht der Text zu mindestens diesem Anteil aus solchen Zeilen (oder ist er leer), ist es keine Inhaltsseite. */
    static WALL_SHARE = 0.4;

    /** Zusätzlich zur Info-Seite: die Firmenseite selbst (öffentliche Übersicht), falls die Info-Seite gesperrt ist. */
    static COMPANY_HOME_SUFFIX = "/";

    /** Beschriftungen, die das Bookmarklet automatisch bestätigt (gemeinsam mit dem Browser-Abruf des Servers). */
    static COOKIE_ACCEPT_LABELS = BrowserConstants.COOKIE_ACCEPT_LABELS;

    /** Trennzeichen zwischen Angaben in einer Zeile (z. B. "Osnabrück · Vor 2 Monaten · 20 Bewerber"). */
    static LINE_SEPARATOR_REGEX = /\s*[·•]\s*/;

    /** Reine Textauszeichnung ohne Zeilenumbruch. Alle anderen Tags (auch a, span) beginnen eine neue Zeile. */
    static INLINE_TAGS = new Set([
        "abbr", "b", "bdi", "bdo", "cite", "code", "em", "i", "kbd", "mark",
        "q", "s", "samp", "small", "strong", "sub", "sup", "u", "var", "wbr"
    ]);
}
