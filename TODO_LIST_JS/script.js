const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Add task on Enter key press
inputBox.addEventListener('keydown', function(event){
    if (event.key === 'Enter'){
        addTask();
    }
});


// Function to add a new task
function addTask(){
    const taskText = inputBox.value.trim();
    if (taskText.value === ''){
        alert("You must write something!");
    }
    else{
        const task = {
            text: taskText,
            completed: false
        };
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
    inputBox.value = "";

}

function renderTasks(){
    listContainer.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.textContent = task.text;
        if(task.completed){
            li.classList.add("checked");
        }

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "\u00d7";
        deleteBtn.setAttribute('data-index', index);
        deleteBtn.className = "delete-button";

        li.appendChild(deleteBtn);
        listContainer.appendChild(li);
    });
}


// Event listener for clicks within the list container
listContainer.addEventListener("click", function(e) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if(e.target.tagName === "LI") {
        const index = Array.from(listContainer.children).indexOf(e.target);
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        e.target.classList.toggle("checked");
    }
    else if (e.target.tagName === "BUTTON"){
        const index = e.target.getAttribute('data-index');
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this task!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                tasks.splice(index, 1);
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderTasks();
                swal("Poof! Your task has been deleted!", {
                    icon: "success",
                });
            } else {
                swal("Your task is safe!");
            }
        });
    }
}, false);

// Function to load tasks from localStorage
function showTask(){
    listContainer.textContent = localStorage.getItem("data");
}
showTask();
