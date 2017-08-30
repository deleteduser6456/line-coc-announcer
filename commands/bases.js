
exports.run = (client, message, args) => {

  var warData = Storage.getItemSync(warId);

  var list = `${warData.stats.clan.name} vs ${warData.stats.opponent.name}\n\n`

  var warCalls = Storage.getItemSync("warCalls");

  warCalls.forEach((call, index) => {
    if (index == 0) {

    }else if (call === "hide") {

    } else if (call === "empty") {
      list += `${index}.\n`
    } else {
      list += `${index}. ${call}\n`
    }
  })

  msg.reply(list);
}
