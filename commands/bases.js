
exports.run = (client, message, args) => {

  var warData = Storage.getItemSync(warId);

  var list = `${warData.stats.clan.name} vs ${warData.stats.opponent.name}\n\n`

  var warCalls = Storage.getItemSync("warCalls");
  var warAtt = Storage.getItemSync("warAttacks");

  warCalls.forEach((call, index) => {
    if (index == 0) {

    } else if (call === "hide") {

    } else if (call === "empty") {
      if (warAtt[index] !== "empty") {

        var args = warAtt[index].split(" ");
        var stars = args[0];
        var percent = args[1];

        var starMsg = '';

        if (stars == 1) {
          starMsg += '🌟';
        } else if (stars == 2) {
          starMsg += '🌟🌟'
        } else {
          starMsg += '🌟🌟🌟'
        }

        list += `${index}. ${starMsg} ${percent}%\n`
      } else {
        list += `${index}.\n`
      }
    } else {
      if (warAtt[index] !== "empty") {

        var args = warAtt[index].split(" ");
        var stars = args[0];
        var percent = args[1];

        var starMsg = '';

        if (stars == 1) {
          starMsg += '🌟';
        } else if (stars == 2) {
          starMsg += '🌟🌟'
        } else {
          starMsg += '🌟🌟🌟'
        }

        list += `${index}. ${call}, ${starMsg} ${percent}%\n`
      } else {
        list += `${index}. ${call}\n`
      }
    }
  })

  message.reply(list);
}
