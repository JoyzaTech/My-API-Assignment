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
let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
let devices = JSON.parse(fs.readFileSync('devices.json', 'utf8'));

// Save updated data back to the JSON files
function saveUsers() {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}

function saveDevices() {
  fs.writeFileSync('devices.json', JSON.stringify(devices, null, 2));
}

// Add a new user
app.post('/api/users', checkAdminPassword, (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  saveUsers();
  res.status(201).json({ message: 'User added successfully!', user: newUser });
});

// Add a new device
app.post('/api/devices', checkAdminPassword, (req, res) => {
  const newDevice = {
    id: devices.length + 1,
    model: req.body.model,
    brand: req.body.brand,
    release_year: req.body.release_year,
    owner_id: req.body.owner_id
  };
  devices.push(newDevice);
  saveDevices();
  res.status(201).json({ message: 'Device added successfully!', device: newDevice });
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get all devices
app.get('/api/devices', (req, res) => {
  res.json(devices);
});

// Delete a user by ID
app.delete('/api/users/:id', checkAdminPassword, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    saveUsers();
    res.status(200).json({ message: 'User deleted successfully.' });
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

// Delete a device by ID
app.delete('/api/devices/:id', checkAdminPassword, (req, res) => {
  const deviceId = parseInt(req.params.id);
  const deviceIndex = devices.findIndex(device => device.id === deviceId);
  
  if (deviceIndex !== -1) {
    devices.splice(deviceIndex, 1);
    saveDevices();
    res.status(200).json({ message: 'Device deleted successfully.' });
  } else {
    res.status(404).json({ message: 'Device not found.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});