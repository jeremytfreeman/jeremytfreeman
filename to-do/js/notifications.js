// notifications.js

import { inputField } from "./app.js";

export function clearError(element, placeholder) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.innerHTML = "";
  element.classList.remove("fieldError");
  element.setAttribute("placeholder", placeholder);
}

export function showError(element, message) {
  element.classList.add("fieldError");
  element.setAttribute("placeholder", message);
}
