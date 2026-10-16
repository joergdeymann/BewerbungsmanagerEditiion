import { CapturedContentModel } from "./CapturedContentModel.js";

/**
 * Roher, importierter Textblock. Zusatzfeld gegenüber CapturedContentModel:
 * supplement = true bei Seiten der Firmen-Website (Firmenseite, Kontakt, Karriere, Impressum).
 * Sie werden getrennt von der Anzeige ausgewertet und füllen nur leere Felder oder ergänzen
 * Neues (AnalysisController.supplement), statt Werte der Anzeige zu überschreiben.
 */
export class ImportedTextModel extends CapturedContentModel {

    constructor() {
        super();
        this.supplement = false;
    }

    get data() {
        return { ...super.data, supplement: this.supplement };
    }

    set data(raw) {
        super.data = raw;
        if (!raw) return;
        this.supplement = raw.supplement ?? this.supplement;
    }
}
