document.getElementById('track-form').addEventListener('submit', async () => {
  
  const code = document.getElementById('trackingCode').value;
  const resultBox = document.getElementById('track-result');

  try {
    const res = await fetch(`/api/shipments/${code}`);
    if (!res.ok) throw new Error('Shipment not found');

    const data = await res.json();
    resultBox.innerHTML = `
      <strong>Status:</strong> ${data.status} <br />
      <strong>Location:</strong> ${data.currentLocation} <br />
      <strong>Recipient:</strong> ${data.recipientName} <br />
      <stong>last Updated:</strong>${new Date(data.pickupDate).toLocaleString}
    `;
  } catch (err) {
    resultBox.innerHTML = '<p>Shipment not found or error occurred.</p>';
  }
});