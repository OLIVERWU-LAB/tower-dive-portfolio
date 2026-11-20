"use strict";

const gallery = document.getElementById("gallery");
const nav = document.getElementById("logo-index");
const toggle = document.querySelector(".index-toggle");
const toggleImage = toggle.querySelector("img");
const toggleLabel = toggle.querySelector("span");
const links = [...nav.querySelectorAll(".logo-link")];
const projects = [...gallery.querySelectorAll(".project")];
const projectsById = new Map(projects.map((project) => [project.id, project]));
const legacyRoutes = new Map(
  links.filter((link) => link.dataset.legacyRoute)
    .map((link) => [link.dataset.legacyRoute, link.hash.slice(1)])
);
const lightbox = document.getElementById("lightbox");
const fullImage = lightbox.querySelector("img");
let activeProject = projects[0];
let activeLink = links[0];

function revealActiveLink() {
  if (!nav.clientHeight) return;
  const card = activeLink.getBoundingClientRect();
  const viewport = nav.getBoundingClientRect();
  if (card.top < viewport.top || card.bottom > viewport.bottom) {
    nav.scrollTop += card.top - viewport.top - 12;
  }
}

function setIndexOpen(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggleLabel.textContent = open ? "收起方案" : "浏览方案";
  nav.dataset.open = String(open);
  if (open) revealActiveLink();
}

function selectProject(id, focusHeading = false) {
  const project = projectsById.get(id) ?? projectsById.get(legacyRoutes.get(id)) ?? projects[0];
  const changed = project !== activeProject;
  activeProject.hidden = true;
  project.hidden = false;
  activeProject = project;

  activeLink.removeAttribute("aria-current");
  activeLink = links.find((link) => link.hash === "#" + project.id);
  activeLink.setAttribute("aria-current", "page");
  toggleImage.src = activeLink.querySelector("img").src;
  revealActiveLink();

  const heading = project.querySelector("h1");
  document.title = "TOWER DIVE · " + heading.textContent;
  if (changed) window.scrollTo(0, 0);
  if (focusHeading) heading.focus({ preventScroll: true });
}

toggle.addEventListener("click", () => setIndexOpen(nav.dataset.open !== "true"));
document.querySelector(".sidebar").addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || nav.dataset.open !== "true") return;
  setIndexOpen(false);
  toggle.focus();
});

nav.addEventListener("click", (event) => {
  const link = event.target.closest(".logo-link");
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (window.location.hash !== link.hash) history.pushState(null, "", link.hash);
  setIndexOpen(false);
  selectProject(link.hash.slice(1), true);
});

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#gallery") return;
  selectProject(window.location.hash.slice(1));
});
selectProject(window.location.hash.slice(1));

gallery.addEventListener("click", (event) => {
  const trigger = event.target.closest(".artwork");
  if (!trigger || !lightbox.showModal) return;
  const image = trigger.querySelector("img");
  fullImage.src = image.currentSrc || image.src;
  fullImage.alt = image.alt;
  lightbox.showModal();
});

lightbox.querySelector("button").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => fullImage.removeAttribute("src"));
