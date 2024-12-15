
let dealerSum = 0;
let yourSum = 0;

let bet = 0;
let coins = 50;

const codes = [
    { code: "BONUS123", used: false },
    { code: "PROMO20", used: false },
];

let hasPlayedAgain = true;
let betPlaced = false;
let createAgainButton = false;


let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;


window.onload = LoadGame;

function LoadGame() {
    buildDeck();
    shuffleDeck();
    document.getElementById("your-coins").innerText = coins;
    hideHitStayButtons();
}


function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "../CardImages/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "../CardImages/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    if(reduceAce(yourSum, yourAceCount) == 21) stay();
    document.getElementById("dealer-sum").innerText = getValue(card);
    document.getElementById("your-sum").innerText = reduceAce(yourSum,yourAceCount);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "../CardImages/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    document.getElementById("your-sum").innerText = reduceAce(yourSum,yourAceCount);
    if (reduceAce(yourSum, yourAceCount) > 21 || reduceAce(yourSum, yourAceCount) == 21) stay();
}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    while(dealerSum < 17){
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "../CardImages/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        if(dealerSum > 21 && dealerAceCount > 0){
            while(dealerAceCount){
                dealerSum -= 10;
                dealerAceCount -= 1;
            }    
        }
    }

    yourSum = reduceAce(yourSum, yourAceCount);

    document.getElementById("hidden").src = "../CardImages/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
        bet = 0;
    }
    else if (dealerSum > 21) {
        message = "You win!";
        coins += 2 * bet;
        bet = 0;
    }
    else if (yourSum == dealerSum) {
        message = "Tie!";
        coins += bet;
        bet = 0;
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
        coins += 2*bet;
        bet = 0;
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
        bet = 0;
    }
    betPlaced = false;
    hasPlayedAgain = false;

    document.getElementById("your-bet").innerText = bet;
    document.getElementById("your-coins").innerText = coins;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;

    hideHitStayButtons();
    CreateplayAgainButton();
}



function getValue(card) {
    let data = card.split("-"); 
    let value = data[0];

    if (isNaN(value)) { 
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") return true;
    return false;
}

function reduceAce(playerSum, playerAceCount) {
    if(playerSum > 21 && playerAceCount > 0){
        while(playerAceCount){
            playerSum -= 10;
            playerAceCount -= 1;
        }    
    }
    return playerSum;
}

function place5Euros(){
    if(!betPlaced && hasPlayedAgain){
        if(coins >= 5){
            coins -= 5;
            bet += 5;
            printBet();
            }
        else payUpAlert();
    }
}

function place10Euros(){
    if(!betPlaced && hasPlayedAgain){
        if(coins >= 10){
            coins -= 10;
            bet += 10;
            printBet();
        }
        else payUpAlert();
    }
}

function place20Euros(){
    if(!betPlaced && hasPlayedAgain){
        if(coins >= 20){
            coins -= 20;
            bet += 20;
            printBet();
        }
        else payUpAlert();
    }
}

function place50Euros(){
    if(!betPlaced && hasPlayedAgain){
        if(coins >= 50){
            coins -= 50;
            bet += 50;
            printBet();
        }
        else{
            payUpAlert();
        }
    }
}

function payUpAlert(){
    alert("Please pay you dont have enough money for this action");
}

function resetBet(){
    if(!betPlaced && hasPlayedAgain){
        coins += bet;
        bet = 0;
        printBet();
    }
}

function printBet(){
    document.getElementById("your-bet").innerText = bet;
    document.getElementById("your-coins").innerText = coins;
}

function placeBet() {
    if (bet) {
        betPlaced = true;
        showHitStayButtons();
        hideBetButtons();
        startGame();

        document.getElementById("dealer-text").classList.remove("hidden");
        document.getElementById("dealer-cards").classList.remove("hidden");
        document.getElementById("your-text").classList.remove("hidden");
        document.getElementById("your-cards").classList.remove("hidden");
    } else {
        alert("Please place your bet first");
    }
}

function hideHitStayButtons(){
    document.getElementById("hit").style.display = "none";
    document.getElementById("stay").style.display = "none";
}

function showHitStayButtons(){
    document.getElementById("hit").style.display = "inline";
    document.getElementById("stay").style.display = "inline";
}

function hideBetButtons(){
    document.getElementById("resetbtn").style.display = "none";
    document.getElementById("placeBetbtn").style.display = "none";
}

function showBetButtons(){
    document.getElementById("resetbtn").style.display = "inline";
    document.getElementById("placeBetbtn").style.display = "inline";
}


function CreateplayAgainButton() {
    if (!createAgainButton) {
        createAgainButton = true;
        const playAgainButton = document.createElement("button");
        let tableElement = document.querySelector(".table"); 
        tableElement.appendChild(playAgainButton);
        playAgainButton.id = "play-again-button";
        playAgainButton.textContent = "Play Again";
        playAgainButton.addEventListener("click", playAgain);     
    }
}


function playAgain() {
    if (canPlayAgain()) {
        resetCards(); 
        LoadGame(); 
        showBetButtons();

        hasPlayedAgain = true;

        document.querySelectorAll(".bet-buttons-container img").forEach(img => img.style.display = "inline-block");
        document.getElementById("hit").style.display = "inline-block";
        document.getElementById("stay").style.display = "inline-block";
        hideHitStayButtons();
        canHit = true;
        createAgainButton = false; 
        betPlaced = false; 

        document.getElementById("results").innerText = "";

        document.getElementById("your-text").classList.add("hidden");
        document.getElementById("dealer-text").classList.add("hidden");

        const playAgainButton = document.getElementById("play-again-button");
        if (playAgainButton) {
            playAgainButton.remove();
        }
    } else {
        payUpAlert();
    }
}



function resetCards() {
    yourSum = 0;
    yourAceCount = 0;
    document.getElementById("your-cards").innerHTML = "";

    dealerSum = 0;
    dealerAceCount = 0;
    const dealerCards = document.getElementById("dealer-cards").children;
  
    for (let i = dealerCards.length - 1; i >= 0; i--) {
        const cardImg = dealerCards[i];
        if (!cardImg.id || cardImg.id !== "hidden") {
            cardImg.remove();
        }
    }

    document.getElementById("hidden").src = "../CardImages/BACK.png";
    document.getElementById("dealer-sum").textContent = "";
    document.getElementById("your-sum").textContent = "";
}

function canPlayAgain(){
    if(coins >= 5) return true;
    return false;
}


function checkCode() {
    const inputCode = document.getElementById("code").value.trim();

    const foundCode = codes.find(c => c.code == inputCode);

    if (foundCode) {
        if (foundCode.used) {
            alert("This code has already been used.");
        } else {
            alert("Code accepted!");
            foundCode.used = true;
            coins += 50;
            document.getElementById("your-coins").innerText = coins;
            closeModal();
        }
    } 
    else{
         alert("Invalid code.");
        }
}


function enableCodeInput() {
    const modal = document.getElementById("modal");
    const inputField = document.getElementById("code");

    modal.style.display = "flex";
    inputField.disabled = false;
    inputField.focus(); 
}


function closeModal(event) {
    const modal = document.getElementById("modal");
    if (!event || event.target == modal) {
        modal.style.display = "none";
        const Inputext = document.getElementById("code");
        Inputext.value = "";
    }
}