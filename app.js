const CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Utilities',
  'Entertainment', 'Health', 'Shopping', 'Other'
];

async function getExpenses() {
  const res = await fetch('/api/expenses');
  return res.json();
}

async function getExpenseById(id) {
  const res = await fetch('/api/expenses/' + id);
  return res.ok ? res.json() : null;
}

async function addExpense(expense) {
  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense)
  });
  return res.ok;
}

async function updateExpense(id, updates) {
  const res = await fetch('/api/expenses/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.ok;
}

async function deleteExpense(id) {
  await fetch('/api/expenses/' + id, { method: 'DELETE' });
}

function formatCurrency(amount) {
  return '$' + Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}