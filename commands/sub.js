
exports.run = (client, message, args) => {

  var users = Storage.getItemSync("users")

  if (users.indexOf(message.author.id) > -1) return message.reply("you are already subbed");

  users.push(message.author.id);

  Storage.setItemSync("users", users)

  message.reply("you will now recieve updates via dm");
}

exports.description = "subscribe to some bot events";
