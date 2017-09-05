

exports.run = (client, message, args) => {
  client.sendMessage("Ue3983cacaf6d43bef20a02ba8d421f78", args.join(" "));
  message.reply("your suggestion has been sent thanks for the feedback!")
}

exports.description = "suggest improvements to the bot `suggest this would be a cool command`"
