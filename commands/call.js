
exports.run = (client, message, args) => {
  var warCalls = Storage.getItemSync("warCalls");

  let number = args[0]

  var warData = Storage.getItemSync(warId);

  if (warData.stats.state == "warEnded") return message.reply("there is no war to be calling oponents");

  if (number < 0 || number > 30) {
    return message.reply("bases are only between 1 and 30");
  }

  if(warCalls[number] === "empty"){
    warCalls[number] =  `${message.author.displayName}`;
    Storage.setItemSync("warCalls", warCalls);

    message.reply(`you have called ${number}`);
    notify(`${message.author.displayName} has called, ${number}`)
  } else {
    message.reply(`That spot is taken by ${warCalls[number]}`);
  }
}
