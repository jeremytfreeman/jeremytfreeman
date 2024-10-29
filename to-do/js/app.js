//app.js

import { switchTheme, loadTheme } from "./theming.js";
import { TaskManager, addTask } from "./taskModule.js";
import { clearError, showError } from "./notifications.js";

// Get input field in the DOM, export for other modules
export const inputField = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");

addButton.style.visibility = "hidden";

// Event listener to add new tasks with button
addButton.addEventListener("click", () => {
  if (inputField.value === "") {
    showError(inputField);
    return;
  } else {
    addTask(inputField.value);
    inputField.value = ""; // Reset field
    inputField.focus(); // Set input field back to focus
  }
});

// Add task when user hits enter key
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // Error if field is empty
    if (inputField.value === "") {
      showError(inputField, "Enter a task!");
      return;
    } else {
      // Prevent default form submission behavior (if applicable)
      event.preventDefault(); // Uncomment this if needed
      addTask(inputField.value);
      inputField.value = ""; // Clear the input field
    }
  }
});

// Clears error when user inputs text into the input field
inputField.addEventListener("input", () => {
  if (inputField.value !== "") {
    clearError(inputField, "Add a new task here");
  }
});

// Clear error if inputField loses focus
inputField.addEventListener("blur", () => {
  // Hide button if field is empty
  if (inputField.value === "") {
    addButton.style.visibility = "hidden";
  }
  clearError(inputField, "Add a new task here");
});

// Show add button when input field focus
inputField.addEventListener("focus", () => {
  addButton.style.visibility = "visible";
});

// Function to disable transitions
function disableTransitions(element) {
  element.style.transition = "none";
}

// Function to enable transitions
function enableTransitions(element) {
  element.style.transition = ""; // Revert to CSS-defined transitions
}

window.loadTheme = loadTheme;

// Load tasks and theme from local storage when the page loads
window.onload = function () {
  TaskManager.loadTasks();
  loadTheme();
};
