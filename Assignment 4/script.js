const API_URL = "http://localhost:3000/transactions";

let editId = null;

// ===============================
// Load data when page loads
// ===============================
window.onload = function () {
  fetchTransactions();
};

// ===============================
// Fetch all transactions (GET)
// ===============================
function fetchTransactions() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      renderTable(data);
    })
    .catch(error => console.log("Error:", error));
}

// ===============================
// Add new transaction (POST)
// ===============================
function addTransaction() {

  let date = document.getElementById("date").value;
  let description = document.getElementById("description").value;
  let credit = parseFloat(document.getElementById("credit").value) || 0;
  let debit = parseFloat(document.getElementById("debit").value) || 0;

  // Validation
  if (credit > 0 && debit > 0) {
    alert("Enter either Credit OR Debit, not both.");
    return;
  }

  if (credit === 0 && debit === 0) {
    alert("Please enter an amount.");
    return;
  }

  let transaction = {
    date: date,
    description: description,
    credit: credit,
    debit: debit
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(transaction)
  })
  .then(response => response.json())
  .then(() => {
    fetchTransactions();
    clearInputs();
  })
  .catch(error => console.log("Error:", error));
}

// ===============================
// Render table
// ===============================
function renderTable(data) {

  let tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  let totalCredit = 0;
  let totalDebit = 0;

  data.forEach(t => {

    totalCredit += t.credit;
    totalDebit += t.debit;

    // If this row is in edit mode
    if (editId === t.id) {

      tbody.innerHTML += `
        <tr>
          <td><input type="date" id="editDate" value="${t.date}"></td>
          <td><input type="text" id="editDesc" value="${t.description}"></td>
          <td><input type="number" id="editCredit" value="${t.credit}"></td>
          <td><input type="number" id="editDebit" value="${t.debit}"></td>
          <td>
            <button class="btn btn-success btn-sm" onclick="saveEdit(${t.id})">Save</button>
            <button class="btn btn-secondary btn-sm" onclick="cancelEdit()">Cancel</button>
          </td>
        </tr>
      `;

    } else {

      tbody.innerHTML += `
        <tr>
          <td>${t.date}</td>
          <td>${t.description}</td>
          <td>${t.credit}</td>
          <td>${t.debit}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editRow(${t.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRow(${t.id})">Delete</button>
          </td>
        </tr>
      `;
    }
  });

  // Update totals
  document.getElementById("totalCredit").innerText = totalCredit;
  document.getElementById("totalDebit").innerText = totalDebit;
  document.getElementById("balance").innerText = totalCredit - totalDebit;
}

// ===============================
// Edit row
// ===============================
function editRow(id) {
  editId = id;
  fetchTransactions();
}

// ===============================
// Cancel edit
// ===============================
function cancelEdit() {
  editId = null;
  fetchTransactions();
}

// ===============================
// Save edited row (PUT)
// ===============================
function saveEdit(id) {

  let date = document.getElementById("editDate").value;
  let description = document.getElementById("editDesc").value;
  let credit = parseFloat(document.getElementById("editCredit").value) || 0;
  let debit = parseFloat(document.getElementById("editDebit").value) || 0;

  if (credit > 0 && debit > 0) {
    alert("Enter either Credit OR Debit, not both.");
    return;
  }

  if (credit === 0 && debit === 0) {
    alert("Please enter an amount.");
    return;
  }

  let updatedTransaction = {
    id: id,
    date: date,
    description: description,
    credit: credit,
    debit: debit
  };

  fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedTransaction)
  })
  .then(response => response.json())
  .then(() => {
    editId = null;
    fetchTransactions();
  })
  .catch(error => console.log("Error:", error));
}

// ===============================
// Delete row (DELETE)
// ===============================
function deleteRow(id) {

  fetch(API_URL + "/" + id, {
    method: "DELETE"
  })
  .then(response => response.json())
  .then(() => {
    fetchTransactions();
  })
  .catch(error => console.log("Error:", error));
}

// ===============================
// Clear form inputs
// ===============================
function clearInputs() {
  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
  document.getElementById("credit").value = "";
  document.getElementById("debit").value = "";
}