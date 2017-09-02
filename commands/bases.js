
exports.run = (client, message, args) => {

  list((list) => {
    message.reply(list);
  })

}

exports.description = "get the list of calls `bases`"
