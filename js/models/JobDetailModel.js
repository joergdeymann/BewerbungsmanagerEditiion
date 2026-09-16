export class JobDetailModel {
    constructor() {
        this.companyId = 0;
        this.contactId = 0;
        this.title = "";
        this.workLocation = "";
        this.employmentType = "";
        this.workModel = "";
        this.salary = "";
        this.vacationPay = "";
        this.christmasPay = "";
        this.referenceNumber = "";
        this.tasks = [];
        this.tags = [];
    }

    get data() {
        return {
            companyId: this.companyId,
            contactId: this.contactId,
            title: this.title,
            workLocation: this.workLocation,
            employmentType: this.employmentType,
            workModel: this.workModel,
            salary: this.salary,
            vacationPay: this.vacationPay,
            christmasPay: this.christmasPay,
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
        this.workLocation = raw.workLocation ?? this.workLocation;
        this.employmentType = raw.employmentType ?? this.employmentType;
        this.workModel = raw.workModel ?? this.workModel;
        this.salary = raw.salary ?? this.salary;
        this.vacationPay = raw.vacationPay ?? this.vacationPay;
        this.christmasPay = raw.christmasPay ?? this.christmasPay;
        this.referenceNumber = raw.referenceNumber ?? this.referenceNumber;
        this.tasks = raw.tasks ?? this.tasks;
        this.tags = raw.tags ?? this.tags;
    }
}
