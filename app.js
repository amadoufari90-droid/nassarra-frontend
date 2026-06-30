const API_URL = 'https://nassarra-backend.onrender.com';
const projetSelect = document.getElementById('projet');
const projetAutreInput = document.getElementById('projet_autre');
const projetAutreHelp = document.getElementById('projet_autre_help');
const typeBienInput = document.querySelector('input[name="type_bien"]');
const descriptionInput = document.querySelector('textarea[name="description"]');

const setFieldError = (field, message) => {
  field.classList.add('field-error');
  let error = field.nextElementSibling;
  if (!error || !error.classList.contains('field-error-message')) {
    error = document.createElement('div');
    error.className = 'field-error-message';
    field.parentNode.insertBefore(error, field.nextSibling);
  }
  error.textContent = message;
};

const clearFieldError = (field) => {
  field.classList.remove('field-error');
  const error = field.nextElementSibling;
  if (error && error.classList.contains('field-error-message')) {
    error.remove();
  }
};

projetSelect.addEventListener('change', () => {
  const showAutre = projetSelect.value === 'Autre';
  projetAutreInput.style.display = showAutre ? 'block' : 'none';
  projetAutreHelp.style.display = showAutre ? 'block' : 'none';
});

typeBienInput.addEventListener('input', () => clearFieldError(typeBienInput));
descriptionInput.addEventListener('input', () => clearFieldError(descriptionInput));

document.getElementById('leadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const button = e.target.querySelector('button');
  const originalText = button.textContent;
  button.textContent = ' Envoi en cours...';
  button.disabled = true;

  clearFieldError(typeBienInput);
  clearFieldError(descriptionInput);

  let hasError = false;
  if (!typeBienInput.value.trim()) {
    setFieldError(typeBienInput, 'Le type de bien est requis.');
    hasError = true;
  }
  if (!descriptionInput.value.trim()) {
    setFieldError(descriptionInput, 'La description du bien est requise.');
    hasError = true;
  }

  if (hasError) {
    button.textContent = originalText;
    button.disabled = false;
    return;
  }

  const formData = Object.fromEntries(new FormData(e.target).entries());
  if (formData.projet === 'Autre' && formData.projet_autre) {
    formData.projet = formData.projet_autre;
  }
  delete formData.projet_autre;
  const data = formData;
  
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
      ? '✅ Votre demande a bien été transmise à Nas-Sarra.'
      : `⚠️ La demande a été reçue, mais l\'envoi WhatsApp a échoué.${result.whatsapp_error ? ' (' + result.whatsapp_error + ')' : ''}`;
    
    msg.innerHTML = `
      <div class="success-message">
        <h2>✅ Demande enregistrée avec succès!</h2>
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