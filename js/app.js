// app.js — lógica principal
// La diferencia con el taller anterior: todas las funciones son async/await
// porque ahora hablan con un servidor (red), no con localStorage (instantáneo).

// ── Al cargar la página ────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  await loadContacts();
});

// Carga y muestra todos los contactos
async function loadContacts() {
  showSpinner();
  try {
    const contacts = await getContacts(); // storage.js
    renderContacts(contacts);             // ui.js
  } catch (error) {
    console.error(error);
    alert('⚠️ No se pudo conectar al servidor. ¿Está corriendo node server.js?');
  } finally {
    hideSpinner();
  }
}

// ── Agregar contacto ───────────────────────────────────────────────────────────
async function handleAdd() {
  clearErrors();

  const name    = document.getElementById('inputName').value.trim();
  const lastname = document.getElementById('inputLastname').value.trim();
  const phone   = document.getElementById('inputPhone').value.trim();
  const city    = document.getElementById('inputCity').value.trim();
  const address = document.getElementById('inputAddress').value.trim();
  const gender  = document.querySelector('input[name="gender"]:checked').value;

  // Validaciones
  let hasError = false;
  if (!name)     { showError('errorName', 'El nombre es obligatorio');       hasError = true; }
  if (!lastname) { showError('errorLastname', 'El apellido es obligatorio'); hasError = true; }
  if (!phone)    { showError('errorPhone', 'El teléfono es obligatorio');    hasError = true; }
  if (!city)     { showError('errorCity', 'La ciudad es obligatoria');       hasError = true; }
  if (!address)  { showError('errorAddress', 'La dirección es obligatoria'); hasError = true; }
  if (hasError) return;

  showSpinner();
  try {
    await saveContact({ name, lastname, phone, city, address, gender }); // storage.js
    clearForm();
    await loadContacts();
  } catch (error) {
    console.error(error);
    alert('Error al guardar el contacto: ' + error.message);
  } finally {
    hideSpinner();
  }
}

// ── Abrir modal de edición ─────────────────────────────────────────────────────
async function openEditModal(id) {
  showSpinner();
  try {
    // Obtener todos los contactos y encontrar el que queremos editar
    const contacts = await getContacts();
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    // Rellenar el modal con los datos actuales
    document.getElementById('editName').value     = contact.name;
    document.getElementById('editLastname').value = contact.lastname;
    document.getElementById('editPhone').value    = contact.phone;
    document.getElementById('editCity').value     = contact.city;
    document.getElementById('editAddress').value  = contact.address;

    const genderRadio = document.querySelector(`input[name="editGender"][value="${contact.gender}"]`);
    if (genderRadio) genderRadio.checked = true;

    window._editingId = id;
    document.getElementById('editModal').classList.remove('hidden');
  } catch (error) {
    console.error(error);
    alert('Error al cargar el contacto');
  } finally {
    hideSpinner();
  }
}

// ── Guardar edición ────────────────────────────────────────────────────────────
async function saveEdit() {
  const id = window._editingId;
  if (!id) return;

  // Limpiar errores del modal
  ['editErrorName','editErrorLastname','editErrorPhone','editErrorCity','editErrorAddress']
    .forEach(errId => { document.getElementById(errId).textContent = ''; });

  const name     = document.getElementById('editName').value.trim();
  const lastname = document.getElementById('editLastname').value.trim();
  const phone    = document.getElementById('editPhone').value.trim();
  const city     = document.getElementById('editCity').value.trim();
  const address  = document.getElementById('editAddress').value.trim();
  const gender   = document.querySelector('input[name="editGender"]:checked').value;

  // Validaciones del modal
  let hasError = false;
  if (!name)     { document.getElementById('editErrorName').textContent     = 'Obligatorio'; hasError = true; }
  if (!lastname) { document.getElementById('editErrorLastname').textContent = 'Obligatorio'; hasError = true; }
  if (!phone)    { document.getElementById('editErrorPhone').textContent    = 'Obligatorio'; hasError = true; }
  if (!city)     { document.getElementById('editErrorCity').textContent     = 'Obligatorio'; hasError = true; }
  if (!address)  { document.getElementById('editErrorAddress').textContent  = 'Obligatorio'; hasError = true; }
  if (hasError) return;

  showSpinner();
  try {
    await updateContact(id, { name, lastname, phone, city, address, gender }); // storage.js
    closeModal();
    await loadContacts();
  } catch (error) {
    console.error(error);
    alert('Error al actualizar: ' + error.message);
  } finally {
    hideSpinner();
  }
}

// ── Eliminar contacto ──────────────────────────────────────────────────────────
async function handleDelete(id) {
  if (!confirm('¿Seguro que quieres eliminar este contacto?')) return;

  showSpinner();
  try {
    await deleteContact(id); // storage.js
    await loadContacts();
  } catch (error) {
    console.error(error);
    alert('Error al eliminar: ' + error.message);
  } finally {
    hideSpinner();
  }
}
