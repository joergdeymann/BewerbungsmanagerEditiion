export class EditNavigationEvent {
    /**
     * Bindet die Navigation im Editor.
     * @param {HTMLElement} root Wurzelelement des Editors.
     * @param {(section: string) => void} onSectionChange Callback beim Reiterwechsel.
     */
    bind(root, onSectionChange = () => {}) {
        const buttons = root.querySelectorAll("[data-section]");

        buttons.forEach(button => {
            button.onclick = () =>
                this.showSection(root, buttons, button.dataset.section, onSectionChange);
        });

        const first = buttons[0]?.dataset.section;
        if (first) this.showSection(root, buttons, first, onSectionChange);
    }

    /**
     * Blendet den gewaehlten Reiter ein.
     * @param {HTMLElement} root Wurzelelement des Editors.
     * @param {NodeList} buttons Navigationsbuttons.
     * @param {string} section Aktiver Reiter.
     * @param {(section: string) => void} onSectionChange Callback beim Reiterwechsel.
     */
    showSection(root, buttons, section, onSectionChange = () => {}) {
        root.querySelectorAll(".tab-content").forEach(content => {
            content.style.display = content.id === "section-" + section ? "" : "none";
        });

        buttons.forEach(button => {
            button.classList.toggle("active", button.dataset.section === section);
        });

        onSectionChange(section);
    }
}