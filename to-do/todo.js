// Function to load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${task} <button onclick="removeTask(${index})">Remove</button>`;
    todoList.appendChild(li);
  });
}

// Function to add a new task to the list
function addTask() {
  const taskInput = document.getElementById("taskInput").value;
  if (taskInput === "") {
    alert("Please enter a task");
    return;
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskInput);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskInput").value = ""; // Clear input field
  loadTasks(); // Reload the tasks
}

// Function to remove a task from the list
function removeTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks(); // Reload the tasks
}

// Load tasks when the page loads
window.onload = loadTasks;
