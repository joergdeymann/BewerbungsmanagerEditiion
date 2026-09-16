// ContactModel.js
export class ContactModel {
    constructor() {
        this.name = "";
        this.email = "";
        this.phone = "";
    }

    get data() {
        return {
            name: this.name,
            email: this.email,
            phone: this.phone
        };
    }

    set data(raw) {
        if (!raw) return;
        this.name = raw.name ?? this.name;
        this.email = raw.email ?? this.email;
        this.phone = raw.phone ?? this.phone;
    }
}
