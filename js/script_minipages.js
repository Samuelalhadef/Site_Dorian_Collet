document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('.project-img'); // Toutes les images
  const modals = document.querySelectorAll('.modal'); // Toutes les modales

  images.forEach(img => {
    img.addEventListener('click', () => {
      const modalId = img.getAttribute('data-modal'); // Récupère l'identifiant de la modale
      const modal = document.getElementById(modalId);
      modal.style.display = "block"; // Affiche la modale
    });
  });

  // Pour fermer les modales en cliquant sur le bouton de fermeture
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
      modal.style.display = "none";
    });
  });

  // Pour fermer la modale en cliquant en dehors de celle-ci
  window.addEventListener('click', (event) => {
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
});
