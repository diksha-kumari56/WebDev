document.getElementById("addBtn").addEventListener("click", addTask);

function addTask() {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    let li = document.createElement("li");

    let span = document.createElement("span");
    span.innerText = taskText;

    // Mark complete
    span.onclick = function () {
        span.classList.toggle("completed");
    };

    let actions = document.createElement("div");
    actions.classList.add("actions");

    // Edit button
    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("edit");

    editBtn.onclick = function () {
        let newTask = prompt("Edit your task:", span.innerText);
        if (newTask !== null && newTask.trim() !== "") {
            span.innerText = newTask;
        }
    };

    // Delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";

    deleteBtn.onclick = function () {
        li.remove();
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);

    document.getElementById("taskList").appendChild(li);

    input.value = "";
}