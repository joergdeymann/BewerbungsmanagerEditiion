export class EditNavigationTemplate {

    render() {
        return `
            <header class="app-header">
                <nav class="detail-navigation">
                    <button type="button" data-section="company">Firma</button>
                    <button type="button" data-section="contact">Kontakt</button>
                    <button type="button" data-section="job">Stelle</button>
                    <button type="button" data-section="requirements">Anforderungen</button>
                    <button type="button" data-section="benefits">Benefits</button>
                </nav>
            </header>

            <main id="editorTabContent" class="content-frame"></main>
        `;
    }
}