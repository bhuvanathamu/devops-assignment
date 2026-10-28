// script.js
// Daily Expense Tracker functionality
// Uses Local Storage to persist data across page reloads.

// -----------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------

/**
 * Retrieve the expense list from local storage.
 * Returns an array of expense objects. If none exist, returns []
 */
function getExpenses() {
  const data = localStorage.getItem('expenses');
  return data ? JSON.parse(data) : [];
}

/**
 * Save the provided expense array to local storage.
 * @param {Array} expenses
 */
function saveExpenses(expenses) {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

/**
 * Render the expense table rows based on current data.
 */
function renderExpenses() {
  const tbody = document.querySelector('#expenses-table tbody');
  tbody.innerHTML = '';
  const expenses = getExpenses();
  let total = 0;
  expenses.forEach((exp, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${exp.name}</td>
      <td>$${Number(exp.amount).toFixed(2)}</td>
      <td>${exp.category}</td>
      <td>${exp.date}</td>
      <td><button class="action-btn" data-index="${index}" title="Delete"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tbody.appendChild(tr);
    total += Number(exp.amount);
  });
  document.getElementById('total-amount').textContent = total.toFixed(2);
}

/**
 * Add a new expense to storage and re‑render.
 */
function addExpense(expense) {
  const expenses = getExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
  renderExpenses();
}

/**
 * Delete an expense by its array index.
 */
function deleteExpense(index) {
  const expenses = getExpenses();
  expenses.splice(index, 1);
  saveExpenses(expenses);
  renderExpenses();
}

// -----------------------------------------------------------------
// Event listeners
// -----------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  renderExpenses();

  const form = document.getElementById('expense-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (!name || !amount || !category || !date) {
      // Basic validation – the HTML `required` attributes already help.
      return;
    }

    addExpense({ name, amount, category, date });
    form.reset();
  });

  // Delegated click for delete buttons (event bubbling)
  document.querySelector('#expenses-table tbody').addEventListener('click', (e) => {
    if (e.target.closest('button.action-btn')) {
      const btn = e.target.closest('button.action-btn');
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      deleteExpense(idx);
    }
  });
});
