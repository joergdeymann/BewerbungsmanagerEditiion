/**
 * Konstanten fuer den Abruf von Seiten ueber einen echten Chrome (Remote-Debugging).
 * Von Server und Client genutzt. Anmeldeseiten wie LinkedIn lassen sich nicht per einfachem
 * Abruf lesen; ein eigenes Chrome mit festem Profil behaelt die Anmeldung des Benutzers.
 */
export class BrowserConstants {
    /** Route des lokalen Servers. */
    static API_PATH = "/api/browser-fetch";
    static STATUS_PATH = "/api/browser-status";

    /** Adressen, die ueber den Browser geladen werden (auch die Route des Servers akzeptiert nur diese). */
    static HOST_REGEX = /(^|\.)linkedin\.com$/i;

    /** Port der Chrome-Fernsteuerung (nur 127.0.0.1) und Ordner des Profils im Projekt. */
    static CDP_PORT = 9222;
    static PROFILE_DIR = ".chrome-profile";

    /** Wartezeiten in Millisekunden. */
    static START_TIMEOUT_MS = 20000;
    static PAGE_TIMEOUT_MS = 30000;
    static SETTLE_MAX_MS = 12000;
    static SETTLE_STEP_MS = 700;
    static SCROLL_WAIT_MS = 1000;
    static LOGIN_TIMEOUT_MS = 180000;
    static LOGIN_POLL_MS = 2000;

    /** Ein vom Server gestarteter Chrome wird nach dieser Zeit ohne weiteren Abruf wieder beendet. */
    static IDLE_CLOSE_MS = 20000;

    /** Der Client weist nach dieser Zeit darauf hin, dass im Chrome-Fenster eine Anmeldung noetig sein kann. */
    static WAIT_HINT_MS = 6000;
    static HINT_DURATION_MS = 20000;

    /** Seite gilt als aufgebaut, wenn der Text laenger ist und sich nicht mehr aendert. */
    static MIN_TEXT_CHARS = 300;

    /** Beschriftungen, die automatisch geklickt werden (Kleinschreibung, ohne Auslassungspunkte). */
    static COOKIE_ACCEPT_LABELS = [
        "alle akzeptieren", "alle cookies akzeptieren", "akzeptieren", "alle zulassen",
        "zustimmen", "einverstanden", "accept all", "accept all cookies", "accept", "allow all"
    ];

    static EXPAND_LABELS = [
        "mehr", "mehr anzeigen", "mehr lesen", "weiterlesen", "weiter lesen",
        "alle anzeigen", "alles anzeigen", "ganzen text anzeigen",
        "show more", "see more", "read more", "view more"
    ];
}
