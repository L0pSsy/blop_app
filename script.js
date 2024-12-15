const startVoiceButton = document.getElementById('startVoice');
const resetButton = document.getElementById('resetBoard');
const statusElement = document.getElementById('status');
const grid = document.getElementById('grid');

// Dictionnaire pour décoder les Blops
const blopTypes = {
    BB: "Biblop",
    B: "Blop",
    BR: "Blop Royal"
};

const blopColors = {
    C: "Coco",
    G: "Griotte",
    I: "Indigo",
    R: "Reinette"
};

// Initialiser la grille avec 24 cases
const cases = Array(24).fill(null);
for (let i = 0; i < 24; i++) {
    const cell = document.createElement('div');
    cell.classList.add('case');
    cell.dataset.index = i;
    grid.appendChild(cell);
}

// Initialiser la reconnaissance vocale
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;

    recognition.onstart = () => {
        statusElement.textContent = "Statut : Écoute en cours...";
        startVoiceButton.innerHTML = '<i class="fa-solid fa-microphone"></i>'; // Micro activé
    };

    recognition.onend = () => {
        statusElement.textContent = "Statut : En attente...";
        startVoiceButton.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>'; // Micro désactivé
    };

    recognition.onerror = (event) => {
        statusElement.textContent = "Erreur : " + event.error;
        console.error('Recognition error', event);
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim().toUpperCase();
        statusElement.textContent = `Commande reçue : "${transcript}"`;
        console.log('Transcript:', transcript); // Log pour vérifier la reconnaissance
        handleVoiceCommand(transcript);  // Appel à une fonction pour traiter la commande vocale
        
        // Remplacer "BAISSER" par "BC" pour éviter la confusion
    transcript = transcript.replace(/\bBAISSER\b/g, "BC");

    statusElement.textContent = `Commande reçue : "${transcript}"`;
    console.log('Transcript:', transcript); // Log pour vérifier la reconnaissance
    handleVoiceCommand(transcript);  // Appel à une fonction pour traiter la commande vocale
    };

    // Gérer l'activation/désactivation du micro
    startVoiceButton.onclick = () => {
        if (statusElement.textContent.includes("Écoute en cours")) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };
} else {
    statusElement.textContent = "La reconnaissance vocale n'est pas supportée dans ce navigateur.";
    console.error("SpeechRecognition API not supported in this browser.");
}

// Fonction pour gérer les commandes vocales reçues
function handleVoiceCommand(command) {
    console.log("Commande reçue : ", command);

    // Exemple de commande : "BBI 5" (Biblop Indigo dans la case 5)
    const match = command.match(/^(BB|B|BR)(C|G|I|R)\s*(\d+)?$/);
    if (!match) {
        speak("Commande non reconnue. Réessayez.");
        return;
    }

    const type = blopTypes[match[1]];
    const color = blopColors[match[2]];
    const index = match[3] ? parseInt(match[3]) - 1 : null;

    if (index !== null && (index < 0 || index >= 24)) {
        speak("Numéro de case invalide. Choisissez entre 1 et 24.");
        return;
    }

    const blopName = `${type} ${color}`;
    if (index !== null) {
        // Mettre à jour la case spécifique
        cases[index] = blopName;
        updateCell(index, blopName);

        // Vérifier les correspondances
        checkMatch(index, blopName);
    } else {
        speak("Veuillez spécifier un numéro de case.");
    }
}

// Met à jour l'apparence de la case
function updateCell(index, blopName) {
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = blopName;
    cell.style.backgroundColor = "#d4edda";
    cell.style.color = "#155724";
}

// Vérifie les correspondances
function checkMatch(index, blopName) {
    const matchIndex = cases.findIndex((blop, i) => blop === blopName && i !== index);
    if (matchIndex !== -1) {
        const matchMessage = `Correspondance trouvée avec la case ${matchIndex + 1}`;
        speak(matchMessage);
    } else {
        speak(`Blop ajouté à la case ${index + 1}`);
    }
}

// Fonction pour réinitialiser le plateau
function resetBoard() {
    // Réinitialiser les cases à leur état initial
    cases.fill(null);

    // Réinitialiser les visuels des cases
    const allCells = document.querySelectorAll('.case');
    allCells.forEach(cell => {
        cell.textContent = ''; // Effacer le contenu de la case
        cell.style.backgroundColor = ''; // Réinitialiser la couleur de fond
        cell.style.color = ''; // Réinitialiser la couleur du texte
    });

    // Réinitialiser le statut
    statusElement.textContent = 'Statut : Plateau réinitialisé.';

    // Si vous avez des autres éléments à réinitialiser, vous pouvez les ajouter ici.
}

// Ajouter l'événement pour réinitialiser le plateau
resetButton.onclick = resetBoard;

// Fonction pour énoncer un texte
function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}
