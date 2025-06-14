 const lastUpdate = new
  Date( tracking.updateAt).toLocaleString('en-GB',{
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute:'2-digit'
  });

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
      <stong> Updated:</strong>${lastUpdate} <br/>
    `;
  } catch (err) {
    resultBox.innerHTML = '<p>Shipment not found or error occurred.</p>';
  }
});