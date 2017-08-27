
exports.run = (client, message, args) => {
  var number = args[0];

  var warData = Storage.getItemSync(warId);
  var warCalls = Storage.getItemSync("warCalls");

  if (warData.stats.state == "warEnded") return message.reply("there is no war to be cancelling calls");

  if (number < 0 || number > 30) {
    return message.reply("bases are only between 1 and 30");
  }

  if(warCalls[number] === "empty" ){
    message.reply(`That spot isnt called yet`);
    warCalls[number] = message.author.displayName;
  } else if (warCalls[number] !== message.author.displayName) {
    message.reply("you can't cancel someone elses call");
  } else {
    warCalls[number] = "empty";
    message.reply(`That spot has been cancled`);
  }
}
