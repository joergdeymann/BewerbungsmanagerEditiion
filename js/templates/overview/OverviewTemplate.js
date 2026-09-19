import { JobConstants } from "../../constants/JobConstants.js";

export class OverviewTemplate {

    create() {
        return `
            ${this.createHeader()}
            ${this.createList()}
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
}
