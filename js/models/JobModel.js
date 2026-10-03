import { AddressModel } from "./AddressModel.js";
import { WageModel } from "./WageModel.js";

export class JobModel {
    constructor() {
        this.companyId = 0;
        this.contactId = 0;
        this.title = "";
        this.workLocation = new AddressModel();
        this.employmentType = "";
        this.workModel = [];
        this.wage = new WageModel();
        this.referenceNumber = "";
        this.tasks = [];
        this.tags = [];
    }

    get data() {
        return {
            companyId: this.companyId,
            contactId: this.contactId,
            title: this.title,
            workLocation: this.workLocation.data,
            employmentType: this.employmentType,
            workModel: this.workModel,
            wage: this.wage.data,
            referenceNumber: this.referenceNumber,
            tasks: this.tasks,
            tags: this.tags
        };
    }

    set data(raw) {
        if (!raw) return;
        this.companyId = raw.companyId ?? this.companyId;
        this.contactId = raw.contactId ?? this.contactId;
        this.title = raw.title ?? this.title;
        if (raw.workLocation) this.workLocation.data = raw.workLocation;
        this.employmentType = raw.employmentType ?? this.employmentType;
        this.workModel = raw.workModel ?? this.workModel;
        if (raw.wage) this.wage.data = raw.wage;
        this.referenceNumber = raw.referenceNumber ?? this.referenceNumber;
        this.tasks = raw.tasks ?? this.tasks;
        this.tags = raw.tags ?? this.tags;
    }
}