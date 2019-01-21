let app = (function(){
    let GameState = Object.freeze({
        "STOPPED": 0, 
        "RUNNING": 1, 
        "POINTS":2
    });

    let state = GameState.STOPPED;
    let words = [];
    let points = [0, 0];
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

        state = GameState.POINTS;

        document.getElementById('btnNext').disabled = true;
        let btnList = document.querySelectorAll('.btnAdd');
        for (let btn of btnList) {
            btn.disabled = false;
        }
    };

    let startGame = function(){
        gameTime = Math.floor(Math.random() * 15 + 15) * 1000;
        setTimeout(function(){
            endGame();
        }, gameTime);
        state = GameState.RUNNING;

        audioTick.timeBetween = 900;
        audioTick.play();
        setTimeout(function(){
            audioTick.timeBetween = 100;
        }, Math.floor(Math.random() * (gameTime / 4)  + (gameTime / 2)));

        document.getElementById('wordDisplay').value = randomWord();
    };

    return {
        load: function(){
            getWords();
            getSound();
            document.getElementById('btnNext').disabled = false;
        },
        click: function(){
            if(state == GameState.STOPPED){
                startGame();
            }
            else if(state == GameState.RUNNING){
                document.getElementById('wordDisplay').value = randomWord();
            }
        },
        add: function(team){
            if(state != GameState.STOPPED){
                return;
            }

            points[team]++;
            state = GameState.STOPPED;

            document.getElementById('btnNext').disabled = false;
            let scoreList = document.querySelectorAll('.teamScore');
            scoreList[team].innerText = points[i];
        }
    }
}());