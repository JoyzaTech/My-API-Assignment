const express = require('express');
const fs = require('fs');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.static('public')); // Serve static files from the public directory

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'supersecretpassword';

function checkAdminPassword(req, res, next) {
  const password = req.headers['admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ message: 'Forbidden: Incorrect admin password.' });
  }
  next();
}

// Load data from JSON files
let users = require('./data/users.json');
let vrHeadsets = require('./data/devices.json');

// POST: Add a new user
app.post('/api/users', checkAdminPassword, (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);

  // Write the updated users array to the file
  fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

  res.status(201).json({ message: 'User added successfully!', user: newUser });
});

// POST: Add a new device
app.post('/api/devices', checkAdminPassword, (req, res) => {
  const newVRHeadset = {
    id: vrHeadsets.length + 1,
    model: req.body.model,
    brand: req.body.brand,
    release_year: req.body.release_year,
    owner_id: req.body.owner_id
  };
  vrHeadsets.push(newVRHeadset);

  // Write the updated devices array to the file
  fs.writeFileSync('./data/devices.json', JSON.stringify(vrHeadsets, null, 2));

  res.status(201).json({ message: 'Device added successfully!', device: newVRHeadset });
});

// GET: Get user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

// GET: Get device by ID
app.get('/api/devices/:id', (req, res) => {
  const deviceId = parseInt(req.params.id);
  const device = vrHeadsets.find(d => d.id === deviceId);

  if (device) {
    res.json(device);
  } else {
    res.status(404).json({ message: 'Device not found.' });
  }
});

// DELETE: Delete user by ID
app.delete('/api/users/:id', checkAdminPassword, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);

    // Write the updated users array to the file
    fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

    res.json({ message: 'User deleted successfully.' });
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

// DELETE: Delete device by ID
app.delete('/api/devices/:id', checkAdminPassword, (req, res) => {
  const deviceId = parseInt(req.params.id);
  const deviceIndex = vrHeadsets.findIndex(d => d.id === deviceId);

  if (deviceIndex !== -1) {
    vrHeadsets.splice(deviceIndex, 1);

    // Write the updated devices array to the file
    fs.writeFileSync('./data/devices.json', JSON.stringify(vrHeadsets, null, 2));

    res.json({ message: 'Device deleted successfully.' });
  } else {
    res.status(404).json({ message: 'Device not found.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});