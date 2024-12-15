const cases = Array(24).fill(null); // Tableau pour stocker les Blops
const grid = document.getElementById('grid');
const status = document.getElementById('status');

// Générer la grille
for (let i = 0; i < 24; i++) {
    const cell = document.createElement('div');
    cell.classList.add('case');
    cell.dataset.index = i;
    grid.appendChild(cell);
}

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

// Initialiser la reconnaissance vocale
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "fr-FR";
recognition.continuous = false;

recognition.onstart = () => {
    status.textContent = "Statut : Écoute en cours...";
};

recognition.onend = () => {
    status.textContent = "Statut : En attente...";
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim().toUpperCase();
    status.textContent = `Commande reçue : "${transcript}"`;
    handleVoiceCommand(transcript);
};

// Gestion des commandes vocales
function handleVoiceCommand(command) {
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

// Réinitialise le plateau
function resetBoard() {
    for (let i = 0; i < cases.length; i++) {
        cases[i] = null;
        const cell = document.querySelector(`[data-index="${i}"]`);
        cell.textContent = "";
        cell.style.backgroundColor = "#fff";
        cell.style.color = "#555";
    }
    speak("Plateau réinitialisé.");
    status.textContent = "Statut : Plateau réinitialisé.";
}

// Synthèse vocale
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

// Activer la reconnaissance vocale
document.getElementById('startVoice').onclick = () => recognition.start();

// Bouton de réinitialisation
document.getElementById('resetBoard').onclick = resetBoard;
