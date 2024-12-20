// script.js

// Select DOM elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const logoutButton = document.getElementById("logout-button");

// Function to get the current logged-in user
function getCurrentUser() {
    const user = JSON.parse(localStorage.getItem("loggedInUser")) || JSON.parse(sessionStorage.getItem("loggedInUser"));
    return user ? user.email : null;
}

// Function to check authentication
function checkAuth() {
    const userEmail = getCurrentUser();
    if (!userEmail) {
        // Redirect to login page if not authenticated
        window.location.href = "/index.html";
    }
}

// Logout Function
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "/index.html";
});

// Call authentication check on page load
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    renderTasks();
});

// Add task on Enter key press
inputBox.addEventListener('keydown', function(event){
    if (event.key === 'Enter'){
        addTask();
    }
});

// Function to get tasks key based on user
function getTasksKey() {
    const userEmail = getCurrentUser();
    return userEmail ? `tasks_${userEmail}` : "tasks";
}

// Function to add a new task
function addTask() {
    const taskText = inputBox.value.trim();
    if (taskText === '') {
        swal("Oops!", "You must write something!", "warning");
        return;
    }

    const task = {
        text: taskText,
        completed: false,
        reminder: null,
        created: new Date().toISOString()
    };

    const tasks = loadTasks();
    tasks.push(task);
    saveTasks(tasks);
    renderTasks();
    inputBox.value = "";
}

// Function to load tasks from localStorage
function loadTasks(){
    try {
        const tasksKey = getTasksKey();
        return JSON.parse(localStorage.getItem(tasksKey)) || [];
    } catch (e) {
        console.error("Error loading tasks:", e);
        return [];
    }
}

// Function to save tasks to localStorage
function saveTasks(tasks){
    try {
        const tasksKey = getTasksKey();
        localStorage.setItem(tasksKey, JSON.stringify(tasks));
    } catch (e) {
        console.error("Error saving tasks:", e);
        alert("Failed to save tasks.");
    }
}

function renderTasks() {
    listContainer.innerHTML = "";
    const tasks = loadTasks();

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="task-content ${task.completed ? 'checked' : ''}">
                <span class="task-text">${task.text}</span>
                ${task.reminder ? `<span class="reminder-badge">⏰ ${formatReminder(task.reminder)}</span>` : ''}
            </div>
            <div class="task-actions">
                <button onclick="editTask(${index})" class="edit-button" title="Edit task">✎</button>
                <button onclick="setReminder(${index})" class="reminder-button" title="Set reminder">⏰</button>
                <button onclick="deleteTask(${index})" class="delete-button" title="Delete task">×</button>
            </div>
        `;

        if (task.completed) {
            li.classList.add("checked");
        }

        // Toggle completion on task content click
        const taskContent = li.querySelector('.task-content');
        taskContent.addEventListener('click', () => toggleTask(index));

        listContainer.appendChild(li);
    });
}
// Function to edit task
async function editTask(index) {
    const tasks = loadTasks();
    const task = tasks[index];

    const result = await swal({
        title: "Edit Task",
        content: {
            element: "input",
            attributes: {
                placeholder: "Edit your task",
                type: "text",
                value: task.text
            }
        },
        buttons: {
            cancel: true,
            confirm: true,
        },
    });

    if (result) {
        const newText = result.trim();
        if (newText) {
            tasks[index].text = newText;
            saveTasks(tasks);
            renderTasks();
            swal("Success!", "Task updated successfully!", "success");
        }
    }
}
// Function to set reminder
async function setReminder(index) {
    const tasks = loadTasks();
    const task = tasks[index];
    
    // Create a date input that's at least current time
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);
    
    const { value: reminderDate } = await swal({
        title: "Set Reminder",
        html: `
            <input type="datetime-local" 
                   id="reminder-datetime" 
                   class="swal-content__input" 
                   min="${minDateTime}"
                   value="${minDateTime}">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const datetime = document.getElementById('reminder-datetime').value;
            if (!datetime) {
                swal.showValidationMessage('Please select a date and time');
                return false;
            }
            return datetime;
        }
    });

    if (reminderDate) {
        tasks[index].reminder = reminderDate;
        saveTasks(tasks);
        renderTasks();
        scheduleReminder(task.text, reminderDate);
        swal("Success!", "Reminder set successfully!", "success");
    }
}

// Function to schedule reminder notification
function scheduleReminder(taskText, reminderDate) {
    const reminderTime = new Date(reminderDate).getTime();
    const now = new Date().getTime();
    const timeUntilReminder = reminderTime - now;

    if (timeUntilReminder > 0) {
        setTimeout(() => {
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("Task Reminder", {
                    body: `Don't forget: ${taskText}`,
                    icon: "/images/Bunny Background Remover.png"
                });
            } else {
                swal("Reminder", `Time to do task: ${taskText}`, "info");
            }
        }, timeUntilReminder);
    }
}

// Function to toggle task completion
function toggleTask(index) {
    const tasks = loadTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

// Function to delete task
function deleteTask(index) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this task!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            const tasks = loadTasks();
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks();
            swal("Success!", "Task deleted successfully!", "success");
        }
    });
}

// Helper function to format reminder date
function formatReminder(reminderDate) {
    const date = new Date(reminderDate);
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Request notification permission on page load
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    renderTasks();
    
    if ("Notification" in window) {
        Notification.requestPermission();
    }
});

// Event listener for clicks within the list container
listContainer.addEventListener("click", function(e) {
    const tasks = loadTasks();

    if (e.target.tagName === "LI") {
        const index = Array.from(listContainer.children).indexOf(e.target);
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
        renderTasks();
        e.target.classList.toggle("checked");

    } else if (e.target.tagName === "BUTTON" && e.target.classList.contains("delete-button")) {
        const index = parseInt(e.target.dataset.index, 10); // Convert to number
        if (!isNaN(index)) {
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
    }
}, false);
