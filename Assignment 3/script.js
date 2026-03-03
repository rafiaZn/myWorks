let transactions = JSON.parse(localStorage.getItem("transactions")) || []

// Render table on load
renderTable()

function addTransaction() {

  let date = document.getElementById("date").value
  let header = document.getElementById("header").value
  let credit = parseFloat(document.getElementById("credit").value) || ""
  let debit = parseFloat(document.getElementById("debit").value) || ""

  if (!date || !header) {
    alert("Date and Header required")
    return
  }

  if ((credit > 0 && debit > 0) || (credit === 0 && debit === 0)) {
    alert("Enter either Credit or Debit only")
    return
  }

  let transaction = {
    id: Date.now(),
    date,
    header,
    credit,
    debit
  }

  transactions.push(transaction)
  saveToLocal()
  renderTable()
  clearInputs()
}

function renderTable() {
  let tbody = document.getElementById("tableBody")
  tbody.innerHTML = ""

  transactions.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.id}</td>
        <td>${t.date}</td>
        <td>${t.header}</td>
        <td>${t.credit}</td>
        <td>${t.debit}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="openEdit(${t.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${t.id})">Delete</button>
        </td>
      </tr>
    `
  })

  updateTotals()
}

function updateTotals() {
  let totalCredit = 0
  let totalDebit = 0

  transactions.forEach(t => {
    totalCredit += t.credit
    totalDebit += t.debit
  })

  document.getElementById("totalCredit").innerText = totalCredit
  document.getElementById("totalDebit").innerText = totalDebit
  document.getElementById("balance").innerText = totalCredit - totalDebit
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id)
  saveToLocal()
  renderTable()
}

function openEdit(id) {
  let t = transactions.find(t => t.id === id)

  document.getElementById("editId").value = t.id
  document.getElementById("editDate").value = t.date
  document.getElementById("editHeader").value = t.header
  document.getElementById("editCredit").value = t.credit
  document.getElementById("editDebit").value = t.debit

  document.getElementById("editPanel").classList.add("active")
}

function saveEdit() {
  let id = parseInt(document.getElementById("editId").value)
  let date = document.getElementById("editDate").value
  let header = document.getElementById("editHeader").value
  let credit = parseFloat(document.getElementById("editCredit").value) || 0
  let debit = parseFloat(document.getElementById("editDebit").value) || 0

  if ((credit > 0 && debit > 0) || (credit === 0 && debit === 0)) {
    alert("Enter either Credit or Debit only")
    return
  }

  let index = transactions.findIndex(t => t.id === id)

  transactions[index] = { id, date, header, credit, debit }

  saveToLocal()
  renderTable()
  closePanel()
}

function closePanel() {
  document.getElementById("editPanel").classList.remove("active")
}

function saveToLocal() {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

function clearInputs() {
  document.getElementById("date").value = ""
  document.getElementById("header").value = ""
  document.getElementById("credit").value = ""
  document.getElementById("debit").value = ""
}