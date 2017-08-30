
exports.run = (client, message, args) => {
  var list = ""

  var warCalls = Storage.getItemSync("warCalls");

  warCalls.forEach((call, index) => {
    if (index == 0) {

    } else if (call === "empty") {
      list += `${index} \n `
    }
  })


  message.reply(list);
}
