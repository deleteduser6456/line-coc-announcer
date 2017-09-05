
exports.run = (client, message, args) => {
  client.sendMessage("Ue3983cacaf6d43bef20a02ba8d421f78", args.join(" "));
  message.reply("your issue has been reported thanks for the feedback!")
}

exports.description = "report issues with the bot `report the help command isnt working`"
