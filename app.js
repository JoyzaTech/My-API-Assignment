const express = require('express');
const fs = require('fs');
const path = require('path');
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

// Define file paths
const usersFilePath = path.join(__dirname, 'data', 'users.json');
const devicesFilePath = path.join(__dirname, 'data', 'devices.json');

// Load data from JSON files
function loadData(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

let users = loadData(usersFilePath);
let devices = loadData(devicesFilePath);

// Save data to JSON files
function saveData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// API Endpoints
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(user);
});

app.get('/api/devices/:id', (req, res) => {
  const device = devices.find(d => d.id === parseInt(req.params.id));
  if (!device) return res.status(404).json({ message: 'Device not found.' });
  res.json(device);
});

app.post('/api/users', checkAdminPassword, (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  saveData(usersFilePath, users);
  res.status(201).json({ message: 'User added successfully!', user: newUser });
});

app.post('/api/devices', checkAdminPassword, (req, res) => {
  const newDevice = {
    id: devices.length + 1,
    model: req.body.model,
    brand: req.body.brand,
    release_year: req.body.release_year,
    owner_id: req.body.owner_id
  };
  devices.push(newDevice);
  saveData(devicesFilePath, devices);
  res.status(201).json({ message: 'Device added successfully!', device: newDevice });
});

app.delete('/api/users/:id', checkAdminPassword, (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter(u => u.id !== userId);
  saveData(usersFilePath, users);
  res.json({ message: 'User deleted successfully.' });
});

app.delete('/api/devices/:id', checkAdminPassword, (req, res) => {
  const deviceId = parseInt(req.params.id);
  devices = devices.filter(d => d.id !== deviceId);
  saveData(devicesFilePath, devices);
  res.json({ message: 'Device deleted successfully.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});