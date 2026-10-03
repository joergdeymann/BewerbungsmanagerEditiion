import { ParserConstants } from "../../constants/ParserConstants.js";

export class MoneyExtractor {
    constructor(lines) {
        this.lines = lines;
        this.text = lines.join("\n");
    }

    extractMoney() {
        return {
            yearly: this.extractYearlyRange() || this.extractMonthlyAsYearly(),
            monthly: this.extractMonthlyRange(),
            gross: this.extractGross(),
            currency: this.extractCurrency(),
            holiday: this.extractKeywordAmount("Urlaubsgeld"),
            christmas: this.extractChristmas()
        };
    }

    extractCurrency() {
        if (/€|eur\b/i.test(this.text)) return "EUR";
        if (/\$|usd\b/i.test(this.text)) return "USD";
        return "";
    }

    extractGross() {
        if (/\bbrutto\b/i.test(this.text)) return true;
        if (/\bnetto\b/i.test(this.text)) return false;
        return null;
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