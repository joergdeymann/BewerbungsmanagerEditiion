import { JobConstants } from "../../Constants/JobConstants.js";

export class OverviewListEvent {

    constructor(view) {
        this.view = view;
    }

    bind(root) {
        this.bindView(root);
        this.bindEdit(root);
        this.bindAction(root);
        this.bindDecision(root);
    }

    bindView(root) {
        root.querySelectorAll("[data-view]")
            .forEach(button => {
                button.onclick = () => {
                    location.hash =
                        "#/detail/" +
                        encodeURIComponent(
                            button.dataset.view
                        );
                };
            });
    }

    bindEdit(root) {
        root.querySelectorAll("[data-edit]")
            .forEach(button => {
                button.onclick = () => {
                    location.hash =
                        "#/edit/" +
                        encodeURIComponent(
                            button.dataset.edit
                        );
                };
            });
    }

    bindAction(root) {
        root.querySelectorAll("[data-action]")
            .forEach(button => {
                button.onclick = () =>
                    this.executeAction(
                        button.dataset.action,
                        () => this.view.draw(root)
                    );
            });
    }

    bindDecision(root) {
        root.querySelectorAll("[data-decision]")
            .forEach(button => {
                button.onclick = () =>
                    this.executeDecision(
                        button.dataset.id,
                        button.dataset.decision,
                        () => this.view.draw(root)
                    );
            });
    }

    executeAction(id, redraw) {
        const application =
            this.view.repository.getById(id);

        if (!application) return;

        const status = this.view.getStatus(application);

        if (status === JobConstants.STATUS.RUECKRUF) {
            this.createCommunication(application, redraw);
            return;
        }

        const nextStatus = {
            [JobConstants.STATUS.ENTWURF]:
                JobConstants.STATUS.BEWORBEN,

            [JobConstants.STATUS.BEWORBEN]:
                JobConstants.STATUS.EINGANG,

            [JobConstants.STATUS.EINGANG]:
                JobConstants.STATUS.RUECKRUF
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

        this.view.repository.save(application);
        redraw();
    }

    createCommunication(application, redraw) {
        const note = prompt(
            "Telefonat / Rückruf dokumentieren:"
        );

        if (!note?.trim()) {
            redraw();
            return;
        }

        application.communication =
            application.communication || [];

        application.communication.push({
            id: crypto.randomUUID(),
            type: "Telefonat",
            text: note.trim(),
            date: new Date().toISOString()
        });

        this.view.repository.save(application);
        redraw();
    }

    executeDecision(id, decision, redraw) {
        const application =
            this.view.repository.getById(id);

        if (!application) return;

        application.application.status =
            decision === "accepted"
                ? JobConstants.STATUS.ANGENOMMEN
                : JobConstants.STATUS.ABGELEHNT;

        if (
            application.application.status ===
            JobConstants.STATUS.ABGELEHNT
        ) {
            application.application.rejectionAt =
                new Date().toISOString().slice(0, 10);
        }

        this.view.repository.save(application);
        redraw();
    }
}