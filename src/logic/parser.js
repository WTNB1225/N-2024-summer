class Parser {
    pattern;
    idx1;
    idx2;
    kanaIdx;
    text1; //通常の文章
    text2; //すべてひらがなの文章
    previousChar; //前に入力した文字
    parsedData; //ひらがなのパターンに変換したデータ
    temp;
    hiraganaTemp;
    numberOfCorrectChars;
    numberOfMissedChars;
    numberOfCorrectSentences;

    constructor() {
        this.pattern = [];
        this.idx1 = 0;
        this.idx2 = 0;
        this.kanaIdx = 0;
        this.previousChar = "";
        this.parsedData;
        this.temp = "";
        this.hiraganaTemp = "";
        this.numberOfCorrectChars = 0;
        this.numberOfMissedChars = 0;
        this.numberOfCorrectSentences = 0;
    }

    // ローマ字をひらがなに変換する
    build(hiragana) {
        let threeLetters; 
        let twoLetters;
        let oneLetter;
        const map = romajiMap();
        const parsedData = [];
        //３文字、２文字、１文字ずつ取り出す romajiMapのひらがな部分が3文字から1文字まであるため
        for(let i = 0; i < hiragana.length; i++) {
            threeLetters = hiragana.slice(i, i+3)
            twoLetters = hiragana.slice(i, i+2)
            oneLetter = hiragana.slice(i, i+1)
            if(map.get(threeLetters)) {
                parsedData.push(map.get(threeLetters));
                i += 2;
            } else if(map.get(twoLetters)) {
                parsedData.push(map.get(twoLetters));
                i += 1;
            } else if(map.get(oneLetter)) {
                parsedData.push(map.get(oneLetter));
            }
        }
    
        const dom = document.getElementById("sentence");
        for(let i = 0; i < parsedData.length; i++) {
            for(let j = 0; j < parsedData[i][0].length; j++) {
                const span = document.createElement("span");
                span.textContent = parsedData[i][0][j];
                if(dom) {
                    dom.appendChild(span);
                }
            }
        }
        this.pattern = new Array(parsedData.length).fill(0); 
        this.parsedData = parsedData;
        const hiraganaSentence = document.getElementById("hiragana-sentence");
        if(hiraganaSentence) {
            hiraganaSentence.textContent = "しんちくまんしょん";
        }
    }

    //入力判定
    check(parsedData, key) {
        const sentence = document.getElementById("sentence");
        const hiraganaSentence = document.getElementById("hiragana-sentence");
        let tempIdx = this.idx2;

        const nextChar = parsedData[this.idx1][this.pattern[this.idx1]][tempIdx+1];
        if(key == "Escape") {
            //todo 中断
        } else {
            this.temp += key; //別パターンを判定するために入力された文字を一時保存
            if(key == parsedData[this.idx1][this.pattern[this.idx1]][this.idx2]) { //正解した場合
                this.hiraganaTemp += key; //ひらがな色付けのために入力された文字を一時保存
                sentence.innerHTML = this.colorTypedRoma();
                this.idx2++;
                console.log("correct");
                if(this.idx2 == parsedData[this.idx1][this.pattern[this.idx1]].length) {
                    if(this.idx1 == parsedData.length -1) {
                        //todo 終了
                        sentence.textContent = "";
                    } else {
                        this.idx1++;
                        this.idx2 = 0;
                        this.temp = "";
                    }
                }
            } else {
                //正規表現を使用して、入力された文字が別のパターンに含まれているか判定
                let reg = new RegExp("^" + this.temp);
                for(let i = 0; i < parsedData[this.idx1].length; i++) {
                    if(parsedData[this.idx1][i].match(reg)) {
                        this.pattern[this.idx1] = i;
                        break;
                    }
                }
                if(key == parsedData[this.idx1][this.pattern[this.idx1]][this.idx2]) {
                    this.hiraganaTemp += key;
                    console.log("correct");
                    sentence.innerHTML = this.colorTypedRoma();
                    this.prevChar = key;
                    this.idx2++;
                    if(this.idx2 !== this.parsedData[this.idx1][this.pattern[this.idx1]].length) {
                        return;
                    }
                } else {
                    //どのパターンにも含まれていない場合は、仮保存した文字を削除
                    this.temp = this.temp.slice(0, -1);
                }

                if(this.idx2 == parsedData[this.idx1][this.pattern[this.idx1]].length) {
                    if(this.idx1 == parsedData.length -1) {
                        //todo 終了
                        sentence.textContent = "";
                    } else {
                        this.idx1++;
                        this.idx2 = 0;
                        this.temp = "";
                    }
                }
            }
        }

    }

    //文章を最後まで入力したかを確認するメソッド
    isFinished() {
        if(this.idx2 == thid.parsedData[this.idx1][this.pattern[this.idx1]].length && this.idx1 == this.parsedData.length - 1) {
            this.idx1 = 0;
            this.idx2 = 0;
            this.temp = "";
            this.hiraganaTemp = "";
            this.kanaIdx = 0;
            this.prevChar = "";
            this.pattern = [];
            this.parsedData = [];
            this.numberOfCorrectSentences++;
            return true;
        } else {
            return false;
        }
    }

    //入力された文字を色付けするメソッド
    colorTypedJapanese() {
        const hiraganaSentence = document.getElementById("hiragana-sentence");
        if(!hiraganaSentence) return;
        let str = hiraganaSentence.textContent;
        if(!str) return;
        let html = "";
        html += "<span style='color: green;'>" + str.slice(0, this.kanaIdx+1) + "</span>" + "<span>" + str.slice(this.kanaIdx+1) + "</span>"; 
        return html;
    }

    //入力されたローマ字を色付けするメソッド
    //入力された部分のidx1の部分で分ける
    colorTypedRoma() {
        let html = "<div><span style='color: green;'>";
        if(this.idx1 > 0) {
            for(let i = 0; i < this.idx1; i++) {
                html += this.parsedData[i][this.pattern[i]];
            }
        }
        for(let i = 0; i <= this.idx2; i++) {
            html += this.parsedData[this.idx1][this.pattern[this.idx1]][i];
        }
        html += "</span><span>";
        for(let i = this.idx2 + 1; i < this.parsedData[this.idx1][this.pattern[this.idx1]].length; i++) {
            html += this.parsedData[this.idx1][this.pattern[this.idx1]][i];
        }
        for(let i = this.idx1 + 1; i < this.parsedData.length; i++) {
            html += this.parsedData[i][this.pattern[i]];
        }
        html += "</span></div>";
        return html;
    }

    //タイピングに使う文章を入力するメソッド
    setData(text1, text2) {
        this.text1 = text1;
        this.text2 = text2;
    }
}


const parser = new Parser();
parser.build("しんばし");
document.onkeydown = (e) => {
    const key = e.key;
    console.log(key);
    parser.check(parser.parsedData, key);
   // console.log(parser.idx1)
    console.log(parser.temp)
    //onsole.log(parser.idx2)
}