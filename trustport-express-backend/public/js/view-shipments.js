window.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('shipments');

  try {
    const res = await fetch('/api/shipments');
    const shipments = await res.json();

    if (shipments.length === 0) {
      container.innerHTML = '<p>No shipments found.</p>';
      return;
    }

    shipments.forEach((shipment) => {
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>Tracking:</strong> ${shipment.trackingCode} <br />
        <strong>Recipient:</strong> ${shipment.recipientName} <br />
        <strong>Status:</strong> ${shipment.status} <br />
        <strong>Location:</strong> ${shipment.currentLocation} <br />
        <hr />
      `;
      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = '<p>Error loading shipments.</p>';
  }
});
