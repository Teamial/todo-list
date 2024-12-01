// Select DOM elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Load and render tasks on page load
document.addEventListener("DOMContentLoaded", renderTasks);

// Add task on Enter key press
inputBox.addEventListener('keydown', function(event){
    if (event.key === 'Enter'){
        addTask();
    }
});

// Function to add a new task
function addTask(){
    const taskText = inputBox.value.trim();
    if (taskText === ''){
        alert("You must write something!");
    }
    else{
        const task = {
            text: taskText,
            completed: false
        };
        const tasks = loadTasks();
        tasks.push(task);
        saveTasks(tasks);
        renderTasks();
    }
    inputBox.value = "";
}

// Function to load tasks from localStorage
function loadTasks(){
    try {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch (e) {
        console.error("Error loading tasks:", e);
        return [];
    }
}

// Function to save tasks to localStorage
function saveTasks(tasks){
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
        console.error("Error saving tasks:", e);
        alert("Failed to save tasks.");
    }
}

// Function to toggle the checked state
function toggleCheck(index) {
    const tasks = loadTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

// Function to delete a task
function deleteTask(index) {
    const tasks = loadTasks();
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this task!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            tasks.splice(index, 1); // Remove the task
            saveTasks(tasks); // Save updated tasks
            renderTasks(); // Rerender the tasks
            swal("Poof! Your task has been deleted!", {
                icon: "success",
            });
        } else {
            swal("Your task is safe!");
        }
    });
}

// Function to render tasks
function renderTasks() {
    listContainer.innerHTML = ""; // Clear the current list
    const tasks = loadTasks();

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        if (task.completed) {
            li.classList.add("checked");
        }

        // Create the checkmark span
        const checkmark = document.createElement("span");
        checkmark.classList.add("checkmark");
        checkmark.addEventListener("click", function(e) {
            e.stopPropagation(); // Prevent the click from bubbling up to the li
            toggleCheck(index);
        });

        // Create the task text span
        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;

        // Create the delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "\u00d7"; // Unicode for ×
        deleteBtn.classList.add("delete-button");
        deleteBtn.dataset.index = index; // Properly set data-index
        deleteBtn.addEventListener("click", function(e) {
            e.stopPropagation(); // Prevent the click from bubbling up to the li
            deleteTask(index);
        });

        // Append elements to the li
        li.appendChild(checkmark);
        li.appendChild(taskText);
        li.appendChild(deleteBtn);

        // Append the li to the list container
        listContainer.appendChild(li);
    });
}
