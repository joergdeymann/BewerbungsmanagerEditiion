import { BaseEditTab } from "./BaseEditTab.js";
import { CompanyEditTemplate } from "../../templates/edit/CompanyEditTemplate.js";
import { CompanyImageList } from "../../ui/edit/CompanyImageList.js";

export class CompanyEditTab extends BaseEditTab {

    render() {
        return new CompanyEditTemplate().render();
    }

    init(application) {
        const company = application.company;

        this.set("companyName", company?.name);
        this.set("legalForm", company?.legalForm);
        this.set("relationship", company?.relationship);
        this.set("industry", company?.industry);
        this.set("companySize", company?.size);
        this.set("founded", company?.founded);
        this.set("website", company?.website);
        this.set("street", company?.address?.street?.name);
        this.set("houseNumber", company?.address?.street?.houseNumber);
        this.set("zipCountry", company?.address?.city?.zipCountry);
        this.set("zip", company?.address?.city?.zip);
        this.set("city", company?.address?.city?.city);
        this.set("country", company?.address?.city?.country);
        this.set("postBox", company?.address?.postBox);
        this.set("verifiedAt", company?.verifiedAt);
        this.set("companyDescription", company?.description);
        this.set("specialties", (company?.specialties || []).join("\n"));

        this.imageList = new CompanyImageList(this.root.querySelector("#companyImages"));
        this.imageList.setImages(company?.images || [], company?.mainImageIndex || 0);
    }

    applyAnalysis() {
        // Wird beim Import-Thema ergänzt.
    }

    save(application) {
        application.company.name = this.get("companyName");
        application.company.legalForm = this.get("legalForm");
        application.company.relationship = this.get("relationship");
        application.company.industry = this.get("industry");
        application.company.size = this.get("companySize");
        application.company.founded = this.get("founded");
        application.company.website = this.get("website");
        application.company.verifiedAt = this.get("verifiedAt");
        application.company.description = this.get("companyDescription");
        application.company.specialties = this.list("specialties");
        application.company.images = this.imageList.getImages();
        application.company.mainImageIndex = this.imageList.getMainImageIndex();

        application.company.address.street.name = this.get("street");
        application.company.address.street.houseNumber = this.get("houseNumber");
        application.company.address.city.zipCountry = this.get("zipCountry");
        application.company.address.city.zip = this.get("zip");
        application.company.address.city.city = this.get("city");
        application.company.address.city.country = this.get("country");
        application.company.address.postBox = this.get("postBox");
    }
}