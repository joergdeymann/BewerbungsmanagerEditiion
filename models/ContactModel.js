export class ContactModel {
    constructor() {
        this.id = 0;
        this.role = "";
        this.name = "";
        this.img = "";
        this.email = "";
        this.phone = "";
    }

    get data() {
        return {
            id: this.id,
            role: this.role,
            name: this.name,
            img: this.img,
            email: this.email,
            phone: this.phone
        };
    }

    set data(raw) {
        if (!raw) return;
        this.id = raw.id ?? this.id;
        this.role = raw.role ?? this.role;
        this.name = raw.name ?? this.name;
        this.img = raw.img ?? this.img;
        this.email = raw.email ?? this.email;
        this.phone = raw.phone ?? this.phone;
    }
}
