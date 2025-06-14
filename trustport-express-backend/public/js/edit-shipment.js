document.getElementById('loadBtn').addEventListener('click', async () => {
  const trackingCode = document.getElementById('trackingCode').value.trim();
  const message = document.getElementById('message');

  try {

     const token = localStorage.getItem('adminToken');


  const res = await fetch(`/api/shipments/${trackingCode}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();

   
    if (!res.ok) {
      message.textContent = data.message || 'Shipment not found';
      return;
    }

    document.getElementById('formFields').style.display = 'block';
    document.getElementById('senderName').value = data.senderName;
    document.getElementById('recipientName').value = data.recipientName;
    document.getElementById('status').value = data.status;
    document.getElementById('currentLocation').value = data.currentLocation;

    message.textContent = '';
  } catch (err) {
    message.textContent = 'Error loading shipment';
  }
});

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const trackingCode = document.getElementById('trackingCode').value.trim();
  const message = document.getElementById('message');

  const updateData = {
    senderName: document.getElementById('senderName').value,
    recipientName: document.getElementById('recipientName').value,
    status: document.getElementById('status').value,
    currentLocation: document.getElementById('currentLocation').value
  };

  try {
    const token = localStorage.getItem('adminToken');
 // get your saved token

const res = await fetch(`/api/shipments/${trackingCode}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(updateData)
});


    const data = await res.json();
    if (!res.ok) {
      message.textContent = data.message || 'Failed to update';
      return;
    }

    message.textContent = 'Shipment updated successfully!';
  } catch (err) {
    message.textContent = 'Error updating shipment';
  }
});
