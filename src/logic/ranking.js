const listDom = document.getElementById('list');
async function fetchRanking() {
    const url = 'https://script.google.com/macros/s/AKfycbwNTaZED0riUF1ZNjH_l-X5PUokS1aiCQ3wKNCqBf7Smt2J-EHlHsmzgj67R9IcxW0A/exec?column=2';
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Error:', error);
        alert('エラーが発生しました。もう一度お試しください。');
        window.location.href = "./game.html";
        return;
    }
}

fetchRanking().then((json) => {
    console.log(json);
    json.forEach((value) => {
        value[0] == ""
        const ranking = document.createElement('div');
        ranking.textContent = value[0];
        ranking.className = 'm-2';
        listDom.appendChild(ranking);
    })
})