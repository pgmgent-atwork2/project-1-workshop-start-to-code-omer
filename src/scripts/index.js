$(document).ready(function() {
let gamePattern = [];
let userPattern = [];
let gameStarted = false;
let level = 1;
let score = 0;
let bestScore = localStorage.getItem('brainrotBestScore') || 0;
let canClick = false;
let musicPlaying = true;

const gameTitle = $("#game-title");
const scoreDisplay = $("#score-display");
const levelDisplay = $("#level-display");
const bestScoreDisplay = $("#best-score");
const gameMessage = $("#game-message");
const startButton = $("#start-button");
const restartButton = $("#restart-button");
const buttons = $(".brainrot-button");
const musicToggle = $("#music-toggle");
const volumeSlider = $("#volume-slider");

const sounds = {
    success: new Audio("assets/sounds/correct.mp3"),
    wrong: new Audio("assets/sounds/wrong.mp3")
};

const backgroundMusic = new Audio("assets/sounds/game-song.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

const translations = {
    start: "Druk op een toets om te beginnen",
    level: "Niveau: ",
    score: "Score: ",
    bestScore: "Beste score: ",
    gameOver: "Spel voorbij! Je score: ",
    wrongMove: "Verkeerde zet!",
    yourTurn: "Jouw beurt",
    watchPattern: "Kijk naar het patroon",
    musicOn: "Muziek: Aan",
    musicOff: "Muziek: Uit"
};

function init() {
    bestScoreDisplay.text(bestScore);
    startButton.show();
    restartButton.hide();
    updateDisplay();
    
    // music controlpunt
    setupMusicControls();
}

function setupMusicControls() {
    backgroundMusic.play().catch(function(error) {
        console.log("Auto-play prevented: " + error);
        musicPlaying = false;
        musicToggle.text(translations.musicOff);
    });
    
    musicToggle.click(function() {
        if (musicPlaying) {
            backgroundMusic.pause();
            musicPlaying = false;
            musicToggle.text(translations.musicOff);
        } else {
            backgroundMusic.play();
            musicPlaying = true;
            musicToggle.text(translations.musicOn);
        }
    });
    
    volumeSlider.on("input", function() {
        const volume = $(this).val() / 100;
        backgroundMusic.volume = volume;
    });
}

// game start
function startGame() {
    gameStarted = true;
    gamePattern = [];
    userPattern = [];
    level = 1;
    score = 0;
    
    gameTitle.text(translations.watchPattern);
    startButton.hide();
    updateDisplay();
    nextSequence();
}

function updateDisplay() {
    scoreDisplay.text(translations.score + score);
    levelDisplay.text(translations.level + level);
}

function nextSequence() {
    userPattern = [];
    gameMessage.text(translations.watchPattern);
    canClick = false;
    
    const colors = ["red", "blue", "yellow", "green"];
    const randomColor = colors[Math.floor(Math.random() * 4)];
    gamePattern.push(randomColor);
    
    setTimeout(function() {
        let i = 0;
        const interval = setInterval(function() {
            flashButton(gamePattern[i]);
            i++;
            if (i >= gamePattern.length) {
                clearInterval(interval);
                setTimeout(function() {
                    gameMessage.text(translations.yourTurn);
                    canClick = true;
                }, 500);
            }
        }, 800);
    }, 1000);
}

function flashButton(color) {
    const button = $(`.brainrot-button[data-color="${color}"]`);
    button.addClass("lit-up");
    
    setTimeout(function() {
        button.removeClass("lit-up");
    }, 400);
}

function handleButtonClick() {
    if (!gameStarted || !canClick) return;
    
    const color = $(this).data("color");
    userPattern.push(color);
    
    flashButton(color);
    
    checkAnswer();
}

function checkAnswer() {
    const currentMove = userPattern.length - 1;
    
    if (userPattern[currentMove] === gamePattern[currentMove]) {
        if (userPattern.length === gamePattern.length) {
            
            sounds.success.currentTime = 0;
            sounds.success.play();
            
            score += level * 10;
            level++;
            updateDisplay();
            setTimeout(nextSequence, 1000);
        }
    } else {
        
        gameOver();
    }
}


function gameOver() {
    
    sounds.wrong.currentTime = 0;
    sounds.wrong.play();
    
    gameTitle.text(translations.gameOver + score);
    gameMessage.text(translations.wrongMove);
    
    
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('brainrotBestScore', bestScore);
        bestScoreDisplay.text(bestScore);
    }
    
    
    $(".game-container").addClass("game-over");
    setTimeout(function() {
        $(".game-container").removeClass("game-over");
    }, 500);
    
    // voor reset
    gameStarted = false;
    restartButton.show();
    canClick = false;
}


startButton.click(startGame);
restartButton.click(startGame);
buttons.click(handleButtonClick);


$(document).keydown(function(event) {
    
    if (event.keyCode === 32) {
        event.preventDefault();
    }
    
    if (!gameStarted) {
        startGame();
    }
});

init();
});