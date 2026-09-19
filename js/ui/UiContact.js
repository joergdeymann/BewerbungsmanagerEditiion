export class UiContact {
    constructor(application) {
        this.contact = application.contacts?.[0] || null;
        this.company = application.company;
    }

    get name() {
        return this.contact?.name || this.company?.name || "";
    }

    get role() {
        return this.contact?.role || "";
    }

    get email() {
        return this.contact?.email || this.company?.email || "";
    }

    get phone() {
        return this.contact?.phone || this.company?.phone || "";
    }
}
