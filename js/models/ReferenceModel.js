import { CapturedContentModel } from "./CapturedContentModel.js";

export class ReferenceModel extends CapturedContentModel {

    constructor() {
        super();
        this.name = "";
    }

    get data() {
        return {
            ...super.data,
            name: this.name
        };
    }

    set data(raw) {
        super.data = raw;
        if (!raw) return;
        this.name = raw.name ?? this.name;
    }
}