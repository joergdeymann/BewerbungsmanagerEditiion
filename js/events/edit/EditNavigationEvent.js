export class EditNavigationEvent {

    bind(root) {
        const buttons = root.querySelectorAll("[data-section]");

        buttons.forEach(button => {
            button.onclick = () => this.showSection(root, buttons, button.dataset.section);
        });

        const first = buttons[0]?.dataset.section;
        if (first) this.showSection(root, buttons, first);
    }

    showSection(root, buttons, section) {
        root.querySelectorAll(".tab-content").forEach(content => {
            content.style.display = content.id === "section-" + section ? "" : "none";
        });

        buttons.forEach(button => {
            button.classList.toggle("active", button.dataset.section === section);
        });
    }
}