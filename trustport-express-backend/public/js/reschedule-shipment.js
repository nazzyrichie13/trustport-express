document.getElementById('reschedule-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const code = document.getElementById('trackingCode').value;
  const newDate = document.getElementById('newDate').value;
  const messageBox = document.getElementById('reschedule-message');

  try {
    const res = await fetch(`/api/shipments/${code}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDate }),
    });

    const result = await res.json();
    messageBox.textContent = result.message || 'Reschedule successful';
  } catch (err) {
    messageBox.textContent = 'Error rescheduling delivery';
  }
});
