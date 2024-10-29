import { inputField } from "./app.js";

export function clearError(element) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.innerHTML = "";
  element.classList.remove("fieldError");
}

export function showError(element) {
  element.classList.add("fieldError");
}
