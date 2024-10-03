// Handle the submission of the user form
document.getElementById('user-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const adminPassword = document.getElementById('admin-password').value;

  const userData = { name, email };

  fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'admin-password': adminPassword,
    },
    body: JSON.stringify(userData),
  })
  .then((response) => response.json())
  .then((result) => {
    alert(result.message);
    document.getElementById('user-form').reset();
  })
  .catch((error) => {
    alert('Error: ' + error.message);
  });
});

// Handle the submission of the VR headset form
document.getElementById('vr-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const model = document.getElementById('model').value;
  const brand = document.getElementById('brand').value;
  const releaseYear = document.getElementById('release_year').value;
  const ownerId = document.getElementById('owner_id').value;
  const adminPassword = document.getElementById('vr-admin-password').value;

  const vrData = { model, brand, release_year: releaseYear, owner_id: ownerId };

  fetch('/api/devices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'admin-password': adminPassword,
    },
    body: JSON.stringify(vrData),
  })
  .then((response) => response.json())
  .then((result) => {
    alert(result.message);
    document.getElementById('vr-form').reset();
  })
  .catch((error) => {
    alert('Error: ' + error.message);
  });
});

// Handle delete user request
document.getElementById('delete-user-form').addEventListener('submit', function (event) {
  event.preventDefault();
  
  const userId = document.getElementById('delete-user-id').value;
  const adminPassword = document.getElementById('delete-user-admin-password').value;
  
  fetch(`/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'admin-password': adminPassword,
    },
  })
  .then((response) => response.json())
  .then((data) => alert(data.message))
  .catch((error) => alert('Error: ' + error.message));
});

// Handle delete device request
document.getElementById('delete-device-form').addEventListener('submit', function (event) {
  event.preventDefault();
  
  const deviceId = document.getElementById('delete-device-id').value;
  const adminPassword = document.getElementById('delete-device-admin-password').value;

  fetch(`/api/devices/${deviceId}`, {
    method: 'DELETE',
    headers: {
      'admin-password': adminPassword,
    },
  })
  .then((response) => response.json())
  .then((data) => alert(data.message))
  .catch((error) => alert('Error: ' + error.message));
});