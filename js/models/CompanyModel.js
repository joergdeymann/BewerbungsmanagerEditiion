import { AddressModel } from "./AddressModel.js";
import { BranchModel } from "./BranchModel.js";

export class CompanyModel {
    constructor() {
        this.id = 0;
        this.name = "";
        this.legalForm = "";
        this.ownership = "";
        this.relationship = "Hauptsitz";
        this.industry = "";
        this.size = "";
        this.founded = "";
        this.website = "";
        this.email = "";
        this.phone = "";
        this.address = new AddressModel();
        this.branches = new BranchModel();
        this.verifiedAt = "";
        this.description = "";
        this.specialties = [];
        this.images = [];
        this.mainImageIndex = 0;
    }

    get data() {
        return {
            id: this.id,
            name: this.name,
            legalForm: this.legalForm,
            ownership: this.ownership,
            relationship: this.relationship,
            address: this.address.data,
            branches: this.branches.data,
            website: this.website,
            email: this.email,
            phone: this.phone,
            verifiedAt: this.verifiedAt,
            industry: this.industry,
            size: this.size,
            founded: this.founded,
            description: this.description,
            specialties: this.specialties,
            images: this.images,
            mainImageIndex: this.mainImageIndex
        };
    }

    set data(raw) {
        if (!raw) return;
        this.id = raw.id ?? this.id;
        this.name = raw.name ?? this.name;
        this.legalForm = raw.legalForm ?? this.legalForm;
        this.ownership = raw.ownership ?? this.ownership;
        this.relationship = raw.relationship ?? this.relationship;
        this.website = raw.website ?? this.website;
        this.email = raw.email ?? this.email;
        this.phone = raw.phone ?? this.phone;
        this.verifiedAt = raw.verifiedAt ?? this.verifiedAt;
        this.industry = raw.industry ?? this.industry;
        this.size = raw.size ?? this.size;
        this.founded = raw.founded ?? this.founded;
        this.description = raw.description ?? this.description;
        this.specialties = raw.specialties ?? this.specialties;
        this.images = raw.images ?? this.images;
        this.mainImageIndex = raw.mainImageIndex ?? this.mainImageIndex;
        this.address.data = raw.address;
        this.branches.data = raw.branches;
    }

    get verified() {
        return this.verifiedAt !== "";
    }
}
