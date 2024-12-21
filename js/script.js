// Crée un objet Audio avec le fichier de son
const sound = new Audio("sons/Water_Drop.mp3"); // Assure-toi que le chemin est correct

// Ajoute un écouteur d'événement de clic sur le body
document.body.addEventListener("click", () => {
  sound.play().catch((error) => {
    console.error("Erreur de lecture du son :", error);
  });
});
