import { JobConstants } from "../../constants/JobConstants.js";
import { FormatUtils } from "../../utils/FormatUtils.js";
import { HtmlUtils } from "../../utils/HtmlUtils.js";

export class ApplicationView {

    create(application) {
        const data = this.prepareData(application);

        return `
            <div class="application-card application-row">
                <div class="flex-row left-side">
                    ${data.status}

                    <div class="application-main">
                        ${data.company}
                        ${data.job}
                        ${data.city}
                    </div>
                </div>

                <div class="application-actions">
                    ${data.actions}
                </div>
            </div>
        `;
    }

    prepareData(application) {
        const status = this.getStatus(application);

        return {
            status: this.createStatus(application, status),
            company: this.createCompany(application),
            job: this.createJob(application),
            city: this.createCity(application),
            actions: this.createActions(application, status)
        };
    }

    createStatus(application, status) {
        const statusClass = JobConstants.getClass(status);
        const statusLabel = JobConstants.STATUS_LABEL[status];
        const date = FormatUtils.toGermanDate(
            application.application?.appliedAt || ""
        );

        return `
            <span class="status-badge ${statusClass}">
                ${HtmlUtils.escape(statusLabel)}<br>
                ${HtmlUtils.escape(date)}
            </span>
        `;
    }

    createCompany(application) {
        const name = application.company?.name
            || "Unbenannte Firma";

        return `
            <strong>${HtmlUtils.escape(name)}</strong>
        `;
    }

    createJob(application) {
        const title = application.job?.title
            || "Keine Stelle angegeben";

        return `
            <span class="toggler">
                ${HtmlUtils.escape(title)}
            </span>
        `;
    }

    createCity(application) {
        const city = application.company?.address?.data?.city || "—";
        return `
            <small class="toggler">
                ${HtmlUtils.escape(city)}
            </small>
        `;
    }

    createActions(application, status) {
        const action = this.getAction(status);
        const actionButton = this.createActionButton(
            application,
            action
        );
        const decisionButtons =
            this.createDecisionButtons(application, status);

        return `
            <button data-view="${application.id}">
                Ansicht
            </button>

            <button data-edit="${application.id}">
                Update
            </button>

            ${actionButton}
            ${decisionButtons}
        `;
    }

    createActionButton(application, action) {
        if (!action) return "";

        return `
            <button class="primary"
                    data-action="${application.id}">
                ${HtmlUtils.escape(action.label)}
            </button>
        `;
    }

    createDecisionButtons(application, status) {
        if (status !== JobConstants.STATUS.RUECKRUF) {
            return "";
        }

        return `
            <button data-decision="accepted"
                    data-id="${application.id}">
                Angenommen
            </button>

            <button class="danger"
                    data-decision="rejected"
                    data-id="${application.id}">
                Abgelehnt
            </button>
        `;
    }

    getAction(status) {
        if (status === JobConstants.STATUS.ENTWURF) {
            return { label: "Bewerben" };
        }

        if (status === JobConstants.STATUS.BEWORBEN) {
            return { label: "Eingangsbestätigung" };
        }

        if (status === JobConstants.STATUS.EINGANG) {
            return { label: "Rückruf erhalten" };
        }

        if (status === JobConstants.STATUS.RUECKRUF) {
            return { label: "Anrufen" };
        }

        return null;
    }

    getStatus(application) {
        return application.application?.status
            || JobConstants.STATUS.ENTWURF;
    }
}