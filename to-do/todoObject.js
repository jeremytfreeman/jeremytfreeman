//Get inpput field in the DOM
const inputField = document.getElementById("taskInput");

//Object to hold theme options values - {name: *.css}
const themes = {
  light: "light.css",
  dark: "dark.css",
  ocean: "ocean.css",
  //add more as needed
};

// TaskItem class to create and manage list items
class TaskItem {
  constructor(taskText, done = false) {
    this.taskText = taskText; //task text
    this.listItem = document.createElement("li"); //creates <li>
    this.listItem.classList.add("task"); //adds class
    this.listItemSpan = document.createElement("span"); //span to hold task text
    this.listItemSpan.setAttribute("contentEditable", "false"); //editable false
    this.buttonDiv = document.createElement("div"); //div to hold buttons
    this.buttonDiv.classList.add("buttonDiv");
    this.remove = document.createElement("i"); //remove icon
    this.doneButton = document.createElement("i"); //done icon
    this.done = done; // Stores state of task
  }

  // Method to create and return the list item
  createTask() {
    const taskNode = document.createTextNode(this.taskText);

    // Set up the remove button
    //this.remove.textContent = "Remove";
    this.remove.classList.add("fa-solid");
    this.remove.classList.add("fa-trash");
    this.remove.onclick = () => this.removeTask();

    // Set text state for done button
    //this.doneButton.textContent = "check";
    this.doneButton.classList.add("fa-solid");
    this.doneButton.classList.add("fa-check");
    this.doneButton.onclick = () => this.toggleDoneState();

    // Append the task text and button to the list item
    this.listItem.appendChild(this.listItemSpan);
    this.listItemSpan.appendChild(taskNode);
    this.listItem.appendChild(this.buttonDiv);
    this.buttonDiv.appendChild(this.doneButton);
    this.buttonDiv.appendChild(this.remove);
    this.updateTaskStyle();

    // Delay to fade in task items
    setTimeout(() => {
      this.listItem.classList.add("fade-in");
      this.listItem.classList.add("task-made");
    }, 10); // Slight delay

    return this.listItem;
  }

  // Method to remove the task from the DOM and local storage
  removeTask() {
    this.listItem.classList.remove("class-make");
    this.listItem.classList.add("fade-out"); // Apply fade out class
    setTimeout(() => {
      this.listItem.remove(); // Remove task after fade out
      TaskManager.removeTaskFromStorage(this.taskText); // Also remove from storage
    }, 500); // Match duration of fadeout class
  }

  // Method to mark task complete
  toggleDoneState() {
    this.done = !this.done;
    //this.doneButton.textContent = this.done ? "Undo" : "Done";
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
  //taskList.firstChild.classList.remove("task-make")

  // Add the task to the list and local storage
  TaskManager.addTaskToStorage(inputField.value); // Correctly use inputField.value

  // Clear the input field
  inputField.value = "";
}

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
});

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