const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Add task on Enter key press
inputBox.addEventListener('keypress', function(event){
    if (event.key === 'Enter'){
        addTask();
    }
});

// Function to add a new task
function addTask(){
    if (inputBox.value === ''){
        alert("You must write something!");
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData();
}

// Event listener for clicks within the list container
listContainer.addEventListener("click", function(e) {
    if(e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    }
    else if (e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
}, false);

// Function to save tasks to localStorage
function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

// Function to load tasks from localStorage
function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();
