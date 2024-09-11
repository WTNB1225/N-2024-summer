const correctDom = document.getElementById('correct');
const incorrectDom = document.getElementById('incorrect');
const accuracyDom = document.getElementById('accuracy');
const wpmDom = document.getElementById('wpm');
const retryDom = document.getElementById('retry');

const correct = window.localStorage.getItem("correct") || 0;
const missed = window.localStorage.getItem("missed") || 0;
const accuracy = window.localStorage.getItem("accuracy") || 0;
const wpm = window.localStorage.getItem("wpm") || 0;

correctDom.textContent = correct;
incorrectDom.textContent = missed;
accuracyDom.textContent = accuracy;
wpmDom.textContent = wpm;

retryDom.onclick = () => {
    window.location.href = "./game.html";
}