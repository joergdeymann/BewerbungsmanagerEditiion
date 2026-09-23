export class SourcesSectionEvent {

    constructor() {
        this.sortKey = "date";
        this.sortAsc = false;
    }

    bind(root) {
        this.bindSort(root);
        this.bindRowClick(root);
        this.updateArrows(root);
    }

    bindSort(root) {
        root.querySelectorAll("#sourcesList [data-sort]").forEach(header => {
            header.onclick = () => {
                const key = header.dataset.sort;
                if (this.sortKey === key) {
                    this.sortAsc = !this.sortAsc;
                } else {
                    this.sortKey = key;
                    this.sortAsc = true;
                }
                this.applySort(root);
                this.updateArrows(root);
            };
        });
    }

    applySort(root) {
        const list = root.querySelector("#sourcesList");
        if (!list) return;

        const rows = [...list.querySelectorAll(".contact-row[data-url]")];
        rows.sort((a, b) => {
            const valueA = a.dataset[this.sortKey] || "";
            const valueB = b.dataset[this.sortKey] || "";
            return this.sortAsc
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        });

        rows.forEach(row => list.appendChild(row));
    }

    updateArrows(root) {
        root.querySelectorAll("#sourcesList [data-sort-arrow]").forEach(arrow => {
            arrow.textContent = arrow.dataset.sortArrow === this.sortKey
                ? (this.sortAsc ? "▲" : "▼")
                : "";
        });
    }

    bindRowClick(root) {
        root.querySelectorAll("#sourcesList .contact-row[data-url]").forEach(row => {
            row.onclick = (event) => {
                if (event.target.closest("a")) return;
                window.open(row.dataset.url, "_blank", "noopener");
            };
        });
    }
}