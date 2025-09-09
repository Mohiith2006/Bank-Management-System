// Utility: localStorage key
const ACCOUNTS_KEY = 'bankAccounts';

// Helper: load accounts from localStorage
function loadAccounts() {
  return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
}

// Helper: save accounts to localStorage
function saveAccounts(accs) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accs));
}

// Navigation
function showSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section).classList.add('active');
}

// Initial screen
showSection('create');

// ---- Create Account ----
function createAccount(e) {
  e.preventDefault();
  let accs = loadAccounts();
  let accNo = document.getElementById('accNo').value.trim();
  if(accs.find(a => a.no === accNo)) {
    document.getElementById('createMsg').innerHTML = '<div class="error">Account already exists!</div>';
    return;
  }
  let obj = {
    no: accNo,
    name: document.getElementById('accName').value.trim(),
    phone: document.getElementById('accPhone').value.trim(),
    email: document.getElementById('accEmail').value.trim(),
    balance: parseFloat(document.getElementById('accBalance').value) || 0
  };
  accs.push(obj);
  saveAccounts(accs);
  document.getElementById('createMsg').innerHTML = '<div class="success">Account created!</div>';
  e.target.reset();
}

// ---- Delete Account ----
function deleteAccount(e) {
  e.preventDefault();
  let accs = loadAccounts();
  let accNo = document.getElementById('delAccNo').value.trim();
  let idx = accs.findIndex(a => a.no === accNo);
  if(idx === -1) {
    document.getElementById('deleteMsg').innerHTML = '<div class="error">Account not found!</div>';
    return;
  }
  accs.splice(idx,1);
  saveAccounts(accs);
  document.getElementById('deleteMsg').innerHTML = '<div class="success">Deleted successfully.</div>';
  e.target.reset();
}

// ---- Update Account ----
function updateAccount(e) {
  e.preventDefault();
  let accs = loadAccounts();
  let accNo = document.getElementById('updAccNo').value.trim();
  let acc = accs.find(a => a.no === accNo);
  if(!acc) {
    document.getElementById('updateMsg').innerHTML = '<div class="error">Account not found!</div>';
    return;
  }
  let name = document.getElementById('updAccName').value.trim();
  let phone = document.getElementById('updAccPhone').value.trim();
  let email = document.getElementById('updAccEmail').value.trim();
  if(name) acc.name = name;
  if(phone) acc.phone = phone;
  if(email) acc.email = email;
  saveAccounts(accs);
  document.getElementById('updateMsg').innerHTML = '<div class="success">Updated!</div>';
  e.target.reset();
}

// ---- Get All Accounts ----
function showAllAccounts() {
  let accs = loadAccounts();
  let html = `<table>
      <tr><th>Acc No</th><th>Name</th><th>Phone</th><th>Email</th><th>Balance</th></tr>`;
  html += accs.map(a =>
    `<tr>
      <td>${a.no}</td>
      <td>${a.name}</td>
      <td>${a.phone}</td>
      <td>${a.email}</td>
      <td>₹${a.balance.toFixed(2)}</td>
    </tr>`
  ).join('');
  html += '</table>';
  document.getElementById('allAccounts').innerHTML = html;
}

// ---- Get Single Account ----
function getSingleAccount(e) {
  e.preventDefault();
  let accNo = document.getElementById('getAccNo').value.trim();
  let accs = loadAccounts();
  let acc = accs.find(a => a.no === accNo);
  if(!acc) {
    document.getElementById('singleAccount').innerHTML = '<div class="error">Account not found.</div>';
    return;
  }
  document.getElementById('singleAccount').innerHTML =
    `<table>
      <tr><th>Acc No</th><td>${acc.no}</td></tr>
      <tr><th>Name</th><td>${acc.name}</td></tr>
      <tr><th>Phone</th><td>${acc.phone}</td></tr>
      <tr><th>Email</th><td>${acc.email}</td></tr>
      <tr><th>Balance</th><td>₹${acc.balance.toFixed(2)}</td></tr>
    </table>`;
  e.target.reset();
}

// ---- Deposit ----
function depositAmount(e) {
  e.preventDefault();
  let accNo = document.getElementById('depAccNo').value.trim();
  let amount = parseFloat(document.getElementById('depAmount').value);
  if(amount <= 0) {
    document.getElementById('depositMsg').innerHTML = '<div class="error">Invalid amount.</div>';
    return;
  }
  let accs = loadAccounts();
  let acc = accs.find(a => a.no === accNo);
  if(!acc) {
    document.getElementById('depositMsg').innerHTML = '<div class="error">Account not found!</div>';
    return;
  }
  acc.balance += amount;
  saveAccounts(accs);
  document.getElementById('depositMsg').innerHTML = `<div class="success">Deposited ₹${amount.toFixed(2)}!</div>`;
  e.target.reset();
}

// ---- Withdraw ----
function withdrawAmount(e) {
  e.preventDefault();
  let accNo = document.getElementById('witAccNo').value.trim();
  let amount = parseFloat(document.getElementById('witAmount').value);
  let accs = loadAccounts();
  let acc = accs.find(a => a.no === accNo);
  if(!acc) {
    document.getElementById('withdrawMsg').innerHTML = '<div class="error">Account not found!</div>';
    return;
  }
  if(amount <= 0 || acc.balance < amount) {
    document.getElementById('withdrawMsg').innerHTML = '<div class="error">Insufficient balance or invalid amount!</div>';
    return;
  }
  acc.balance -= amount;
  saveAccounts(accs);
  document.getElementById('withdrawMsg').innerHTML = `<div class="success">Withdrew ₹${amount.toFixed(2)}</div>`;
  e.target.reset();
}

// ---- Transfer Funds ----
function transferFunds(e) {
  e.preventDefault();
  let fromNo = document.getElementById('fromAccNo').value.trim();
  let toNo = document.getElementById('toAccNo').value.trim();
  let amount = parseFloat(document.getElementById('trAmount').value);
  if(fromNo === toNo) {
    document.getElementById('transferMsg').innerHTML = '<div class="error">Source and destination cannot be same.</div>';
    return;
  }
  let accs = loadAccounts();
  let from = accs.find(a => a.no === fromNo);
  let to = accs.find(a => a.no === toNo);
  if(!from || !to) {
    document.getElementById('transferMsg').innerHTML = '<div class="error">Account not found!</div>';
    return;
  }
  if(amount <= 0 || from.balance < amount) {
    document.getElementById('transferMsg').innerHTML = '<div class="error">Insufficient balance or invalid amount.</div>';
    return;
  }
  from.balance -= amount;
  to.balance += amount;
  saveAccounts(accs);
  document.getElementById('transferMsg').innerHTML = `<div class="success">Transferred ₹${amount.toFixed(2)}</div>`;
  e.target.reset();
}
