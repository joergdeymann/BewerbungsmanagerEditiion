export class OverviewFilterEvent {

    constructor(view) {
        this.view = view;
    }

    bind(root) {
        root.querySelector("#search").oninput =
            () => this.change(root);

        root.querySelector("#statusFilter").onchange =
            () => this.change(root);

        root.querySelector("#workModelFilter").onchange =
            () => this.change(root);

        root.querySelector("#employmentTypeFilter").onchange =
            () => this.change(root);

        root.querySelector("#sort").onchange =
            () => this.change(root);
    }

    change(root) {
        this.view.draw(root);
    }
}