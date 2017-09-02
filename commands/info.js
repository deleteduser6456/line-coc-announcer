const moment = require('moment');

exports.run = (client, message, args) => {
  message.reply(`Created by: KingCosmic\nHope you enjoy it!!! feel free to msg me\nLineID: austyn-studdard\nDiscord: KingCosmic#2713\nEmail: KingCosmicDev@gmail.com\nBeen announcing coc wars since ${moment("2017-08-25T23:13:33-05:00").fromNow()}`)
}

exports.description = "used to see who made the bot ;P"
