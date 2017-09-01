
exports.run = (client, message, args) => {

  list((list) => {
    message.reply(list);
  })

}
