export class EditController {

    constructor(repository) {
        this.repository = repository;
    }

    async save(application, tabs) {
        tabs.forEach(tab => tab.save(application));

        await this.repository.save(application);
        location.hash = "#/detail/" + encodeURIComponent(application.id);
    }

    cancel(application) {
        location.hash = application.id
            ? "#/detail/" + encodeURIComponent(application.id)
            : "#/";
    }
}