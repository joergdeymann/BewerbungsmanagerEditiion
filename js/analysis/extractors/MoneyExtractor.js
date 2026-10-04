import { ParserConstants } from "../../constants/ParserConstants.js";

export class MoneyExtractor {
    constructor(lines) {
        this.lines = lines;
        this.text = lines.join("\n");
    }

    extractMoney() {
        const holiday = this.extractHoliday();

        return {
            yearly: this.extractYearlyRange() || this.extractMonthlyAsYearly(),
            monthly: this.extractMonthlyRange(),
            gross: this.extractGross(),
            currency: this.extractCurrency(),
            holiday: holiday.amount,
            christmas: this.extractChristmas(),
            holidayText: holiday.text,
            holidayFraction: holiday.fraction
        };
    }

    extractCurrency() {
        if (/€|eur\b/i.test(this.text)) return "EUR";
        if (/\$|usd\b/i.test(this.text)) return "USD";
        return "";
    }

    extractGross() {
        if (/\bnetto\b/i.test(this.text)) return false;

        // Ohne Angabe gilt in Stellenanzeigen die Brutto-Angabe.
        return true;
    }

    /**
     * Urlaubsgeld: erst ein genannter Betrag, sonst ein Anteil des Gehalts
     * ("mit einem halben Gehalt Urlaubsgeld im Gepäck"). Liefert Betrag, den
     * Originaltext und den erkannten Anteil.
     * @returns {{amount: number|null, text: string, fraction: number|null}} Ergebnis.
     */
    extractHoliday() {
        const amount = this.extractKeywordAmount("Urlaubsgeld");
        if (amount !== null) {
            return { amount, text: this.findHolidayLine(), fraction: null };
        }

        const fraction = this.extractFractionFactor();
        const matched = this.matchedFractionLine();
        if (!matched) return { amount: null, text: "", fraction: null };

        const base = this.monthlyBase();

        return {
            amount: base ? Math.round(base * fraction) : null,
            text: matched.trim(),
            fraction
        };
    }

    /**
     * Liefert die Zeile, in der das Urlaubsgeld genannt wird.
     * @returns {string} Originaltext oder "".
     */
    findHolidayLine() {
        const line = this.lines.find(entry => /urlaubsgeld/iu.test(entry));

        return line ? line.trim() : "";
    }

    /**
     * Liefert die Zeile, die einen Gehaltsanteil nennt.
     * @returns {string} Zeile oder "".
     */
    matchedFractionLine() {
        const patterns = ParserConstants.MONEY_FRACTIONS["Urlaubsgeld"] ?? [];

        return this.lines.find(line =>
            patterns.some(pattern => new RegExp(pattern, "iu").test(line))
        ) ?? "";
    }

    /**
     * Ermittelt den Anteil aus dem erkannten Text (halbes, drittel Gehalt ...).
     * @returns {number} Anteil als Zahl (0.5, 1/3, 2/3).
     */
    extractFractionFactor() {
        for (const entry of ParserConstants.MONEY_FRACTION_VALUES) {
            if (new RegExp(entry.pattern.source, entry.pattern.flags).test(this.text)) {
                return entry.factor;
            }
        }

        return 0.5;
    }

    /**
     * Liefert das Monatsgehalt; ohne Monatsangabe den Mindest-Jahresbetrag / 12.
     * @returns {number} Basisbetrag in Euro oder 0.
     */
    monthlyBase() {
        const monthly = this.extractMonthlyRange();
        if (monthly) return monthly.min;

        const yearly = this.extractYearlyRange();

        return yearly ? yearly.min / 12 : 0;
    }

    toNumber(value) {
        const isThousand = /k$/i.test(value.trim());
        const cleaned = value.replace(/k$/i, "").trim().replace(/\./g, "").replace(",", ".");
        const number = parseFloat(cleaned);
        if (Number.isNaN(number)) return null;
        return isThousand ? Math.round(number * 1000) : number;
    }

    extractYearlyRange() {
        const regex = /(\d{1,3}(?:[.,]\d{1,3})?\s*k?)\s*€?\s*\/?\s*(?:yr|jahr|jährlich)\b.{0,15}-\s*(\d{1,3}(?:[.,]\d{1,3})?\s*k?)\s*€?\s*\/?\s*(?:yr|jahr|jährlich)?/i;
        const match = regex.exec(this.text);
        if (!match) return null;
        const min = this.toNumber(match[1]);
        const max = this.toNumber(match[2]);
        return (min === null || max === null) ? null : { min, max };
    }

    extractMonthlyRange() {
        const rangeRegex = /(\d{1,3}(?:[.,]\d{3})*)\s*€?\s*\/?\s*(?:monat|mtl\.?|monatlich)\b.{0,15}-\s*(\d{1,3}(?:[.,]\d{3})*)\s*€?\s*\/?\s*(?:monat|mtl\.?|monatlich)?/i;
        const rangeMatch = rangeRegex.exec(this.text);
        if (rangeMatch) {
            const min = this.toNumber(rangeMatch[1]);
            const max = this.toNumber(rangeMatch[2]);
            if (min !== null && max !== null) return { min, max };
        }
        const singleRegex = /(\d{1,3}(?:[.,]\d{3})*)\s*€?\s*\/?\s*(?:monat|mtl\.?|monatlich)\b/i;
        const single = singleRegex.exec(this.text);
        if (!single) return null;
        const value = this.toNumber(single[1]);
        return value === null ? null : { min: value, max: value };
    }

    extractMonthlyAsYearly() {
        const monthly = this.extractMonthlyRange();
        return monthly ? { min: monthly.min * 12, max: monthly.max * 12 } : null;
    }

    extractKeywordAmount(key) {
        const patterns = ParserConstants.MONEY[key] || [];
        for (const pattern of patterns) {
            const regex = new RegExp(pattern, "i");
            const match = regex.exec(this.text);
            const raw = match?.[1];
            if (raw && /^\d[\d.,]*$/.test(raw.trim())) {
                const value = this.toNumber(raw);
                if (value !== null) return value;
            }
        }
        return null;
    }

    extractChristmas() {
        const amount = this.extractKeywordAmount("Weihnachtsgeld");
        if (amount !== null) return amount;

        const monthly = this.extractMonthlyRange();
        if (!monthly) return null;
        const average = (monthly.min + monthly.max) / 2;

        if (/13\.\s*(?:und|\+|\/)\s*14\.\s*(?:monats)?gehalt/i.test(this.text)) {
            return Math.round(average * 2);
        }
        if (/13\.\s*(?:monats)?gehalt/i.test(this.text)) {
            return Math.round(average);
        }
        return null;
    }
}