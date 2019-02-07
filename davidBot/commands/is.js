"user strict"

module.exports =  message => {
    let rng = Math.floor((Math.random() * 2) + 1);
    if (rng === 1) {
        message.channel.send(`Yes`)
    } else {
        message.channel.send(`No`)
    }
}