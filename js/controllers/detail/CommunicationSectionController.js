import { InputPrompt } from "../../views/windows/InputPrompt.js";
import { VerifyPrompt } from "../../views/windows/VerifyPrompt.js";
import { ApplicationHistoryModel } from "../../models/ApplicationHistoryModel.js";
import { FormatUtils } from "../../utils/FormatUtils.js";

export class CommunicationSectionController {

    constructor(repository) {
        this.repository = repository;
    }

    addEntry(application, text, onUpdate) {
        const entry = new ApplicationHistoryModel();
        entry.data = {
            channel: "phone",
            entry: {
                date: new Date().toISOString(),
                phoneTo: "",
                phoneFrom: "",
                content: text
            }
        };

        application.application.history.push(entry);
        this.repository.save(application);
        onUpdate();
    }

    async deleteEntry(application, id, onUpdate) {
        const entry = application.application.history.find(item => item.id === id);
        if (!entry) return;

        const formattedDate = FormatUtils.toGermanDateTime(entry.entry.date);

        const promptTitle = `Löschen von Telefongespräch (${formattedDate})`;
        const verifyPrompt = new VerifyPrompt();
        const confirmed = await verifyPrompt.show(entry.entry.content, promptTitle);
        if (!confirmed) return;

        application.application.history = application.application.history.filter(
            item => item.id !== entry.id
        );

        this.repository.save(application);
        onUpdate();
    }

    async editEntry(application, id, onUpdate) {
        const entry = application.application.history.find(item => item.id === id);
        if (!entry) return;

        const inputPrompt = new InputPrompt();
        const value = await inputPrompt.show(entry.entry.content);
        if (value === null) return;

        entry.entry.content = value.trim();

        this.repository.save(application);
        onUpdate();
    }
}