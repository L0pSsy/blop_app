const startVoiceButton = document.getElementById('startVoice');
const resetButton = document.getElementById('resetBoard');
const statusElement = document.getElementById('status');  // Utilisation de l'élément DOM pour le statut
const grid = document.getElementById('grid');

// Initialiser la grille
const cases = Array(24).fill(null);
for (let i = 0; i < 24; i++) {
    const cell = document.createElement('div');
    cell.classList.add('case');
    cell.dataset.index = i;
    grid.appendChild(cell);
}

// Initialiser la reconnaissance vocale
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "fr-FR";
recognition.continuous = false;

// Lorsque la reconnaissance vocale commence
recognition.onstart = () => {
    statusElement.textContent = "Statut : Écoute en cours...";  // Affichage dans l'élément DOM
    // Mise à jour de l'icône du micro en micro activé
    startVoiceButton.innerHTML = '<i class="fa-solid fa-microphone"></i>';
};

// Lorsque la reconnaissance vocale se termine
recognition.onend = () => {
    statusElement.textContent = "Statut : En attente...";  // Affichage dans l'élément DOM
    // Mise à jour de l'icône du micro en micro désactivé
    startVoiceButton.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';
};

// Lorsque la reconnaissance vocale détecte un résultat
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim().toUpperCase();
    statusElement.textContent = `Commande reçue : "${transcript}"`;  // Affichage dans l'élément DOM
    handleVoiceCommand(transcript);
};

// Gérer les clics pour activer/désactiver la reconnaissance vocale
startVoiceButton.onclick = () => {
    // Vérifier si la reconnaissance vocale est en cours ou non
    if (recognition && statusElement.textContent.includes("Écoute en cours")) {
        // Arrêter la reconnaissance vocale
        recognition.stop();
    } else {
        // Démarrer la reconnaissance vocale
        recognition.start();
    }
};

// Réinitialiser le plateau
resetButton.onclick = () => {
    // Ajoutez ici la logique pour réinitialiser votre plateau (si nécessaire)
};
