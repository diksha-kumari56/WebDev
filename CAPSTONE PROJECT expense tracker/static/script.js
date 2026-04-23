const balance = document.getElementById("balance");
const list = document.getElementById("list");
const form = document.getElementById("transaction-form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");

const initialBalanceInput = document.getElementById("initial-balance");
const totalBalanceDisplay = document.getElementById("total-balance");
const moneySpentDisplay = document.getElementById("money-spent");

let transactions = [];
let totalBalance = 0;

let chart;
let monthlyChart;

// ================= LOAD TRANSACTIONS =================
async function loadTransactions(){
    let res = await fetch("/get_transactions");
    transactions = await res.json();
    updateUI();
}

// ================= SET BALANCE =================
function setBalance(){
    totalBalance = +initialBalanceInput.value;
    totalBalanceDisplay.innerText = "₹" + totalBalance;
    updateUI();
}

// ================= ADD TRANSACTION =================
async function addTransaction(e){
    e.preventDefault();

    const t = {
        text: text.value,
        amount: +amount.value,
        category: category.value
    };

    await fetch("/add_transaction", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(t)
    });

    loadTransactions();

    text.value = "";
    amount.value = "";
}

// ================= UPDATE UI =================
function updateUI(){
    list.innerHTML = "";

    transactions.forEach(t => {
        const li = document.createElement("li");
        li.innerHTML = `${t.text} (${t.category}) ₹${t.amount}
        <button onclick="removeTransaction(${t.id})">X</button>`;
        list.appendChild(li);
    });

    let spent = transactions
        .filter(t => t.amount < 0)
        .reduce((a, b) => a + Math.abs(b.amount), 0);

    moneySpentDisplay.innerText = "₹" + spent;
    balance.innerText = "₹" + (totalBalance - spent);

    // ================= INSIGHTS =================
    let categoryMap = {};

    transactions.forEach(t => {
        if(t.amount < 0){
            categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount);
        }
    });

    let topCategory = "No data";
    let max = 0;

    for(let cat in categoryMap){
        if(categoryMap[cat] > max){
            max = categoryMap[cat];
            topCategory = cat;
        }
    }

    document.getElementById("top-category").innerText =
        max > 0 ? `You spent most on: ${topCategory} (₹${max})` : "No data";

    updateChart(categoryMap);
    updateMonthlyChart();
}

// ================= DELETE =================
async function removeTransaction(id){
    await fetch(`/delete_transaction/${id}`, {
        method: "DELETE"
    });

    loadTransactions();
}

form.addEventListener("submit", addTransaction);

// ================= PIE CHART =================
function updateChart(categoryMap){
    const canvas = document.getElementById("chart");
    if (!canvas) return;

    const labels = Object.keys(categoryMap);
    const data = Object.values(categoryMap);

    if (labels.length === 0) {
        if (chart) chart.destroy();
        return;
    }

    const ctx = canvas.getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    "#ef4444",
                    "#3b82f6",
                    "#10b981",
                    "#f59e0b",
                    "#8b5cf6"
                ]
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                }
            }
        }
    });
}

// ================= MONTHLY CHART =================
function updateMonthlyChart(){
    const canvas = document.getElementById("monthlyChart");
    if (!canvas) return;

    let monthlyData = Array(12).fill(0);

    transactions.forEach(t => {
        if (t.amount < 0) {
            let date = new Date(t.id);
            let month = date.getMonth();
            monthlyData[month] += Math.abs(t.amount);
        }
    });

    const labels = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const ctx = canvas.getContext("2d");

    if (monthlyChart) monthlyChart.destroy();

    monthlyChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Monthly Spending",
                data: monthlyData,
                backgroundColor: "#6366f1"
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#ffffff" }
                },
                y: {
                    ticks: { color: "#ffffff" }
                }
            }
        }
    });
}

// ================= INITIAL LOAD =================
loadTransactions();