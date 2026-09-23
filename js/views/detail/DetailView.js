import { CompanyTemplate } from "../../templates/detail/CompanyTemplate.js";
import { ContactTemplate } from "../../templates/detail/ContactTemplate.js";
import { JobTemplate } from "../../templates/detail/JobTemplate.js";
import { RequirementsTemplate } from "../../templates/detail/RequirementsTemplate.js";
import { BenefitsTemplate } from "../../templates/detail/BenefitsTemplate.js";
import { SourcesTemplate } from "../../templates/detail/SourcesTemplate.js";
import { ApplicationTemplate } from "../../templates/detail/ApplicationTemplate.js";
import { CommunicationTemplate } from "../../templates/detail/CommunicationTemplate.js";

import { DetailHeaderTemplate } from "../../templates/detail/DetailHeaderTemplate.js";
import { DetailNavigationTemplate } from "../../templates/detail/DetailNavigationTemplate.js";

import { DetailNavigationController } from "./events/DetailNavigationController.js";
import { CommunicationSectionController } from "./events/CommunicationSectionController.js";
import { ContactSectionController } from "./events/ContactSectionController.js";
import { SourcesSectionController } from "./events/SourcesSectionController.js";
import { DocumentsSectionController } from "./events/DocumentsSectionController.js";
import { VerifyPrompt } from "../windows/VerifyPrompt.js";


export class DetailView {

    constructor(repository, id) {

        this.repository = repository;
        this.id = id;

        this.templates = {
            company: new CompanyTemplate(),
            contact: new ContactTemplate(),
            job: new JobTemplate(),
            requirements: new RequirementsTemplate(),
            benefits: new BenefitsTemplate(),
            sources: new SourcesTemplate(),
            application: new ApplicationTemplate(),
            communication: new CommunicationTemplate()
        };

        this.headerTemplate =
            new DetailHeaderTemplate();

        this.navigationTemplate =
            new DetailNavigationTemplate();

        this.communicationController =
            new CommunicationSectionController(repository);

        this.contactController =
            new ContactSectionController(repository);

        this.sourcesController =
            new SourcesSectionController();

        this.documentsController =
            new DocumentsSectionController(repository);
    }


    render(root) {

        const application =
            this.repository.getById(this.id);

        if (!application) {
            location.hash = "#/";
            return;
        }

        this.navigation = new DetailNavigationController(
            section => this.showSection(root, application, section)
        );

        root.innerHTML =
            this.headerTemplate.render(application) +
            this.navigationTemplate.render();

        this.bindDelete(root, application);
        this.navigation.bind(root);

        this.showSection(
            root,
            application,
            "company"
        );
    }


    bindDelete(root, application) {

        const button =
            root.querySelector('[data-action="delete"]');

        if (!button) {
            return;
        }

        button.onclick = async () => {

            const verifyPrompt = new VerifyPrompt();
            const confirmed = await verifyPrompt.show(
                `${application.company?.name || "Unbenannte Firma"} – ${application.job?.title || "Keine Stelle angegeben"}`,
                "Bewerbung wirklich löschen?"
            );

            if (!confirmed) {
                return;
            }

            await this.repository.delete(application.id);
            location.hash = "#/";
        };
    }


    showSection(root, application, section) {

        const content =
            root.querySelector("#detailContent");

        content.innerHTML =
            this.getTemplate(section, application);

        this.bindSectionEvents(
            root,
            application,
            section
        );

        this.navigation.setActiveSection(root, section);
    }


    getTemplate(section, application) {

        const template =
            this.templates[section] || this.templates.company;

        return template.render(application);
    }


    bindSectionEvents(root, application, section) {

        if (section === "communication") {
            this.communicationController.bind(
                root,
                application,
                () => this.showSection(root, application, "communication")
            );
            return;
        }

        if (section === "contact") {
            this.contactController.bind(
                root,
                application,
                () => this.showSection(root, application, "contact")
            );
            return;
        }

        if (section === "sources") {
            this.sourcesController.bind(root);
            return;
        }

        if (section === "application") {
            this.documentsController.bind(
                root,
                application,
                () => this.showSection(root, application, "application")
            );
        }
    }
}