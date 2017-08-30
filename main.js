const line = require('line.js');
const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');
const rp = require('request-promise');

var config = require('./config')
var funcs = require('./util/functions.js');

global.Client = new line.Client({
  channelAccessToken: config.line.channelAccessToken,
  channelSecret: config.line.channelSecret,
  port: config.line.port
});

var options = {
  uri: 'https://api.github.com/repos/KingCosmic/line-coc-announcer/commits',
  headers: {
    'User-Agent': 'line-coc-announcer'
  },
  json: true // Automatically parses the JSON string in the response
};

rp(options)
.then(function (data) {
  checkForUpdate(data[0].sha, data[0].commit.message);
})

setInterval(function() {
  rp(options)
  .then(function (data) {
    checkForUpdate(data[0].sha, data[0].commit.message)
  })
}, 1000 * (60 * 10));

setInterval(function() {
  funcs.getCurrentWar(config.clanTag)
}, 1000 * config.updateInterval);

funcs.getCurrentWar(config.clanTag)

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./commands/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    Client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

Client.on("message", (message) => {

  // This is the best way to define args. Trust me.
  const args = message.content.slice(0).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // The list of if/else is replaced with those simple 2 lines:
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(Client, message, args);
  } catch (err) {

  }
});

var LogMessage = `
             --------------
             |Line War Bot|
        ------------------------
        |Created by: KingCosmic|
        | Hope you enjoy it!!! |
        | feel free to msg me  |
        ------------------------
        LineID: austyn-studdard
        Discord: KingCosmic#2713
        Email: KingCosmicDev@gmail.com

  Been announcing coc wars since ${moment("2017-08-25T23:13:33-05:00").format("MMM Do YYYY")}
`

console.log(chalk.green(LogMessage));
