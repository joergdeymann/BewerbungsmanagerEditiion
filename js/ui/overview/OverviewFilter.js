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

    /**
     * Arbeitstage-Typ (Vor Ort, Hybrid, Homeoffice, Remote) der Stelle.
     * Ältere Datensätze führen job.workModel noch als Liste von Namen.
     */
    matchesWorkModel(application, workModel) {
        if (!workModel) return true;

        const work = application.job?.workModel;
        const types = Array.isArray(work)
            ? work
            : (work?.workDays || []).map(day => day.type);

        return types.includes(workModel);
    }

    /**
     * Art der Anstellung (workModel.type). Ältere Datensätze führen sie noch
     * als job.employmentType.
     */
    matchesEmploymentType(application, employmentType) {
        if (!employmentType) return true;

        const job = application.job;
        const types = [...(job?.workModel?.type || []), job?.employmentType].filter(Boolean);

        return types.includes(employmentType);
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