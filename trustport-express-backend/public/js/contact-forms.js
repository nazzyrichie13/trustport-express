window.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('contactForm');
    const status = document.getElementById('statusMessage');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          status.style.color = 'green';
          status.textContent = data.message || 'Form submitted successfully!';
          form.reset();
        } else {
          status.style.color = 'red';
          status.textContent = data.message || 'Submission failed.';
        }
      } catch (err) {
        status.style.color = 'red';
        status.textContent = 'Error: ' + err.message;
      }
    });
});
