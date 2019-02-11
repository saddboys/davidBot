module.exports =  message => {
    let msg = message.content.split(" ");
    if (msg.length < 2){
        message.channel.send("Usage: !roll [number]");
    } else if (isNaN(msg[1])) {
        message.channel.send("You must specify a positive integer!");
    } else if (parseInt(msg[1])<1){
        message.channel.send("You must specify a positive integer!");
    } else{
        let rng2 = Math.floor((Math.random() * parseInt(msg[1], 10)) + 1);
        message.reply("You have rolled " + rng2.toString())
    }
};