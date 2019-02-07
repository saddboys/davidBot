module.exports =  message => {
    let msg = message.content.split(" ");
    if (!isNaN(msg[1])) {
        let rng2 = Math.floor((Math.random() * parseInt(msg[1], 10)) + 1);
        message.reply("You have rolled " + rng2.toString())
    }
};