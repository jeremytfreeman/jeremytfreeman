class TaskItem {
  constructor(taskText, done = false, id) {
    this.taskText = taskText; //task text
    this.done = done; // Stores state of task
    this.id = id || Date.now(); //unique ID if not provided
    this.listItem = document.createElement("li"); //creates <li>
    this.listItem.classList.add("task"); //adds class
    this.listItem.setAttribute("draggable", true); //make draggable
    this.listItemSpan = document.createElement("span"); //span to hold task text
    this.listItemSpan.setAttribute("contentEditable", "false"); //editable false
    this.buttonDiv = document.createElement("div"); //div to hold buttons
    this.buttonDiv.classList.add("buttonDiv"); //add class to buttonDiv
    this.remove = document.createElement("i"); //remove icon
    this.doneButton = document.createElement("i"); //done icon

    // Add drag event listeners for visual changes on hover
    this.listItem.addEventListener("dragenter", (e) => {
      e.preventDefault();
      this.listItem.classList.add("drag-over");
    });
    this.listItem.addEventListener("dragover", (e) => {
      e.preventDefault(); // Necessary to allow the drop
    });
    this.listItem.addEventListener("dragleave", () => {
      console.log(this.listItem.id + "drag leave");
      this.listItem.classList.remove("drag-over");
    });
    this.listItem.addEventListener("drop", () => {
      this.listItem.classList.remove("drag-over");
    });

    // Add event listener to enable editing on click
    this.listItemSpan.addEventListener("click", () => this.enableEditing());

    // Add drag event listeners
    this.listItem.addEventListener("dragstart", (event) => {
      this.listItem.classList.add("dragging"); // Apply dragging styles
      event.dataTransfer.setData("text/plain", this.id); // Store the task ID in the drag event
      event.dataTransfer.effectAllowed = "move";
    });

    this.listItem.addEventListener("dragover", (event) => {
      event.preventDefault(); // Enable dropping by preventing the default
    });

    this.listItem.addEventListener("dragend", () => {
      this.listItem.classList.remove("dragging"); // Remove dragging styles
    });

    this.listItem.addEventListener("drop", (event) => {
      event.preventDefault();
      const draggedTaskId = event.dataTransfer.getData("text/plain"); // Retrieve dragged task ID
      TaskManager.reorderTasks(draggedTaskId, this.id); // Reorder tasks in the TaskManager
    });
  }

  // Method to enable edit mode
  enableEditing() {
    this.listItemSpan.setAttribute("contentEditable", true);
    this.listItem.setAttribute("draggable", false);
    this.listItemSpan.focus();
    this.listItemSpan.addEventListener("blur", () => this.saveEdit());
    this.listItemSpan.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.saveEdit();
      }
    });
  }

  // Save the edited task text and disable editing
  saveEdit() {
    this.listItem.setAttribute("draggable", true);
    this.taskText = this.listItemSpan.textContent.trim(); // Update task text with new content
    this.listItemSpan.setAttribute("contenteditable", "false");
    //this.saveButton.style.display = "none"; // Hide save button
    TaskManager.updateTaskInStorage(this.id, this.taskText, this.done); //storage
    this.originalText = this.taskText;
  }

  // Method to create and return the list item
  createTask() {
    const taskNode = document.createTextNode(this.taskText);

    // Set up the remove button
    this.remove.classList.add("fa-solid");
    this.remove.classList.add("fa-trash");
    this.remove.onclick = () => this.removeTask();

    // Set text state for done button
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
      TaskManager.removeTaskFromStorage(this.id); // Also remove from storage
    }, 800); // Match duration of fadeout class
  }

  // Method to mark task complete
  toggleDoneState() {
    this.done = !this.done;
    //this.doneButton.textContent = this.done ? "Undo" : "Done";
    this.updateTaskStyle(); // Update style
    TaskManager.updateTaskInStorage(this.id, this.taskText, this.done); // Update local storage
  }

  // Set task to done state
  updateTaskStyle() {
    if (this.done) {
      this.listItem.classList.add("done"); // Add class for "done" tasks
    } else {
      this.listItem.classList.remove("done");
    }
  }
}
