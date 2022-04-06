import autosize from "autosize";

export function dropMenu() {
  const drop = document.querySelector(".chat-main-sidebar-drop");
  const list = document.querySelector(".chat-main-sidebar-list");

  drop.style.display = "none";
  list.style.display = "flex";
}

export function closeDropMenu() {
  const drop = document.querySelector(".chat-main-sidebar-drop");
  const list = document.querySelector(".chat-main-sidebar-list");

  drop.style.display = "block";
  list.style.display = "none";
}

export function autosizeTextArea() {
  autosize(document.querySelector("textarea"));
}

export function dropHeaderMenu() {
  const menu = document.querySelector(".chat-header-menu");
  if (menu.classList.contains("flex")) {
    menu.classList.remove("flex");
  } else {
    menu.classList.add("flex");
  }
}

export function closeHeaderMenu() {
  document.querySelector(".chat-header-menu").classList.remove("flex");
}
