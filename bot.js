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
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
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
      bot.sendMessage({
        to: channelID,
        message: 'Hello, my child!'
      });
      break;
      // !dadjoke
      // tells a random dad joke
      case 'dadjoke':
      var jokes=[
        "A ham sandwich walks into a bar and orders a beer. Bartender says, 'Sorry we don't serve food here.'",
        "Why do chicken coops only have two doors? Because if they had four, they would be chicken sedans!",
        "How do you make a Kleenex dance? Put a little boogie in it!",
        "Two peanuts were walking down the street. One was a salted."
      ];
      var numberOfJokes=jokes.length;
      var jokeNumber=randomInt(0,numberOfJokes);
      var joke=jokes[jokeNumber];
      bot.sendMessage({
        to: channelID,
        message: joke
      });
      break;
      case 'advice':
    }
  }
});

//helper functions
function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}
