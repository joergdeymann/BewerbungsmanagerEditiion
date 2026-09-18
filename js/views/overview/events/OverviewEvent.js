export class OverviewEvent {

    constructor(view) {
        this.view = view;
    }

    bind(root) {
        root.querySelector("#compact").onclick =
            () => this.toggleCompact(root);
    }

    toggleCompact(root) {
        const button = root.querySelector("#compact");
        const list = root.querySelector("#list");

        button.innerText =
            button.innerText === "Compact"
                ? "Informiert"
                : "Compact";

        button.style.width = "8em";
        list.classList.toggle("compact");
    }
}