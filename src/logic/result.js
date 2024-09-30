const correctDom = document.getElementById('correct');
const incorrectDom = document.getElementById('incorrect');
const accuracyDom = document.getElementById('accuracy');
const wpmDom = document.getElementById('wpm');
const retryDom = document.getElementById('retry');
const errorDom = document.getElementById('error');
const resultDivDom = document.getElementById('result-div');
const formDom = document.getElementById('form');
const submitDom = document.getElementById('submit');
const correct = window.localStorage.getItem("correct") || null;
const missed = window.localStorage.getItem("missed") || null;
const accuracy = window.localStorage.getItem("accuracy") || null;
const wpm = window.localStorage.getItem("wpm") || null;
const retryDivDom = document.getElementById('retry-div');

if(correct && missed && accuracy && wpm) {
    retryDivDom.style.display = "none";
    correctDom.textContent = correct;   
    incorrectDom.textContent = missed;
    accuracy == "error" ? accuracyDom.textContent = "エラー" : accuracyDom.textContent = accuracy + "%";
    wpmDom.textContent = wpm;
} else {
    resultDivDom.style.display = "none";
    formDom.style.display = "none";
    errorDom.textContent = "ゲームをプレイしてからリザルト画面にアクセスしてください。";
    
}

submitDom.onclick = (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const score = correct - missed;
    const data = {
        theme: `${name}\n${score}`,
        column: 2
    }

    const url = "https://script.google.com/macros/s/AKfycbwNTaZED0riUF1ZNjH_l-X5PUokS1aiCQ3wKNCqBf7Smt2J-EHlHsmzgj67R9IcxW0A/exec";
    try {
        fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
                "Allow-Control-Allow-Origin": "*"
            }
        }).then((res) => {
            console.log(res);
            alert("スコアを送信しました。");
            window.location.href = "./ranking.html";
        });
    } catch (error) {
        console.error('Error:', error);
        alert('スコアを送信できませんでした');
        window.location.href = "./game.html";
        return;
    }

}


retryDom.onclick = () => {
    window.location.href = "./game.html";
}

window.addEventListener("unload", () => {
    window.localStorage.clear();
});