import { JobConstants } from "../../constants/JobConstants.js";
import { CommunicationController } from "../CommunicationController.js";

export class OverviewListController {

    constructor(repository) {
        this.repository = repository;
        this.communication = new CommunicationController(repository);
    }

    async executeAction(id, redraw) {
        const application = this.repository.getById(id);
        if (!application) return;

        const status = this.getStatus(application);

        if (status === JobConstants.STATUS.RUECKRUF) {
            await this.communication.logCall(application, redraw);
            return;
        }

        const nextStatus = {
            [JobConstants.STATUS.ENTWURF]: JobConstants.STATUS.BEWORBEN,
            [JobConstants.STATUS.BEWORBEN]: JobConstants.STATUS.EINGANG,
            [JobConstants.STATUS.EINGANG]: JobConstants.STATUS.RUECKRUF
        }[status];

        if (!nextStatus) return;

        application.application.status = nextStatus;

        if (
            nextStatus === JobConstants.STATUS.BEWORBEN
            && !application.application.appliedAt
        ) {
            application.application.appliedAt =
                new Date().toISOString().slice(0, 10);
        }

        this.repository.save(application);
        redraw();
    }

    executeDecision(id, decision, redraw) {
        const application = this.repository.getById(id);
        if (!application) return;

        application.application.status =
            decision === "accepted"
                ? JobConstants.STATUS.ANGENOMMEN
                : JobConstants.STATUS.ABGELEHNT;

        if (application.application.status === JobConstants.STATUS.ABGELEHNT) {
            application.application.rejectionAt =
                new Date().toISOString().slice(0, 10);
        }

        this.repository.save(application);
        redraw();
    }

    getStatus(application) {
        return application.application?.status
            || JobConstants.STATUS.ENTWURF;
    }
}
