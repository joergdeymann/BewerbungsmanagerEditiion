export class UiCompany {
    constructor(company) {
        this.company = company;
        this.companyNameField = document.getElementById("company-name");
    }

    toHTML() {
        if (this.companyNameField && this.company) {
            this.companyNameField.value = this.company.name || "";
        }
    }

    fromHTML() {
        if (this.companyNameField && this.company) {
            this.company.name = this.companyNameField.value;
        }
        return this.company;
    }
}
