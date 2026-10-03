import { AppModel } from "../../models/AppModel.js";
import { EditHeaderTemplate } from "../../templates/edit/EditHeaderTemplate.js";
import { EditNavigationTemplate } from "../../templates/edit/EditNavigationTemplate.js";
import { EditNavigationEvent } from "../../events/edit/EditNavigationEvent.js";
import { EditController } from "../../controllers/edit/EditController.js";
import { ImportEditTab } from "./ImportEditTab.js";
import { CompanyEditTab } from "./CompanyEditTab.js";
import { ContactEditTab } from "./ContactEditTab.js";
import { JobEditTab } from "./JobEditTab.js";
import { RequirementsEditTab } from "./RequirementsEditTab.js";
import { BenefitsEditTab } from "./BenefitsEditTab.js";

export class EditView {

    constructor(repository, id) {
        this.repository = repository;
        this.id = id;
        this.headerTemplate = new EditHeaderTemplate();
        this.navigationTemplate = new EditNavigationTemplate();
        this.navigationEvent = new EditNavigationEvent();
        this.controller = new EditController(repository);
    }

    render(root) {
        const application = this.id
            ? this.repository.getById(this.id)
            : new AppModel();

        if (this.id && !application) {
            location.hash = "#/";
            return;
        }

        this.application = application;

        root.innerHTML =
            this.headerTemplate.render(application) +
            this.navigationTemplate.render();

        const content = root.querySelector("#editorTabContent");

        this.tabs = [
            new ImportEditTab(content),
            new CompanyEditTab(content),
            new ContactEditTab(content, this.repository),
            new JobEditTab(content),
            new RequirementsEditTab(content),
            new BenefitsEditTab(content)
        ];

        content.innerHTML = this.tabs.map(tab => tab.render()).join("");
        this.tabs.forEach(tab => {
            if (tab instanceof ImportEditTab) {
                tab.init(application, result => this.applyAnalysisToAllTabs(result));
            } else {
                tab.init(application);
            }
        });

        this.navigationEvent.bind(root, section => this.onSectionChange(section));
        this.bindActions(root);
    }

    /**
     * Rendert den Kontakt-Reiter beim Reiterwechsel neu. Die Anzeige liest
     * ausschließlich aus dem Model; ein Firmenreiter schreibt nicht ins Model.
     * @param {string} section Aktiver Reiter.
     */
    onSectionChange(section) {
        if (section !== "contact") return;

        this.tabs.find(tab => tab instanceof ContactEditTab)?.renderContactSection();
    }

    /**
     * Übernimmt das Analyseergebnis in das Model und lädt danach alle Reiter neu
     * aus dem Model. Die Reiter selbst schreiben nichts ins Model.
     * @param {object} result Ergebnis der Textanalyse.
     */
    applyAnalysisToAllTabs(result) {
        this.controller.analysisController.apply(this.application, result);
        this.reloadTabs();
    }

    /**
     * Liest die Model-Werte erneut in die Reiter-Felder ein.
     */
    reloadTabs() {
        this.tabs.forEach(tab => {
            if (tab instanceof ImportEditTab) return;
            tab.init(this.application);
        });
    }

    bindActions(root) {
        root.querySelector('[data-action="save"]').onclick = () =>
            this.controller.save(this.application, this.tabs);

        root.querySelector('[data-action="cancel"]').onclick = () =>
            this.controller.cancel(this.application);
    }
}