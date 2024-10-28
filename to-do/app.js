import { TaskItem } from "./taskItem.js";
import { TaskManager } from "./taskManager.js";

//Get inpput field in the DOM
const inputField = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
addButton.style.visibility = "hidden";

// Function to add a new task
function addTask() {
  if (inputField.value === "") {
    const errorMessage = document.getElementById("errorMessage");
    //errorMessage.innerHTML = "Enter a task above";
    inputField.classList.add("fieldError");
    return;
  }

  // Create a new TaskItem object
  const newTask = new TaskItem(inputField.value);
  const taskList = document.getElementById("taskList");

  // Insert the new task at the top
  taskList.insertBefore(newTask.createTask(), taskList.firstChild);
  //add class to match input color and fade to same as other tasks
  taskList.firstChild.classList.add("task-make");
  setTimeout(() => {
    taskList.firstChild.classList.add("task-made"), 10;
  });

  // Add the task to the list and local storage
  TaskManager.addTaskToStorage(inputField.value); // Correctly use inputField.value

  // Clear the input field
  inputField.value = "";
}

// ----------Input field functionality -------------//
//Add task when user hits enter key
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // Prevent default form submission behavior (if applicable)
    event.preventDefault(); // Uncomment this if needed
    addTask();
  }
});

// Clears error when user inputs text into the input field
inputField.addEventListener("input", () => {
  if (inputField.value !== "") {
    inputField.classList.remove("fieldError");
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.innerHTML = "";
  }
});

//Clear error if inputField loses focus
inputField.addEventListener("blur", () => {
  inputField.classList.remove("fieldError");
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.innerHTML = "";
  addButton.style.visibility = "hidden";
});

//show add button when input field focus
inputField.addEventListener("focus", () => {
  addButton.style.visibility = "visible";
});

//----------Function to disable transitions
function disableTransitions(element) {
  element.style.transition = "none";
}

// Function to enable transitions
function enableTransitions(element) {
  element.style.transition = ""; // Revert to CSS-defined transitions
}

// Apply disable/enable when entering and leaving "drag-over"
document.querySelectorAll(".task").forEach((task) => {
  task.addEventListener("dragenter", () => disableTransitions(task));
  task.addEventListener("dragleave", () => enableTransitions(task));
  task.addEventListener("drop", () => enableTransitions(task)); // Re-enable after drop
});

//------------Theming----------//
// Switch themes
function switchTheme() {
  const styleSheet = document.getElementById("themeStylesheet");
  const currentTheme = styleSheet.getAttribute("href");

  // Set the href attribute based on the theme
  if (currentTheme.includes("dark.css")) {
    styleSheet.setAttribute("href", "light.css");
  } else {
    styleSheet.setAttribute("href", "dark.css");
  }

  // Store theme in localStorage
  localStorage.setItem("theme", styleSheet.getAttribute("href"));
}

// Function to load the theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  // If a theme was saved, apply it
  if (savedTheme) {
    document.getElementById("themeStylesheet").setAttribute("href", savedTheme);
  } else {
    document
      .getElementById("themeStylesheet")
      .setAttribute("href", "light.css"); // Default theme
  }
}

// Load tasks and theme from local storage when the page loads
window.onload = function () {
  TaskManager.loadTasks();
  loadTheme();
};
