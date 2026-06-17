const API_URL = 'http://127.0.0.1:8000/submit';
document.getElementById('leadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const button = e.target.querySelector('button');
  const originalText = button.textContent;
  button.textContent = ' Envoi en cours...';
  button.disabled = true;

  const data = Object.fromEntries(new FormData(e.target).entries());
  
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    
    if (!res.ok) throw new Error(`Erreur: ${res.status}`);
    
    const result = await res.json();
    const msg = document.getElementById('msg');
    const whatsappStatus = result.whatsapp_sent
      ? '✅ Le message WhatsApp a bien été envoyé à Nas-Sarra.'
      : `⚠️ Le message WhatsApp n\'a pas pu être envoyé.${result.whatsapp_error ? ' (' + result.whatsapp_error + ')' : ''}`;
    
    msg.innerHTML = `
      <div class="success-message">
        <h2>✅ Demande enregistrée avec succès!</h2>
        <p><strong>Score:</strong> ${result.score}/100</p>
        <p><strong>Catégorie:</strong> ${result.category}</p>
        <p>${whatsappStatus}</p>
        <p style="color: #999; font-size: 12px; margin-top: 15px;">Notre équipe commerciale vous contactera très prochainement.</p>
      </div>
    `;
    
    e.target.reset();
    button.textContent = originalText;
    button.disabled = false;
  } catch (error) {
    const msg = document.getElementById('msg');
    msg.innerHTML = `
      <div class="error-message">
        <h2>❌ Une erreur est survenue</h2>
        <p>${error.message}</p>
      </div>
    `;
    button.textContent = originalText;
    button.disabled = false;
  }
});