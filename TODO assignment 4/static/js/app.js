document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

let currentFilter = "all";

async function loadTasks() {
    try {
        let url = "/api/tasks";
        if (currentFilter !== "all") {
            url += `?status=${currentFilter}`;
        }

        const res = await fetch(url);
        const tasks = await res.json();

        renderTasks(tasks);
        updateCounter();

    } catch (err) {
        alert("Error loading tasks");
    }
}

function renderTasks(tasks) {
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    if (tasks.length === 0) {
        list.innerHTML = "<p>No tasks yet!</p>";
        return;
    }

    tasks.forEach(t => {
        const div = document.createElement("div");
        div.className = `task ${t.completed ? "done" : ""}`;

        div.innerHTML = `
            <h3>${t.title}</h3>
            <p>${t.description}</p>

            <span class="badge ${t.priority}">${t.priority}</span>

            <button onclick="toggleTask(${t.id})">✔</button>
            <button onclick="deleteTask(${t.id})">DELETE</button>
            <button onclick="editTask(${t.id})">EDIT</button>
        `;

        list.appendChild(div);
    });
}

async function addTask() {
    try {
        const title = document.getElementById("title").value;
        const desc = document.getElementById("desc").value;
        const priority = document.getElementById("priority").value;

        if (!title) {
            alert("Title required");
            return;
        }

        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description: desc, priority })
        });

        loadTasks();

    } catch {
        alert("Error adding task");
    }
}

async function deleteTask(id) {
    try {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        loadTasks();
    } catch {
        alert("Error deleting task");
    }
}

async function toggleTask(id) {
    try {
        await fetch(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
        loadTasks();
    } catch {
        alert("Error toggling");
    }
}

async function editTask(id) {
    const newTitle = prompt("Enter new title:");
    if (!newTitle) return;

    await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
    });

    loadTasks();
}

function filterTasks(status) {
    currentFilter = status;
    loadTasks();
}

async function updateCounter() {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;

    document.getElementById("counter").innerText =
        `Total: ${total} | Active: ${active} | Done: ${completed}`;
}