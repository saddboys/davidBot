module.exports =  message => {

    //create cards
    let rank = ["Ace",2,3,4,5,6,7,8,9,10,"Jack","Queen","King"];
    let suit = ["Hearts", "Clubs", "Diamonds", "Spades"];

    //generate hand
    let rng1 = Math.floor((Math.random() * rank.length));
    let rng2 = Math.floor((Math.random() * suit.length));

    return message.channel.send(`rank[rng1] "of" suit[rng2]`)
};