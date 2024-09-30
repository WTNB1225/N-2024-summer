const parser = new Parser();
const sentence = document.getElementById('sentence');
const sentenceContainer = document.getElementById('sentence-container');
const hiraganaSentence = document.getElementById('hiragana-sentence');
const japaneseSentence = document.getElementById('japanese-sentence');
const remainingTimeDom = document.getElementById('time');
const promptDom = document.getElementById('prompt');
const promptSubmitDom = document.getElementById('prompt-submit');
const promptContainer = document.getElementById('prompt-container');
const loadingDom = document.getElementById('loading');
const logDom = document.getElementById('log');
let text1 = [];
let text2 = [];
let remainingTime = 100;
let countDownTime = 3;
let parsedData;

async function fetchThemeLog() {
    const url = 'https://script.google.com/macros/s/AKfycbwNTaZED0riUF1ZNjH_l-X5PUokS1aiCQ3wKNCqBf7Smt2J-EHlHsmzgj67R9IcxW0A/exec?column=1'; //スプレッドシートからテーマを取得するためのAPI
    try {
        const response = await fetch(url, {
            mode: 'cors'
        });
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Error:', error);
        alert('エラーが発生しました。もう一度お試しください。');
        window.location.href = "./game.html";
        return;
    }
}

fetchThemeLog().then((json) => {
    console.log(json);
    json.forEach((value) => { //domを生成していく
        if(value[0] == "") return;
        const log = document.createElement('button');
        log.value = value[0];
        log.textContent = value[0];
        log.className = 'btn back m-2';
        log.addEventListener('click', () => {
            promptDom.value = log.value;
        })
        logDom.appendChild(log);
    })
});

promptSubmitDom.addEventListener('click', () => {
    const prompt = `タイピングゲームで使用する文章を生成してください\nお題は${promptDom.value} です。\n条件は以下の通りです。\n 1. 句読点を含まないでください\n 2. 文章と文章の間は改行してください。\n 3. 各文章の次に、文章に対応しているすべてひらがなで構成された文章を生成してください。20個の文章を生成してください4 \n 4. 文章の先頭に数字などの余計なものはつけないでください。\n5. 生成時に了解しましたなどの言葉は不要です。本題だけを生成してください`;
    generateText(prompt);
    promptContainer.classList.add('innactive');
    loadingDom.classList.remove('innactive');
});

async function getToken() {
    const url = 'https://wtnbjp.com/generate-token'; //One time tokenを取得するためのAPI
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

async function generateText(prompt) {
    logDom.classList.add('innactive');
    const tokenObj = await getToken();
    const spreadsheetURL = 'https://script.google.com/macros/s/AKfycbwNTaZED0riUF1ZNjH_l-X5PUokS1aiCQ3wKNCqBf7Smt2J-EHlHsmzgj67R9IcxW0A/exec';
    try {
        const response = await fetch(spreadsheetURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Origin': '*'
            },
            mode: 'no-cors',
            body: JSON.stringify({theme: promptDom.value, column: 1}),
        });
    } catch (error) {
        console.error('Error:', error);
        console.log(response);
        alert('エラーが発生しました。もう一度お試しください。');
        window.location.href = "./game.html";
        return;
    }
    const url = 'https://wtnbjp.com/chatgpt'; //OpenAIのAPIを叩くためcdのAPI 環境変数を扱うため独自のAPIを作成
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt: prompt, token: tokenObj.token}),
        });
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        const data = json.replace(/\n\n/g, "\n");
        data.split('\n').forEach((value, idx) => {
            if(idx % 2 === 0) {
                text1.push(value);
            } else {
                text2.push(value);
            }
        });
        const randomNumber = Math.floor(Math.random() * text1.length);
        parser.setData(text1[randomNumber], text2[randomNumber]);
        activeCountDown();
        return json
    } catch (error) {
        console.error('Error:', error);
        alert('エラーが発生しました。もう一度お試しください。');
        window.location.href = "./game.html";
        return;
    }
}

function activeCountDown() {
    loadingDom.classList.add('innactive');
    remainingTimeDom.classList.remove('innactive');
    sentenceContainer.classList.remove('innactive');
    //logDom.classList.add('innactive');
    const countDown = setInterval(() => {
        countDownTime -= 1;
        remainingTimeDom.textContent = countDownTime;
        if(countDownTime === 0) {
            clearInterval(countDown);
            parsedData = parser.build(parser.text2);
            remainingTimeDom.textContent = remainingTime;
            activeInterval();
        }
    }, 1000);
}

function activeInterval() {
    const interval = setInterval(() => {
        remainingTime -= 1;
        remainingTimeDom.textContent = remainingTime;
        if(remainingTime === 0) {
            clearInterval(interval);
            const scoreObject = parser.getScore();
            window.localStorage.setItem("correct", scoreObject.correct);
            window.localStorage.setItem("missed", scoreObject.missed);
            window.localStorage.setItem("accuracy", scoreObject.accuracy);
            window.localStorage.setItem("sentences", scoreObject.sentences);
            window.localStorage.setItem("wpm", scoreObject.wpm);
            window.location.href = "./result.html";
        }
    }, 1000);
    document.onkeydown = (e) => {
        const key = e.key;
        parser.check(parser.parsedData, key);  
        if(parser.isFinished()) {
            const randomNumber = Math.floor(Math.random() * text1.length);
            parsedData = parser.build(text2[randomNumber]);
            japaneseSentence.textContent = text1[randomNumber];
            hiraganaSentence.textContent = text2[randomNumber];
        }
    }
}
