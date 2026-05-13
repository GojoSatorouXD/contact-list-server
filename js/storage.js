// storage.js — versión API
// Antes usaba localStorage. Ahora usa fetch() para hablar con el servidor Express.

const API_URL = 'http://localhost:3000/api/contacts';

// Obtener todos los contactos desde el servidor
async function getContacts() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener contactos');
  return await response.json();
}

// Guardar un contacto nuevo en el servidor
async function saveContact(contact) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al guardar contacto');
  }
  return await response.json();
}

// Actualizar un contacto existente en el servidor
async function updateContact(id, updatedData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al actualizar contacto');
  }
  return await response.json();
}

// Eliminar un contacto del servidor
async function deleteContact(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar contacto');
  return await response.json();
}
