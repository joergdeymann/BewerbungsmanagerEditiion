import { AddressModel } from "./AddressModel.js";

export class CompanyModel {
    constructor() {
        this.id = 0;
        this.name = "";
        this.legalForm = "";
        this.relationship = "Hauptsitz";
        this.industry = "";
        this.size = "";
        this.founded = "";
        this.website = "";
        this.email = "";
        this.phone = "";
        this.address = new AddressModel();
        this.verifiedAt = "";
        this.description = "";
        this.specialties = [];
        this.images = [];
    }

    get data() {
        return {
            id: this.id,
            name: this.name,
            legalForm: this.legalForm,
            relationship: this.relationship,
            address: this.address.data,
            website: this.website,
            email: this.email,
            phone: this.phone,
            verifiedAt: this.verifiedAt,
            industry: this.industry,
            size: this.size,
            founded: this.founded,
            description: this.description,
            specialties: this.specialties,
            images: this.images
        };
    }

    set data(raw) {
        if (!raw) return;
        this.id = raw.id ?? this.id;
        this.name = raw.name ?? this.name;
        this.legalForm = raw.legalForm ?? this.legalForm;
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
        this.address.data = raw.address;
    }

    get verified() {
        return this.verifiedAt !== "";
    }
}
