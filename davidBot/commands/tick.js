let tick;

let tickInit = function(message){
    tick = 0;
    message.channel.send(tick)
};

let tickUp = function(message){
  tick++;
  message.channel.send(tick)
};

exports.tickInit = tickInit;
exports.tickUp = tickUp;
exports.tick = tick;