import { Router } from "./core/Router.js";
import { NavigationState } from "./core/NavigationState.js";
import { AppCache } from "./store/AppCache.js";
import { SkillCache } from "./store/SkillCache.js";
import { OverviewView } from "./views/overview/OverviewView.js";
import { DetailView } from "./views/detail/DetailView.js";
import { EditView } from "./views/edit/EditView.js";
import { SkillsView } from "./views/skills/SkillsView.js";
import { ImportInbox } from "./io/ImportInbox.js";
import { ImportConstants } from "./constants/ImportConstants.js";

// Das Bookmarklet (siehe BookmarkletBuilder.js) schickt das HTML der Stellenanzeige per
// postMessage. Das App-Fenster trägt einen festen Namen, damit das Bookmarklet bei jedem
// Import dasselbe Fenster nutzt; ImportInbox schreibt die Seite in den offenen Editor.
// Wird die App neu vom Bookmarklet geöffnet (?importUrl=...) und kommt nichts an,
// wird die URL über den Server abgerufen.
window.name = ImportConstants.WINDOW_NAME;
ImportInbox.listen();

const importUrlParam = new URLSearchParams(location.search).get("importUrl");
if (importUrlParam) {
    history.replaceState(null, "", location.pathname);
    location.hash = "#/new";
    ImportInbox.expectBookmarklet(importUrlParam);
}

const root = document.querySelector("#app");
const skillCache = new SkillCache();
await skillCache.load();

const appcache = new AppCache(skillCache);
await appcache.load();

const router = new Router(root, {
    "/": () => new OverviewView(appcache),
    "/new": () => new EditView(appcache, null),
    "/edit/:id": (params) => new EditView(appcache, params.id),
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