import { Router } from "./core/Router.js";

// Diese Schicht existiert noch nicht (geplanter, späterer Schritt).
// Bis dahin auskommentiert, damit app.js fehlerfrei geladen werden kann.
// import { ApplicationRepository } from "./services/ApplicationRepository.js";
// import { OverviewView } from "./views/OverviewView.js";
// import { EditorView } from "./views/EditorView.js";
// import { DetailView } from "./views/DetailView.js";

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

// TODO: sobald ApplicationRepository/Views existieren, Router wieder wie folgt aufbauen:
// const repository = new ApplicationRepository();
// const router = new Router(root, {
//   "/": () => new OverviewView(repository),
//   "/new": () => new EditorView(repository),
//   "/edit/:id": (params) => new EditorView(repository, params.id),
//   "/detail/:id": (params) => new DetailView(repository, params.id)
// });
//
// document.addEventListener("click", event => {
//     const button = event.target.closest("[data-route]");
//     if (!button) return;
//     location.hash = button.dataset.route;
// });
//
// router.start();