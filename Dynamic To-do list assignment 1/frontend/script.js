const API = "http://localhost:3000/tasks";

async function loadTasks() {

const res = await fetch(API);
const tasks = await res.json();

const list = document.getElementById("taskList");
list.innerHTML="";

let completed=0;

tasks.forEach(task => {

if(task.isDone) completed++;

const li=document.createElement("li");

if(task.isDone) li.classList.add("completed");

li.innerHTML=`

<input type="checkbox" ${task.isDone ? "checked":""}
onclick="toggleTask(${task.id})">

<span>${task.title} (${task.priority})</span>

<div>

<button onclick="editTask(${task.id},'${task.title}','${task.priority}')">EDIT</button>

<button onclick="deleteTask(${task.id})">DELETE</button>

</div>

`;

list.appendChild(li);

});

document.getElementById("counter").innerText =
`Completed ${completed} / ${tasks.length}`;

}

async function addTask(){

const title=document.getElementById("title").value;
const priority=document.getElementById("priority").value;

if(title.trim()==""){
alert("Task cannot be empty");
return;
}

await fetch(API,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({title,priority})
});

document.getElementById("title").value="";
loadTasks();
}

async function toggleTask(id){

await fetch(`${API}/${id}/status`,{
method:"PATCH"
});

loadTasks();
}

async function deleteTask(id){

await fetch(`${API}/${id}`,{
method:"DELETE"
});

loadTasks();
}

async function editTask(id,title,priority){

const newTitle = prompt("Edit task title:",title);

if(!newTitle) return;

await fetch(`${API}/${id}`,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
title:newTitle,
priority:priority
})
});

loadTasks();
}

window.onload = loadTasks;