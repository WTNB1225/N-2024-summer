const correctDom = document.getElementById('correct');
const incorrectDom = document.getElementById('incorrect');
const accuracyDom = document.getElementById('accuracy');
const wpmDom = document.getElementById('wpm');
const retryDom = document.getElementById('retry');
const errorDom = document.getElementById('error');
const resultDivDom = document.getElementById('result-div');

const correct = window.localStorage.getItem("correct") || null;
const missed = window.localStorage.getItem("missed") || null;
const accuracy = window.localStorage.getItem("accuracy") || null;
const wpm = window.localStorage.getItem("wpm") || null;

if(correct && missed && accuracy && wpm) {
    correctDom.textContent = correct;
    incorrectDom.textContent = missed;
    accuracy == "error" ? accuracyDom.textContent = "エラー" : accuracyDom.textContent = accuracy + "%";
    wpmDom.textContent = wpm;
} else {
    resultDivDom.style.display = "none";
    errorDom.textContent = "ゲームをプレイしてからリザルト画面にアクセスしてください。";
    
}

retryDom.onclick = () => {
    window.location.href = "./game.html";
}

window.addEventListener("unload", () => {
    window.localStorage.clear();
});