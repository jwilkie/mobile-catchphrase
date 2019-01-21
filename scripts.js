let app = (function(){
    let words = [];
    let points = [0, 0];
    let running = false;
    let gameTime = 0;
    let audioTick;
    let audioRing;
    
    let getWords = function(){
        let request = new XMLHttpRequest();
        request.open('GET', './words.txt', true);
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status == 200) {
                words = request.responseText.split('\n');
                console.log(words);
            }
        }

        request.send();
    };

    let getSound = function(){
        audioRing = new Audio('./ring.mp3');
        audioTick = new Audio('./tick.mp3');
        audioTick.timeBetween = 900;
        audioTick.onended = function(){
            if(!running){
                return;
            }

            setTimeout(function(){
                audioTick.play();
            }, audioTick.timeBetween);
        }
    };

    let randomWord = function(){
        let index = Math.floor(Math.random() * words.length);
        return words[index];
    };

    let endGame = function(){
        audioTick.pause();
        audioTick.currentTime = 0;
        audioRing.play();

        running = false;

        document.getElementById('btnNext').disabled = true;
        let btnList = document.querySelectorAll('.btnAdd');
        for (let btn of btnList) {
            btn.disabled = false;
        }
    };

    let loadGame = function(){
        getWords();
        getSound();
    };

    let startGame = function(){
        running = true;
        gameTime = Math.floor(Math.random() * 15 + 15) * 1000;

        setTimeout(function(){
            endGame();
        }, gameTime);

        document.getElementById('btnStart').disabled = true;
        document.getElementById('btnNext').disabled = false;
        document.getElementById('displayWord').innerText = randomWord();

        audioTick.timeBetween = 900;
        audioTick.play();
        setTimeout(function(){
            audioTick.timeBetween = 100;
        }, Math.floor(Math.random() * (gameTime / 4)  + (gameTime / 2)));
    };

    let nextWord = function(){
        document.getElementById('displayWord').innerText = randomWord();
    };

    let addPoint = function(team){
        points[team]++;
        document.getElementById('btnStart').disabled = false;
        let scoreList = document.querySelectorAll('.teamScore');
        for (let i = 0 ; i < scoreList.length ; i++) {
            scoreList[i].innerText = points[i];
        }
        let btnList = document.querySelectorAll('.btnAdd');
        for (let btn of btnList) {
            btn.disabled = true;
        }
    };

    return {
        load: loadGame,
        start: startGame,
        next: nextWord,
        add: addPoint
    }
}());