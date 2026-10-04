export class WageModel {
    constructor() {
        this.yearly = null;
        this.monthly = null;
        this.gross = true;
        this.currency = "";
        this.holiday = null;
        this.christmas = null;
        this.holidayText = "";
        this.holidayFraction = null;
    }

    get holidayIsFraction() {
        return this.holidayFraction !== null && this.holiday !== null;
    }

    get data() {
        return {
            yearly: this.yearly,
            monthly: this.monthly,
            gross: this.gross,
            currency: this.currency,
            holiday: this.holiday,
            christmas: this.christmas,
            holidayText: this.holidayText,
            holidayFraction: this.holidayFraction
        };
    }

    set data(raw) {
        if (!raw) return;
        this.yearly = raw.yearly ?? this.yearly;
        this.monthly = raw.monthly ?? this.monthly;
        this.gross = raw.gross ?? this.gross;
        this.currency = raw.currency ?? this.currency;
        this.holiday = raw.holiday ?? this.holiday;
        this.christmas = raw.christmas ?? this.christmas;
        this.holidayText = raw.holidayText ?? this.holidayText;
        this.holidayFraction = raw.holidayFraction ?? this.holidayFraction;
    }

    /**
     * Baut den Hinweistext zum Urlaubsgeld. Wird der Betrag aus einem Anteil des
     * Gehalts berechnet ("halber Monatsgehalt"), ist der angezeigte Wert das
     * Minimum - abhaengig davon, ob das Gehalt eine Spanne ist.
     * @returns {string} Hinweistext oder "".
     */
    get holidayNote() {
        if (!this.holidayIsFraction || this.holiday === null) return "";

        const factor = this.holidayFractionText();
        const yearly = this.yearly;
        const isRange = yearly && yearly.min !== yearly.max;

        return `Das Urlaubsgeld ist ${factor}. Der angezeigte Betrag ist das `
            + `Minimum auf Basis ${isRange ? "des Mindestwerts der Gehaltsspanne" : "des Monatsgehalts"}.`;
    }

    /**
     * Formuliert den erkannten Anteil lesbar (z. B. "ein halber Monatsgehalt").
     * @returns {string} Anteilsbeschreibung.
     */
    holidayFractionText() {
        if (!this.monthly && !this.yearly) return "ein Gehaltsanteil";
        if (this.holidayFraction === 1 / 3) return "ein Drittel des Monatsgehalts";
        if (this.holidayFraction === 2 / 3) return "zwei Drittel des Monatsgehalts";

        return "ein halber Monatsgehalt";
    }
}