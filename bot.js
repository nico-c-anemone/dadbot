var Discord = require('discord.io');
var logger = require('winston');
// try to find auth and if it's not there try to get auth code from environment
try {
    var auth = require('./auth.json');
    var authtoken = auth.token
    // do stuff
} catch (ex) {
    var authtoken = process.env.TOKEN;
}
// load external data
var dada = require('./dada.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
  token: authtoken,
  autorun: true
});
bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch(cmd) {
      // !hidad
      // basic ping command
      case 'hidad':
      var msgQuantity=dada.hidad.length;
      var msgNumber=randomInt(0,msgQuantity);
      var msg=dada.hidad[msgNumber];
      bot.sendMessage({
        to: channelID,
        message: msg
      });
      break;
      // !dadjoke
      // tells a random dad joke
      case 'dadjoke':
      var msgQuantity=dada.jokes.length;
      var msgNumber=randomInt(0,msgQuantity);
      var msg=dada.jokes[msgNumber];
      bot.sendMessage({
        to: channelID,
        message: msg
      });
      break;
      case 'dadquote':
      var msgQuantity=dada.quotes.length;
      var msgNumber=randomInt(0,msgQuantity);
      var msg=dada.quotes[msgNumber];
      bot.sendMessage({
        to: channelID,
        message: msg
      });
      case 'dadyn':
      case 'dadyesorno':
      var msgQuantity=dada.yesorno.length;
      var msgNumber=randomInt(0,msgQuantity);
      var msg=dada.yesorno[msgNumber];
      bot.sendMessage({
        to: channelID,
        message: msg
      });
    }
  }
});

//helper functions
function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}
