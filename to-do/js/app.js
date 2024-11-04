//app.js

import {
  fetchThemes,
  applyTheme,
  changeTheme,
  loadSavedTheme,
  cycleThemes,
} from "./theming.js";
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
      showError(inputField, "I'm gonna need you to go ahead and write a task");
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
  clearError(inputField, "Let's add some tasks");
});

// Show add button when input field focus
inputField.addEventListener("focus", () => {
  addButton.style.visibility = "visible";
});

// Event listener to a theme button
document.getElementById("themeBtn").addEventListener("click", cycleThemes);

//window.loadTheme = loadTheme;

// Load the saved theme on page load
document.addEventListener("DOMContentLoaded", async () => {
  const savedTheme = localStorage.getItem("selectedTheme") || "Mitternacht"; // Default to "Mitternacht"
  const themes = await fetchThemes(); // Fetch all themes
  if (themes && themes[savedTheme]) {
    applyTheme(themes[savedTheme]); // Apply the saved theme
  } else {
    console.error(`Theme "${savedTheme}" not found`);
  }
});

// Load tasks and theme from local storage when the page loads
window.onload = function () {
  TaskManager.loadTasks();
  inputField.focus();
  //loadTheme();
};
