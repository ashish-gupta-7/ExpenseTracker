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
        <button class="delete-btn" onclick="deleteExpense(${expense.id})">X</button>`;
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
