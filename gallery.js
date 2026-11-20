"use strict";

const gallery = document.getElementById("gallery");
const nav = document.querySelector(".index");
const projects = [...gallery.querySelectorAll(".project")];
const links = [...nav.querySelectorAll("a")];
const lightbox = document.getElementById("lightbox");
const fullImage = lightbox.querySelector("img");
let activeProject = projects[0];

function updateProject(id, focusHeading) {
  const project = projects.find((item) => item.id === id) ?? projects[0];
  const changed = project !== activeProject;
  for (const item of projects) item.hidden = item !== project;
  for (const link of links) {
    if (link.hash === "#" + project.id) {
      link.setAttribute("aria-current", "page");
      const bounds = link.getBoundingClientRect();
      const navBounds = nav.getBoundingClientRect();
      if (bounds.left < navBounds.left || bounds.right > navBounds.right) {
        nav.scrollLeft += bounds.left - navBounds.left - 18;
      }
    } else {
      link.removeAttribute("aria-current");
    }
  }
  activeProject = project;
  const heading = project.querySelector("h1");
  document.title = "TOWER DIVE · " + heading.textContent;
  if (changed) window.scrollTo({ top: 0, behavior: "instant" });
  if (focusHeading && changed) heading.focus({ preventScroll: true });
}

nav.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (window.location.hash !== link.hash) history.pushState(null, "", link.hash);
  updateProject(link.hash.slice(1), true);
});

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#gallery") return;
  updateProject(window.location.hash.slice(1), false);
});
updateProject(window.location.hash.slice(1), false);

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
