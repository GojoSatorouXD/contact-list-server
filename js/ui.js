function showSpinner() {
  document.getElementById('spinner').classList.remove('hidden');
}

function hideSpinner() {
  document.getElementById('spinner').classList.add('hidden');
}

function renderContacts(contacts) {
  const list = document.getElementById('contactList');
  list.innerHTML = '';

  if (contacts.length === 0) {
    list.innerHTML = '<p class="empty-msg">No hay contactos aún.</p>';
    return;
  }

  contacts.forEach(contact => {
    const icon = contact.gender === 'female' ? '👩' : '👨';
    const div = document.createElement('div');
    div.className = 'contact-item';
    div.innerHTML = `
      <span class="contact-icon">${icon}</span>
      <span class="contact-name">${contact.name} ${contact.lastname} – ${contact.city}</span>
      <div class="contact-buttons">
        <button class="btn-edit" onclick="openEditModal(${contact.id})">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn-delete" onclick="handleDelete(${contact.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    list.appendChild(div);
  });
}

function clearForm() {
  document.getElementById('inputName').value = '';
  document.getElementById('inputLastname').value = '';
  document.getElementById('inputPhone').value = '';
  document.getElementById('inputCity').value = '';
  document.getElementById('inputAddress').value = '';
  document.querySelector('input[name="gender"][value="female"]').checked = true;

  ['errorName','errorLastname','errorPhone','errorCity','errorAddress'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
}

function showError(fieldId, message) {
  document.getElementById(fieldId).textContent = message;
}

function clearErrors() {
  ['errorName','errorLastname','errorPhone','errorCity','errorAddress'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
}

function openEditModal(id) {
  // Se llama desde app.js con los datos del contacto
  window._editingId = id;
  document.getElementById('editModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('editModal').classList.add('hidden');
  window._editingId = null;
}
