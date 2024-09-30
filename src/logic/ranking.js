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

    // スコアを抽出してソート
    const sortedData = json
        .filter(value => value[0] !== "") // 空の値を除外
        .map(value => {
            const parts = value[0].split('\n');
            return {
                name: parts[0],
                score: parseInt(parts[1])
            };
        })
        .sort((a, b) => b.score - a.score); // スコアで降順にソート

    // ソートされたデータをDOMに追加
    sortedData.forEach((item) => {
        const ranking = document.createElement('div');
        ranking.textContent = `${item.name}\n${item.score}`;
        ranking.className = 'ranking-item m-2 p-2 border rounded fs-4'; // Bootstrapのクラスを追加
        listDom.appendChild(ranking);
    });
}).catch((error) => {
    console.error('Error fetching ranking:', error);
});