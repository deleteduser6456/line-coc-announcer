
exports.run = (client, message, args) => {

  var users = Storage.getItemSync("users")

  var index = users.indexOf(message.author.id);

  if (index == -1) return message.reply("you haven't subsrcibed to unsubscribe");

  users.splice(index, 1);

  Storage.setItemSync("users", users)

  message.reply("you will stop recieving updates via dm");

}

exports.description = "stop recieving some bot uevents";
