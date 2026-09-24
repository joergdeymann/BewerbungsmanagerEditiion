import { Router } from "./core/Router.js";
import { NavigationState } from "./core/NavigationState.js";
import { AppCache } from "./store/AppCache.js";
import { SkillCache } from "./store/SkillCache.js";
import { OverviewView } from "./views/overview/OverviewView.js";
import { DetailView } from "./views/detail/DetailView.js";
import { SkillsView } from "./views/skills/SkillsView.js";
// Editor existiert noch nicht (geplanter, späterer Schritt).
// import { EditorView } from "./views/EditorView.js";

// Kommt der Aufruf vom Bookmarklet (siehe ImportTab.js) mit einer
// mitgegebenen URL, merken wir sie kurz vor und springen direkt in
// einen neuen, leeren Editor - dort holt sich ImportTab die URL ab
// und startet den Abruf automatisch.
const importUrlParam = new URLSearchParams(location.search).get("importUrl");
if (importUrlParam) {
    sessionStorage.setItem("pendingImportUrl", importUrlParam);
    history.replaceState(null, "", location.pathname);
    location.hash = "#/new";
}

const root = document.querySelector("#app");
const skillCache = new SkillCache();
await skillCache.load();

const appcache = new AppCache(skillCache);
await appcache.load();

const router = new Router(root, {
    "/": () => new OverviewView(appcache),
    // "/new": () => new EditorView(appcache),
    // "/edit/:id": (params) => new EditorView(appcache, params.id),
    "/detail/:id": (params) => new DetailView(appcache, params.id, skillCache),
    "/skills": () => new SkillsView(skillCache)
});

document.addEventListener("click", event => {
    const button = event.target.closest("[data-route]");
    if (!button) return;
    location.hash = button.dataset.route;
});

function updateSkillsNavButton() {
    const button = document.querySelector("#skillsNavButton");
    if (!button) return;

    const onSkillsPage = location.hash.startsWith("#/skills");

    if (onSkillsPage && NavigationState.lastDetail) {
        button.textContent = `← ${NavigationState.lastDetail.companyName}`;
        button.dataset.route = `#/detail/${encodeURIComponent(NavigationState.lastDetail.id)}`;
    } else {
        button.textContent = "Kenntnisse";
        button.dataset.route = "#/skills";
    }
}

router.start();
window.addEventListener("hashchange", updateSkillsNavButton);
updateSkillsNavButton();