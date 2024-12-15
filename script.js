const startVoiceButton = document.getElementById('startVoice');
const resetButton = document.getElementById('resetBoard');
const status = document.getElementById('status');
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

recognition.onstart = () => {
    status.textContent = "Statut : Écoute en cours...";
    startVoiceButton.innerHTML = '<i class="fa-solid fa-microphone"></i>';
};

recognition.onend = () => {
    status.textContent = "Statut : En attente...";
    startVoiceButton.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim().toUpperCase();
    status.textContent = `Commande reçue : "${transcript}"`;
    handleVoiceCommand(transcript);
};

// Gérer les clics pour activer/désactiver la reconnaissance vocale
startVoiceButton.onclick = () => {
    if (status.textContent.includes("Écoute en cours")) {
        recognition.stop();
    } else {
        recognition.start();
    }
};

// Réinitialiser le plateau
resetButton
