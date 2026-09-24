import { JobConstants } from "../../constants/JobConstants.js";

export class OverviewFilter {

    constructor(repository) {
        this.repository = repository;
    }

    getApplications(filters) {
        const applications = this.repository.getAll()
            .filter(application => this.matches(
                application,
                filters
            ));

        return this.sort(
            applications,
            filters.sort
        );
    }

    matches(application, filters) {
        return this.matchesSearch(
            application,
            filters.search
        )
        && this.matchesStatus(
            application,
            filters.status
        )
        && this.matchesWorkModel(
            application,
            filters.workModel
        )
        && this.matchesEmploymentType(
            application,
            filters.employmentType
        );
    }

    matchesSearch(application, search) {
        if (!search) return true;

        const text = [
            application.company?.name,
            application.company?.address?.data?.city,
            application.job?.title
        ]
            .join(" ")
            .toLowerCase();

        return text.includes(search);
    }

    matchesStatus(application, status) {
        if (!status) return true;

        return this.getStatus(application) === status;
    }

    matchesWorkModel(application, workModel) {
        if (!workModel) return true;

       return (application.job?.workModel || []).includes(workModel);
    }

    matchesEmploymentType(application, employmentType) {
        if (!employmentType) return true;

        return application.job?.employmentType === employmentType;
    }

    sort(applications, sort) {
        return applications.sort((a, b) => {
            if (sort === "name") {
                return this.getCompanyName(a)
                    .localeCompare(this.getCompanyName(b));
            }

            if (sort === "nameDesc") {
                return this.getCompanyName(b)
                    .localeCompare(this.getCompanyName(a));
            }

            if (sort === "new") {
                return (b.createDate || "")
                    .localeCompare(a.createDate || "");
            }

            if (sort === "old") {
                return (a.createDate || "")
                    .localeCompare(b.createDate || "");
            }

            return 0;
        });
    }

    getStatus(application) {
        return application.application?.status
            || JobConstants.STATUS.ENTWURF;
    }

    getCompanyName(application) {
        return application.company?.name || "";
    }
}