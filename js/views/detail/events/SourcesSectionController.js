export class SourcesSectionController {

    bind(root) {
        root.querySelectorAll("#sourcesList .contact-row[data-url]").forEach(row => {
            row.onclick = (event) => {
                if (event.target.closest("a")) return;
                window.open(row.dataset.url, "_blank", "noopener");
            };
        });
    }
}