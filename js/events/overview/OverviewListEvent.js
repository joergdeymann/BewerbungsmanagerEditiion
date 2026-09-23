import { OverviewListController } from "../../controllers/overview/OverviewListController.js";

export class OverviewListEvent {

    constructor(view) {
        this.view = view;
        this.controller = new OverviewListController(view.repository);
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
                        encodeURIComponent(button.dataset.view);
                };
            });
    }

    bindEdit(root) {
        root.querySelectorAll("[data-edit]")
            .forEach(button => {
                button.onclick = () => {
                    location.hash =
                        "#/edit/" +
                        encodeURIComponent(button.dataset.edit);
                };
            });
    }

    bindAction(root) {
        root.querySelectorAll("[data-action]")
            .forEach(button => {
                button.onclick = () =>
                    this.controller.executeAction(
                        button.dataset.action,
                        () => this.view.draw(root)
                    );
            });
    }

    bindDecision(root) {
        root.querySelectorAll("[data-decision]")
            .forEach(button => {
                button.onclick = () =>
                    this.controller.executeDecision(
                        button.dataset.id,
                        button.dataset.decision,
                        () => this.view.draw(root)
                    );
            });
    }
}