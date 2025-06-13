document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const statusBox = document.getElementById('statusMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim()
    };

    statusBox.textContent = 'Sending...';
    statusBox.style.color = 'blue';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to send message');

      statusBox.textContent = 'Message sent successfully!';
      statusBox.style.color = 'green';
      form.reset();
    } catch (err) {
      statusBox.textContent = `Error: ${err.message}`;
      statusBox.style.color = 'red';
    }
  });
});
sss