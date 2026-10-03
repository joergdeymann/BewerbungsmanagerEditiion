import { MoneyExtractor } from "./MoneyExtractor.js";

export class JobExtractor {
    constructor(lines) {
        this.lines = lines;
    }

    // JobExtractor.js
    extractJob() {
        return {
            wage: new MoneyExtractor(this.lines).extractMoney(),
            workModel: "",
            tasks: [],
            tags: [],
            title: "",
            referenceNumber: "",
            employmentType: "",
        }
    }
}