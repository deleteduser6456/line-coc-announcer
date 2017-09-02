
exports.run = (client, message, args) => {

  if (args [0]) {
    if (args[1]) {
      notifyUsers(`${args[1]} has requested ${args[0]}`);
    } else {
      notifyUsers(`${msg.author.displayName} has requested ${args[0]}`);
    }
  } else {
    message.reply("you must specify troops to request");
  }
}

exports.description = "request troops `request bowlers` or for small accounts `request bowlers accountname`"
