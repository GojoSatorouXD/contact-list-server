const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

let contacts = [];
let nextId = 1;

app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

app.post('/api/contacts', (req, res) => {
  const { name, lastname, phone, city, address, gender } = req.body;

  if (!name || !lastname || !phone || !city || !address) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const newContact = {
    id: nextId++,
    name,
    lastname,
    phone,
    city,
    address,
    gender: gender || 'female'
  };

  contacts.push(newContact);
  res.status(201).json(newContact);
});

app.put('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = contacts.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }

  const { name, lastname, phone, city, address, gender } = req.body;

  contacts[index] = {
    ...contacts[index],
    name: name ?? contacts[index].name,
    lastname: lastname ?? contacts[index].lastname,
    phone: phone ?? contacts[index].phone,
    city: city ?? contacts[index].city,
    address: address ?? contacts[index].address,
    gender: gender ?? contacts[index].gender
  };

  res.json(contacts[index]);
});

app.delete('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = contacts.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }

  const deleted = contacts.splice(index, 1)[0];
  res.json({ message: 'Contacto eliminado', contact: deleted });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
