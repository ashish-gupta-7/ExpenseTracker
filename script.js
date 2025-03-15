document.addEventListener("DOMContentLoaded", loadExpenses);

const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("expense-name").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;

    if (name && amount) {
        const expense = { id: Date.now(), name, amount, category };
        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));

        addExpenseToList(expense);
        updateTotal();
        expenseForm.reset();
    }
});

function addExpenseToList(expense) {
    const li = document.createElement("li");
    li.innerHTML = `${expense.name} - ₹${expense.amount} <small>(${expense.category})</small>
        <button class="edit-btn" onclick="editExpense(${expense.id})">✏️</button>
        <button class="delete-btn" onclick="deleteExpense(${expense.id})">❌</button>`;
    expenseList.appendChild(li);
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
}

function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = total;
}

function loadExpenses() {
    expenseList.innerHTML = "";
    expenses.forEach(addExpenseToList);
    updateTotal();
}

function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);

    document.getElementById("expense-name").value = expense.name;
    document.getElementById("expense-amount").value = expense.amount;
    document.getElementById("expense-category").value = expense.category;

    // Remove the expense from the list temporarily
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
}

document.getElementById("filter-category").addEventListener("change", filterExpenses);

function filterExpenses() {
    const selectedCategory = document.getElementById("filter-category").value;
    const filteredExpenses = selectedCategory === "All"
        ? expenses
        : expenses.filter(expense => expense.category === selectedCategory);

    expenseList.innerHTML = "";
    filteredExpenses.forEach(addExpenseToList);
}

let expenseChart;

function updateChart() {
    const categories = ["Food", "Transport", "Entertainment", "Shopping", "Other"];
    const categoryTotals = categories.map(category =>
        expenses.filter(exp => exp.category === category)
                .reduce((sum, exp) => sum + exp.amount, 0)
    );

    if (expenseChart) {
        expenseChart.destroy(); // Destroy old chart before updating
    }

    const ctx = document.getElementById("expenseChart").getContext("2d");
    expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                data: categoryTotals,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"]
            }]
        }
    });
}

// Call updateChart whenever expenses are added or deleted
expenseForm.addEventListener("submit", function () {
    setTimeout(updateChart, 100); // Delay to allow UI update
});
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
    updateChart();
}

let monthlyExpenseChart;

function updateMonthlyChart() {
    const monthlyTotals = {};

    expenses.forEach(expense => {
        const date = new Date(expense.id); // Using ID (timestamp) as date
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format: YYYY-MM

        if (!monthlyTotals[month]) {
            monthlyTotals[month] = 0;
        }
        monthlyTotals[month] += expense.amount;
    });

    const months = Object.keys(monthlyTotals).sort();
    const totals = months.map(month => monthlyTotals[month]);

    if (monthlyExpenseChart) {
        monthlyExpenseChart.destroy(); // Destroy old chart before updating
    }

    const ctx = document.getElementById("monthlyExpenseChart").getContext("2d");
    monthlyExpenseChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: months,
            datasets: [{
                label: "Total Expenses (₹)",
                data: totals,
                backgroundColor: "#4bc0c0"
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Call updateMonthlyChart whenever expenses are added or deleted
expenseForm.addEventListener("submit", function () {
    setTimeout(updateMonthlyChart, 100);
});
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
    updateChart();
    updateMonthlyChart();
}
