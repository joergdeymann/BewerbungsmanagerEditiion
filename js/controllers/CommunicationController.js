import { ApplicationHistoryModel } from "../models/ApplicationHistoryModel.js";
import { InputPrompt } from "../views/windows/InputPrompt.js";
import { UiContact } from "../ui/detail/UiContact.js";
import { FormatUtils } from "../utils/FormatUtils.js";

/**
 * Dokumentiert ein Telefonat/einen Rückruf über das gemeinsame
 * Anrufen-Fenster (InputPrompt) und hängt bei Bestätigung einen
 * Telefon-Eintrag an die Bewerbungshistorie an.
 * Wird sowohl von der Übersicht als auch vom Ansprechpartner-Bereich
 * der Detailansicht verwendet, damit es nur ein Fenster gibt.
 */
export class CommunicationController {

    constructor(repository) {
        this.repository = repository;
        this.inputPrompt = new InputPrompt();
    }

    async logCall(application, redraw) {
        const uiContact = new UiContact(application);

        const note = await this.inputPrompt.show("", {
            name: uiContact.name,
            email: uiContact.email,
            phone: uiContact.phone
        });

        if (!note?.trim()) {
            redraw?.();
            return;
        }

        const date = new Date().toISOString();

        const entry = new ApplicationHistoryModel();
        entry.data = {
            channel: "phone",
            entry: {
            date,
            subject: `Telefonat vom ${FormatUtils.toGermanDateTime(date)}`,
                phoneTo: uiContact.phone,
                phoneFrom: "",
                content: note.trim()
            }
        };
        application.application.history.push(entry);

        if (application.id) {
            await this.repository.save(application);
        }

        redraw?.();
    }
}
