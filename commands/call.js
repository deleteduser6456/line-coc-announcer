
exports.run = (client, message, args) => {
  var warCalls = Storage.getItemSync("warCalls");

  let number = args[0]

  var warData = Storage.getItemSync(warId);

  if (warData.stats.state == "warEnded" || !warData) return message.reply("there is no war to be calling oponents");

  if (number < 1 || number > 30) {
    return message.reply("bases are only between 1 and 30");
  }

  if(warCalls[number] === "empty"){
    warCalls[number] =  `${message.author.displayName}`;
    Storage.setItemSync("warCalls", warCalls);
    list((list) => {
      message.reply(`you have called ${number}\n${list}`);
    })
  } else if (warCalls[number] === "hide") {
    message.reply("this spot has been 3 star'ed so theirs no point in calling it")
  } else {
    message.reply(`${number} is taken by ${warCalls[number]}`);
  }
}
