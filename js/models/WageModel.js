export class WageModel {
    constructor() {
        this.yearly = null;
        this.monthly = null;
        this.gross = null;
        this.currency = "";
        this.holiday = null;
        this.christmas = null;
    }

    get data() {
        return {
            yearly: this.yearly,
            monthly: this.monthly,
            gross: this.gross,
            currency: this.currency,
            holiday: this.holiday,
            christmas: this.christmas
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
    }
}