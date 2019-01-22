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

    let buttonNext;
    let buttonTeam1;
    let buttonTeam2;
    let labelTeam1;
    let labelTeam2;
    let labelWord;
    
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
            if(state != GameState.RUNNING){
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
        state = GameState.POINTS;

        updateUI();

        audioTick.pause();
        audioTick.currentTime = 0;
        audioRing.play();
    };

    let startGame = function(){
        gameTime = Math.floor(Math.random() * 15 + 15) * 1000;
        setTimeout(function(){
            endGame();
        }, gameTime);
        state = GameState.RUNNING;

        updateUI();

        audioTick.timeBetween = 900;
        audioTick.play();
        setTimeout(function(){
            audioTick.timeBetween = 100;
        }, Math.floor(Math.random() * (gameTime / 4)  + (gameTime / 2)));
    };

    let updateUI = function(){
        if(state == GameState.STOPPED){
            buttonNext.innerText = "Démarrer";
            buttonNext.disabled = false;
        }
        else if(state == GameState.RUNNING){
            buttonNext.innerText = "Prochain";
            buttonNext.disabled = false;
        }
        else if(state == GameState.POINTS){
            buttonNext.innerText = "Démarrer";
            buttonNext.disabled = true;
        }

        labelTeam1.innerText = points[0];
        labelTeam2.innerText = points[1];
    };

    return {
        load: function(){
            getWords();
            getSound();

            buttonNext = document.getElementById("btnNext");
            buttonTeam1 = document.querySelector("#scoreDisplay > :first-child");
            buttonTeam2 = document.querySelector("#scoreDisplay > :last-child");
            labelTeam1 = document.querySelector("#scoreDisplay > :first-child .teamScore");
            labelTeam2 = document.querySelector("#scoreDisplay > :last-child .teamScore");
            labelWord = document.getElementById("wordDisplay");

            updateUI();
        },
        click: function(){
            if(state == GameState.STOPPED){
                startGame();
                this.click();
            }
            else if(state == GameState.RUNNING){
                labelWord.innerText = randomWord();
            }
        },
        add: function(team){
            if(state != GameState.STOPPED){
                return;
            }

            state = GameState.STOPPED;
            points[team]++;

            updateUI();
        }
    }
}());