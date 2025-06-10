document.getElementById('track-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const code = document.getElementById('trackingCode').value;
  const resultBox = document.getElementById('track-result');

  try {
    const res = await fetch(`/api/shipments/${code}`);
    if (!res.ok) throw new Error('Shipment not found');

    const data = await res.json();
    resultBox.innerHTML = `
      <strong>Status:</strong> ${data.status} <br />
      <strong>Location:</strong> ${data.location} <br />
      <strong>Recipient:</strong> ${data.recipientName} <br />
    `;
  } catch (err) {
    resultBox.innerHTML = '<p>Shipment not found or error occurred.</p>';
  }
});