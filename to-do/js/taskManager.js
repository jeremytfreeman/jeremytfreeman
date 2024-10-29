//taskManager.js
console.log("taskManager is loaded");

import { TaskItem } from "./taskModule.js";

console.log("taskManager has loaded" + TaskItem);

export class TaskManager {
  static reorderTasks(draggedTaskId, targetTaskId) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const draggedIndex = tasks.findIndex(
      (task) => task.id === parseInt(draggedTaskId)
    );
    const targetIndex = tasks.findIndex(
      (task) => task.id === parseInt(targetTaskId)
    );

    if (
      draggedIndex === -1 ||
      targetIndex === -1 ||
      draggedIndex === targetIndex
    )
      return;

    // Remove dragged task and insert at the target position
    const [draggedTask] = tasks.splice(draggedIndex, 1);
    tasks.splice(targetIndex, 0, draggedTask);

    // Update the local storage with the new order
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Re-render tasks in the new order
    document.getElementById("taskList").innerHTML = ""; // Clear current tasks
    tasks.forEach(({ id, taskText, done }) => {
      const task = new TaskItem(taskText, done, id);
      document.getElementById("taskList").appendChild(task.createTask());
    });
  }

  static loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(({ id, taskText, done }) => {
      const task = new TaskItem(taskText, done, id);
      document.getElementById("taskList").appendChild(task.createTask());
    });
  }

  static addTaskToStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const task = { taskText, done: false, id: Date.now() };
    tasks.unshift(task); // Add task to beginning of array
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Update the task's done state in local storage
  static updateTaskInStorage(id, taskText, done) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, taskText, done } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  static removeTaskFromStorage(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}
