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
        const workModelOptions = this.createWorkModelOptions();
        const employmentTypeOptions = this.createEmploymentTypeOptions();

        return `
            <div class="app-header">
                <input id="search"
                       placeholder="Firma, Stelle oder Ort suchen">

                <button class="primary width8em" id="compact">
                    Compact
                </button>

                <div style="flex-basis: 100%;height:0;"></div>
                <select id="statusFilter">
                    <option value="">Alle Status</option>
                    ${statusOptions}
                </select>

                <select id="workModelFilter">
                    <option value="">Alle Arbeitsmodelle</option>
                    ${workModelOptions}
                </select>

                <select id="employmentTypeFilter">
                    <option value="">Alle Beschäftigungsarten</option>
                    ${employmentTypeOptions}
                </select>

                <select id="sort">
                    <option value="name">Firma A–Z</option>
                    <option value="nameDesc">Firma Z–A</option>
                    <option value="new">Neueste zuerst</option>
                    <option value="old">Älteste zuerst</option>
                </select>

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

    createWorkModelOptions() {
        return JobConstants.WORK_MODEL
            .map(option => `<option value="${option}">${option}</option>`)
            .join("");
    }

    createEmploymentTypeOptions() {
        return JobConstants.EMPLOYMENT_TYPE
            .map(option => `<option value="${option}">${option}</option>`)
            .join("");
    }

    createList() {
        return `<div id="list" class="content-frame"></div>`;
    }
}
