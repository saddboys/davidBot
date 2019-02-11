module.exports = message => {
    let reply = message.content.replace('!google ', '');
    reply = reply.replace(/ /g, '%20');


    return message.channel.send('https://www.google.com/search?q=' + reply)
}