import { Router } from "./core/Router.js";
import { AppCache } from "./data/AppCache.js";
import { OverviewView } from "./views/overview/OverviewView.js";
import { DetailView } from "./views/detail/DetailView.js";

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
const appcache = new AppCache();
await appcache.load();

const router = new Router(root, {
  "/": () => new OverviewView(appcache),
  // "/new": () => new EditorView(appcache),
  // "/edit/:id": (params) => new EditorView(appcache, params.id),
  "/detail/:id": (params) => new DetailView(appcache, params.id)
});

document.addEventListener("click", event => {
    const button = event.target.closest("[data-route]");
    if (!button) return;
    location.hash = button.dataset.route;
});

router.start();