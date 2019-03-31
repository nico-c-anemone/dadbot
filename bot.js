var Discord = require('discord.io');
var logger = require('winston');
var mkdirp = require("mkdirp");
const fs = require('fs');
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

// some hard-coded data :(
var dataDirPrefix="data";
var beerCoolDown=30*60; // 30 minutes per beer

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
      break;
      case 'dadyn':
      case 'dadyesorno':
      var msgQuantity=dada.yesorno.length;
      var msgNumber=randomInt(0,msgQuantity);
      var msg=dada.yesorno[msgNumber];
      bot.sendMessage({
        to: channelID,
        message: msg
      });
      break;
      case 'givedadabeer':
      giveDadABeer(userID,channelID);
      break;
    }
  }
});

//helper functions
function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

function createDir(_dirName, callback) {
  mkdirp(_dirName, function(err) {
    // if any errors then print the errors to our discord
    if (err) console.log(err);
    else {callback();}
  });

}

function giveDadABeer(_userID,_channelID) {
  // check timestamp
  // make sure we have a data directory
  var dir=dataDirPrefix+"/"
  createDir(dir,function() {
    var cooldown=getBeerCoolDownTime();
    if (cooldown>beerCoolDown) {

      var serverID = bot.channels[_channelID].guild_id;
      var dir=dataDirPrefix+"/"+serverID+"/"+_userID;
      createDir(dir,function() {

        // SUCCESS MESSAGE
        var msg="thanks, <@!"+_userID+">!";
        bot.sendMessage({
          to: _channelID,
          message: msg

        });
      });
    } else {
      var msg="Cool it, <@!"+_userID+">, I'm already drinking a beer! Give me about "+Math.floor((beerCoolDown-cooldown)/60)+" minutes to finish this one.";
      bot.sendMessage({
        to: _channelID,
        message: msg
      });
    }
  });
}

function getBeerCoolDownTime() {
  var coolDownTime=beerCoolDown;
  fileName=dataDirPrefix+"/timestamp.json"
  if (fs.existsSync(fileName)) {
    var timestamp = parseInt(JSON.parse(fs.readFileSync(fileName, 'utf8')).unix);
    if (typeof timestamp != "number" || isNaN(timestamp)) timestamp=0;
    var currentUnix = Math.round(+new Date()/1000);
    coolDownTime=((currentUnix-timestamp)>0)?currentUnix-timestamp:0;
    console.log("timestamp: "+timestamp+"\ncurrent: "+currentUnix+"\ndiff: "+(currentUnix-timestamp));
    if (coolDownTime>beerCoolDown) {
      writeTimestampToFile (currentUnix,fileName);
    }
  } else {
    var unix = Math.round(+new Date()/1000);
    writeTimestampToFile (unix,fileName);
  }
  return coolDownTime;
}

function getBeerCoolDownPassed() {
  // does timestamp file exist?
  fileName=dataDirPrefix+"/timestamp.json"
  pass=false;
  if (fs.existsSync(fileName)) {
    var timestamp = parseInt(JSON.parse(fs.readFileSync(fileName, 'utf8')).unix);
    if (typeof timestamp != "number" || isNaN(timestamp)) timestamp=0;
    var currentUnix = Math.round(+new Date()/1000);
    console.log("timestamp: "+timestamp+"\ncurrent: "+currentUnix+"\ndiff: "+(currentUnix-timestamp));
    if ((currentUnix-timestamp)>beerCoolDown) {
      pass=writeTimestampToFile (currentUnix,fileName);
    }
  } else {
    var unix = Math.round(+new Date()/1000);
    pass=writeTimestampToFile (unix,fileName);
  }
  return pass;
}

function writeTimestampToFile (u,f) {
  var t={"unix":u};
  console.log("tryna write "+JSON.stringify(t)+" to file "+f)
  try {
    fs.writeFileSync(f, JSON.stringify(t));
    pass=true;
  } catch (err) {
    console.log(err);
    pass=false;
  }
  return pass;
}
