const line = require('line.js');
const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');

var config = require('./config')
var funcs = require('./util/functions.js');

var Client = new line.Client({
  channelAccessToken: config.line.channelAccessToken,
  channelSecret: config.line.channelSecret,
  port: config.line.port
});

global.notify = (string) => {
  var group = Storage.getItemSync("updateGroup");
  if (group) {
    Client.client.pushMessage(group, {type: "text", text: string});
  }
}

setInterval(function() {
  funcs.getCurrentWar(config.clanTag)
}, 1000 * config.updateInterval)

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

  Been announcing coc wars since ${moment("2017-08-25T23:13:33-05:00").fromNow()}
`

console.log(chalk.green(LogMessage));
