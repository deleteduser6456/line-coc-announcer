
exports.run = (client, message, args) => {
  Storage.setItemSync("updateGroup", message.group.id);
  message.reply("this goup will now recieve updates");
}
