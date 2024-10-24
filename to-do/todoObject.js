const inputField = document.getElementById("taskInput");

inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // Prevent default form submission behavior (if applicable)
    event.preventDefault(); // Uncomment this if needed
    addTask();
  }
});

// TaskItem class to create and manage list items
class TaskItem {
  constructor(taskText, done = false) {
    this.taskText = taskText;
    this.listItem = document.createElement("li");
    this.listItem.classList.add("task");
    this.buttonDiv = document.createElement("div");
    this.button = document.createElement("button");
    this.doneButton = document.createElement("button");
    this.done = done; // Stores state of task
  }

  // Method to create and return the list item
  createTask() {
    const taskNode = document.createTextNode(this.taskText);

    // Set up the remove button
    this.button.textContent = "Remove";
    this.button.onclick = () => this.removeTask();

    // Set text state for done button
    this.doneButton.textContent = this.done ? "Undo" : "Done";
    this.doneButton.onclick = () => this.toggleDoneState();

    // Append the task text and button to the list item
    this.listItem.appendChild(taskNode);
    this.listItem.appendChild(this.buttonDiv);
    this.buttonDiv.appendChild(this.doneButton);
    this.buttonDiv.appendChild(this.button);
    this.updateTaskStyle();

    // Delay to fade in task items
    setTimeout(() => {
      this.listItem.classList.add("fade-in");
    }, 10); // Slight delay

    return this.listItem;
  }

  // Method to remove the task from the DOM and local storage
  removeTask() {
    this.listItem.classList.add("fade-out"); // Apply fade out class
    setTimeout(() => {
      this.listItem.remove(); // Remove task after fade out
      TaskManager.removeTaskFromStorage(this.taskText); // Also remove from storage
    }, 500); // Match duration of fadeout class
  }

  // Method to mark task complete
  toggleDoneState() {
    this.done = !this.done;
    this.doneButton.textContent = this.done ? "Undo" : "Done";
    this.updateTaskStyle(); // Update style
    TaskManager.updateTaskInStorage(this.taskText, this.done); // Update local storage
  }

  updateTaskStyle() {
    if (this.done) {
      this.listItem.classList.add("done"); // Add class for "done" tasks
    } else {
      this.listItem.classList.remove("done");
    }
  }
}

// TaskManager class to handle local storage and task rendering
class TaskManager {
  static loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(({ taskText, done }) => {
      const task = new TaskItem(taskText, done);
      document.getElementById("taskList").appendChild(task.createTask());
    });
  }

  static addTaskToStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const done = false; // New tasks are not done by default
    tasks.unshift({ taskText, done }); // Push to the start of the array
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Update the task's done state in local storage
  static updateTaskInStorage(taskText, done) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.map((task) =>
      task.taskText === taskText ? { taskText, done } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  static removeTaskFromStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter((task) => task.taskText !== taskText); // Compare task text properly
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// Function to add a new task
function addTask() {
  const taskInput = document.getElementById("taskInput");
  if (taskInput.value === "") {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.innerHTML = "Enter a task above";
    taskInput.classList.add("fieldError");
    return;
  }

  // Create a new TaskItem object
  const newTask = new TaskItem(taskInput.value);
  const taskList = document.getElementById("taskList");

  // Insert the new task at the top
  taskList.insertBefore(newTask.createTask(), taskList.firstChild);

  // Add the task to the list and local storage
  TaskManager.addTaskToStorage(taskInput.value); // Correctly use taskInput.value

  // Clear the input field
  taskInput.value = "";
}

// Switches light/dark themes
function switchTheme() {
  const styleSheet = document.getElementById("themeStylesheet");
  const currentTheme = styleSheet.getAttribute("href");

  // Set the href attribute based on the theme
  if (currentTheme.includes("dark.css")) {
    styleSheet.setAttribute("href", "light.css");
  } else {
    styleSheet.setAttribute("href", "dark.css");
  }

  // Store the theme in localStorage
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

// Clears error when user inputs text into the input field
const taskInput = document.getElementById("taskInput");
taskInput.addEventListener("input", () => {
  if (taskInput.value !== "") {
    taskInput.classList.remove("fieldError");
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.innerHTML = "";
  }
});

// Load tasks and theme from local storage when the page loads
window.onload = function () {
  TaskManager.loadTasks();
  loadTheme();
};
