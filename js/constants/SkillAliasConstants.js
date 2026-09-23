export class SkillAliasConstants {

    static ALIASES = {
        "js": "JavaScript",
        "ts": "TypeScript",
        "node": "Node.js", "nodejs": "Node.js",
        "reactjs": "React", "react.js": "React",
        "vue": "Vue.js", "vuejs": "Vue.js",
        "html5": "HTML",
        "css3": "CSS",
        "postgres": "PostgreSQL",
        "k8s": "Kubernetes",
        "gcp": "Google Cloud", "google cloud platform": "Google Cloud",
        "cicd": "CI/CD", "ci/cd": "CI/CD",
        "restful": "REST"
        // ... weitere nach Bedarf ergänzen
    };

    static resolve(rawName) {
        const trimmed = (rawName || "").trim();
        if (!trimmed) return "";

        return this.ALIASES[trimmed.toLowerCase()] || trimmed;
    }
}