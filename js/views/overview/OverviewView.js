import { JobConstants } from "../Constants/JobConstants.js";
import { ApplicationView } from "./ApplicationView.js";
import { OverviewEvent } from "./events/OverviewEvent.js";
import { OverviewFilterEvent } from "./events/OverviewFilterEvent.js";
import { OverviewListEvent } from "./events/OverviewListEvent.js";
import { OverviewFilter } from "./filter/OverviewFilter.js";

export class OverviewView {

    constructor(repository) {
        this.repository = repository;
        this.applicationView = new ApplicationView();
        this.filter = new OverviewFilter(repository);
    }

    render(root) {
        root.innerHTML = this.createHtml();

        new OverviewEvent(this).bind(root);
        new OverviewFilterEvent(this).bind(root);

        this.draw(root);
    }

    createHtml() {
        const header = this.createHeader();
        const list = this.createList();

        return `
            ${header}
            ${list}
        `;
    }

    createHeader() {
        const statusOptions = this.createStatusOptions();
        const artOptions = this.createArtOptions();

        return `
            <div class="app-header">
                <input id="search"
                       placeholder="Firma, Stelle oder Ort suchen">

                <select id="statusFilter">
                    <option value="">Alle Status</option>
                    ${statusOptions}
                </select>

                <select id="artFilter">
                    <option value="">Alle Arten</option>
                    ${artOptions}
                </select>

                <select id="sort">
                    <option value="name">Firma A–Z</option>
                    <option value="nameDesc">Firma Z–A</option>
                    <option value="new">Neueste zuerst</option>
                    <option value="old">Älteste zuerst</option>
                </select>

                <button class="primary width8em" id="compact">
                    Compact
                </button>
            </div>
        `;
    }

    createStatusOptions() {
        return Object.values(JobConstants.STATUS)
            .map(status => `
                <option value="${status}">
                    ${JobConstants.STATUS_LABEL[status]}
                </option>
            `)
            .join("");
    }

    createArtOptions() {
        return JobConstants.ART_OPTIONS
            .map(art => `
                <option value="${art}">
                    ${art}
                </option>
            `)
            .join("");
    }

    createList() {
        return `<div id="list" class="content-frame"></div>`;
    }

    draw(root) {
        const filters = this.getFilters(root);
        const applications = this.filter.getApplications(filters);

        const html = applications.length
            ? applications
                .map(application =>
                    this.applicationView.create(application)
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