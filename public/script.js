// Add new user
document.getElementById('user-form').addEventListener('submit', function (event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('admin-password').value;
  
  fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'admin-password': password
    },
    body: JSON.stringify({ name, email })
  })
    .then(response => response.json())
    .then(result => {
      alert(result.message);
    })
    .catch(error => console.error('Error:', error));
});

// Add new device
document.getElementById('device-form').addEventListener('submit', function (event) {
  event.preventDefault();
  
  const model = document.getElementById('model').value;
  const brand = document.getElementById('brand').value;
  const release_year = document.getElementById('release_year').value;
  const owner_id = document.getElementById('owner_id').value;
  const password = document.getElementById('admin-password').value;
  
  fetch('/api/devices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'admin-password': password
    },
    body: JSON.stringify({ model, brand, release_year, owner_id })
  })
    .then(response => response.json())
    .then(result => {
      alert(result.message);
    })
    .catch(error => console.error('Error:', error));
});

// Delete a user by ID
function deleteUser(userId) {
  const password = document.getElementById('admin-password').value;
  
  fetch(`/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'admin-password': password
    }
  })
    .then(response => response.json())
    .then(result => {
      alert(result.message);
    })
    .catch(error => console.error('Error:', error));
}

// Delete a device by ID
function deleteDevice(deviceId) {
  const password = document.getElementById('admin-password').value;
  
  fetch(`/api/devices/${deviceId}`, {
    method: 'DELETE',
    headers: {
      'admin-password': password
    }
  })
    .then(response => response.json())
    .then(result => {
      alert(result.message);
    })
    .catch(error => console.error('Error:', error));
}