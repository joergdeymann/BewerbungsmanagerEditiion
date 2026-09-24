// Merkt sich die zuletzt besuchte Bewerbung, damit der
// Kenntnisse-Button auf der Kenntnisse-Seite als "Zurück zu [Firma]"
// dienen kann, wenn man von einer Detailansicht dorthin kommt.
export class NavigationState {

    static lastDetail = null; // { id, companyName }

    static setLastDetail(id, companyName) {
        this.lastDetail = { id, companyName };
    }
}