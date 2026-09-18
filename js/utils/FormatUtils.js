export class FormatUtils {
    static toGermanDate(date) {
        if (!date) return "";

        const parsed = new Date(date);

        return Number.isNaN(parsed.getTime())
            ? date
            : parsed.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
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