export class FormatUtils {

    static GERMAN_MONTHS = [
        "januar", "februar", "märz", "april", "mai", "juni",
        "juli", "august", "september", "oktober", "november", "dezember"
    ];

    // Wandelt ein deutsches Datum ("15. Juni 2023" oder "15.06.2023") in ISO (YYYY-MM-DD).
    static parseGermanDate(text) {
        if (!text) return "";

        const value = String(text).trim();

        const numeric = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
        if (numeric) {
            return `${numeric[3]}-${numeric[2].padStart(2, "0")}-${numeric[1].padStart(2, "0")}`;
        }

        const written = value.match(/^(\d{1,2})\.?\s+([\p{L}]+)\s+(\d{4})$/u);
        if (written) {
            const month = FormatUtils.GERMAN_MONTHS.indexOf(written[2].toLowerCase());
            if (month !== -1) {
                return `${written[3]}-${String(month + 1).padStart(2, "0")}-${written[1].padStart(2, "0")}`;
            }
        }

        return "";
    }

    static toGermanDate(date) {
        if (!date) return "";

        const parsed = new Date(FormatUtils.parseGermanDate(date) || date);

        return Number.isNaN(parsed.getTime())
            ? date
            : parsed.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
    }

    static toGermanDateTime(date) {
        if (!date) return "";

        const parsed = new Date(date);

        return Number.isNaN(parsed.getTime())
            ? date
            : parsed.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
    }

    static formatCurrency(number) {
        if (!number) return "";
        return number.toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}