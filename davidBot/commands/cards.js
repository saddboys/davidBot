const shuffle = require('../scripts/shuffle');

let currentGame;
let cardsSet = ["AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "XH", "JH", "QH", "KH",
                "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "XS", "JS", "QS", "KS",
                "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "XD", "JD", "QD", "KD",
                "AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "XC", "JC", "QC", "KC",
                "JKR", "JKR"];
let emojiMaker = {
    'A': "🇦",
    '2': "2⃣",
    '3': "3⃣",
    '4': "4⃣",
    '5': "5⃣",
    '6': "6⃣",
    '7': "7⃣",
    '8': "8⃣",
    '9': "9⃣",
    'X': "🔟",
    'J': "🇯",
    'Q': "🇶",
    'K': "🇰",
    'C': "♣",
    'S': "♠",
    'D': "♦",
    'H': "♥",
    'Z':"🃏"
};


let cardsProcessor = function(message){
    let command = message.content.split(" ");
    if (command.length === 1) {
        message.channel.send("Usage: !cards [command]\n" +
            "Commands Include: \n" +
            "!cards join\n" +
            "!cards start\n" +
            "!cards draw [int]\n" +
            "!cards play [card] [card] [card] etc.\n" +
            "!cards play deck [int]\n" +
            "!cards check" +
            "Card format: AH (Ace Hearts), 2S (2 Spades), 3D (3 Diamonds), XC (10 Clubs), JH (Jack Hearts)" +
            ", QH (Queen Hearts), KH (King Hearts), JK (Joker)")
    } else if (command[1] === "join") {
        cardsJoin(message);
    } else if ((currentGame === undefined) || (currentGame=== null)) {
        message.channel.send("Please do !cards join to start a game first")
    } else if (currentGame.players[message.author] === undefined){
        message.reply("You are not in the current game!")
    } else if (command[1] === "start" ){
        cardsStart(message);
    } else if (command[1] === "play"){
        cardsPlay(message);
    } else if (command[1] === "draw"){
        cardsDraw(message)
    } else if (command[1] === "check"){
        cardsCheck(message)
    } else if (command[1] === "stop"){
        cardsStop(message)
    }
};
/**
 * Allows a user to join a card game
 * @param message
 */
let cardsJoin = function(message) {

    //setup game object
    if (currentGame === undefined || currentGame === null) {
        currentGame = {
            players: {},
            channel: message.channel,
            started: false,
            deck: [],
            lastPlay: "Nothing"
        };

        message.channel.send("Created a game in this channel!")
    }

    //add player to game
    if (currentGame.started === false) {

        currentGame.players[message.author] = {
            hand: []
        };
    } else {
        message.channel.send("A Game has already started! You cannot (re)join this game")
    }
};

/**
 * Starts a game of cards
 * @param message
 */
let cardsStart = function(message){

    currentGame.started = true;
    let players = Object.keys(currentGame.players);

    currentGame.deck = shuffle(cardsSet);

    message.channel.send("Game Started! The current players are: " + players.toString() + "\n " +
        "type '!cards draw [int]' to draw [int] cards")

};

/**
 * Stops the current card game
 * @param message
 */
let cardsStop = function(message){
    currentGame = undefined;
    currentGame.channel.send("Stopping card game...")
};

/**
 * Lets the user draw x cards from the deck
 * @param message
 */
let cardsDraw = function(message){
    let command = message.content.split(" ");
    if (command.length<3){
        message.channel.send("Usage: !cards draw [int]")
    } else {
        let drawParam = command[2];

        //limit to positive integers
        if (isNaN(drawParam) || parseInt(drawParam) < 1){
            message.channel.send("Please input a positive integer only!")
        } else {
            let drawNum = parseInt(drawParam);
            let player = message.author;
            //draw x cards
            let drawnCards = [];
            for (let i=0;i<drawNum;i++){
                drawnCards[drawnCards.length] = currentGame.deck[1];
                currentGame.deck.shift()
            }
            currentGame.players[message.author].hand = currentGame.players[message.author].hand.concat(drawnCards);
            currentGame.channel.send(message.author + " has drawn " + drawParam + " cards")
            message.author.send("You have drawn: " + drawnCards.toString() + "\n" +
                "You currently have: " + currentGame.players[message.author].hand.sort().toString())
        }
    }
};

/**
 * Plays the cards from the user's deck specified by user
 * @param message
 */
let cardsPlay = function(message){
    let command = message.content.split(" ");
    if (command.length>=3) {
        let cardsPlayed = command.slice(2, (command.length));
        let allCardsExist = true;

        //check if player has those cards on hand
        for (let i =0; i<cardsPlayed.length; i++){
            if (!currentGame.players[message.author].hand.includes(cardsPlayed[i])){
                allCardsExist = false;
            }
        }

        if (!allCardsExist){
            message.reply("You do not have one of the cards played!")
        } else {
            currentGame.players[message.author].hand = currentGame.players[message.author].hand.filter( function( el ) {
                return !cardsPlayed.includes( el );
            } );
            currentGame.channel.send(message.author + " has played: " + cardsPlayed.toString())
        }

    } else {
        message.reply("Please specify cards you wish to play!\n" +
            "Usage: '!cards play 3H 4D 5D'")
    }

};

/**
 * Allows the user to check what cards they have
 * @param message
 */
let cardsCheck = function(message){
    message.author.send("You currently have: " + currentGame.players[message.author].hand.sort().toString())
};

exports.cardsProcessor = cardsProcessor;