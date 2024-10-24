// Function to load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${task}<span onclick="taskComplete(${index})"> x </span><button onclick="removeTask(${index})">Remove</button>`; //create each task with a remove button
    todoList.appendChild(li);
  });
}

// Function to add a new task to the list
function addTask() {
  //get value of the taskinput field
  const taskInput = document.getElementById("taskInput").value;
  if (taskInput === "") {
    alert("Please enter a task"); //alert if field is empty
    return;
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskInput); //add new task to JSON
  console.log(tasks);
  localStorage.setItem("tasks", JSON.stringify(tasks)); //convert back to JSON

  document.getElementById("taskInput").value = ""; // Clear input field
  loadTasks(); // Reload the tasks
}

function taskComplete(index) {
  const taskItem = document.querySelectorAll("li")[index];
  taskItem.classList.add("complete");
  console.log("complete");
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
