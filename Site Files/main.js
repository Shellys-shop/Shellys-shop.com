// Shelly's Shop — Main JS

// Email signup form handler
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const email = emailInput.value;
  
  // Find the thanks message (could be in different locations)
  const thanks = document.getElementById('form-thanks') || 
                 form.parentElement.querySelector('.form-thanks') ||
                 form.nextElementSibling;
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Disable button during submission
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  
  // Use hidden iframe to submit without page redirect
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.name = 'hidden-form-frame';
  document.body.appendChild(iframe);
  
  // Create a temporary form
  const tempForm = document.createElement('form');
  tempForm.method = 'POST';
  tempForm.action = 'https://script.google.com/macros/s/AKfycbzS8ejGWO6JKbAj17k3vE1fYtp8bvzFi78aSxPRBrhnVz4t1CxyfQVvxWIU_h50bkRedA/exec';
  tempForm.target = 'hidden-form-frame';
  
  // Add email field
  const emailField = document.createElement('input');
  emailField.type = 'hidden';
  emailField.name = 'email';
  emailField.value = email;
  tempForm.appendChild(emailField);
  
  // Add page field
  const pageField = document.createElement('input');
  pageField.type = 'hidden';
  pageField.name = 'page';
  pageField.value = window.location.pathname;
  tempForm.appendChild(pageField);
  
  // Submit the form
  document.body.appendChild(tempForm);
  tempForm.submit();
  
  // Clean up after a short delay
  setTimeout(() => {
    document.body.removeChild(tempForm);
    document.body.removeChild(iframe);
  }, 1000);
  
  // Show success immediately (since we can't check response due to CORS)
  form.style.display = 'none';
  if (thanks) {
    thanks.style.display = 'block';
  }
  
  console.log('Email submitted:', email, 'to Google Sheets');
}

// Attach handlers - run immediately and also on DOMContentLoaded as backup
function attachFormHandlers() {
  const emailForms = document.querySelectorAll('.email-form');
  emailForms.forEach(form => {
    // Remove any existing listeners to avoid duplicates
    form.removeEventListener('submit', handleSubmit);
    // Add the listener
    form.addEventListener('submit', handleSubmit);
  });
}

// Try to attach immediately
attachFormHandlers();

// Also attach when DOM is ready (backup)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachFormHandlers);
} else {
  attachFormHandlers();
}

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  // Close nav when a link is clicked
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// Scroll-in animation for cards
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = (i * 0.1) + 's';
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.video-card, .project-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(card);
});

// When card becomes visible
document.querySelectorAll('.video-card, .project-card').forEach(card => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  obs.observe(card);
});
