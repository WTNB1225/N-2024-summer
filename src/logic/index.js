const randomNumber = Math.floor(Math.random() * theme1HiraganaOnlyTexts.length);
const parser = new Parser();
const sentence = document.getElementById('sentence');
const hiraganaSentence = document.getElementById('hiragana-sentence');
const japaneseSentence = document.getElementById('japanese-sentence');
const remainingTimeDom = document.getElementById('time');
let remainingTime = 10;
parser.setData(theme1NormalTexts[randomNumber], theme1HiraganaOnlyTexts[randomNumber]);
let parsedData = parser.build(parser.text2);
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
    console.log(key);
    parser.check(parser.parsedData, key);  
    if(parser.isFinished()) {
        const randomNumber = Math.floor(Math.random() * theme1HiraganaOnlyTexts.length);
        parsedData = parser.build(theme1HiraganaOnlyTexts[randomNumber]);
        japaneseSentence.textContent = theme1NormalTexts[randomNumber];
        hiraganaSentence.textContent = theme1HiraganaOnlyTexts[randomNumber];

    }
}
