import { JobConstants } from "../../constants/JobConstants.js";
import { OverviewTemplate } from "../../templates/overview/OverviewTemplate.js";
import { ApplicationCardTemplate } from "../../templates/overview/ApplicationCardTemplate.js";
import { OverviewFilter } from "../../ui/overview/OverviewFilter.js";
import { OverviewEvent } from "../../events/overview/OverviewEvent.js";
import { OverviewFilterEvent } from "../../events/overview/OverviewFilterEvent.js";
import { OverviewListEvent } from "../../events/overview/OverviewListEvent.js";

export class OverviewView {

    constructor(repository) {
        this.repository = repository;
        this.template = new OverviewTemplate();
        this.cardTemplate = new ApplicationCardTemplate();
        this.filter = new OverviewFilter(repository);
    }

    render(root) {
        root.innerHTML = this.template.create();

        new OverviewEvent(this).bind(root);
        new OverviewFilterEvent(this).bind(root);

        this.draw(root);
    }

    draw(root) {
        const filters = this.getFilters(root);
        const applications = this.filter.getApplications(filters);

        const html = applications.length
            ? applications
                .map(application =>
                    this.cardTemplate.create(application)
                )
                .join("")
            : `
                <div class="empty">
                    Noch keine passenden Bewerbungen vorhanden.
                </div>
            `;

        root.querySelector("#list").innerHTML = html;

        new OverviewListEvent(this).bind(root);
    }

    getStatus(application) {
        return application.application?.status
            || JobConstants.STATUS.ENTWURF;
    }

    getCompanyName(application) {
        return application.company?.name
            || "Unbenannte Firma";
    }

    getFilters(root) {
        return {
            search: root.querySelector("#search")
                .value
                .toLowerCase()
                .trim(),

            status: root.querySelector("#statusFilter").value,

            art: root.querySelector("#artFilter").value,

            sort: root.querySelector("#sort").value
        };
    }
}
