const moment = require('moment')

exports.run = (client, message, args) => {
  if (args[0]) {
    let clanTag = args[0].toUpperCase().replace(/O/g, '0')
    if (Clans[clanTag]) {
      let WarData = Clans[clanTag].getWarData()
      if (WarData) {
        discordStatsMessage(WarData, message)
      } else {
        message.reply('War data is missing try again in a little bit. I might still be fetching the data.')
      }
    } else {
      message.reply('I don\'t appear to have any war data for that clan.')
    }
  } else {

    let WarData = Storage.getItemSync(warId)
    if (WarData) {
      discordStatsMessage(WarData, message)
    } else {
      message.reply('War data is missing try again in a little bit. I might still be fetching the data.')
    }

  }
}

function discordStatsMessage(WarData, message) {
  let extraMessage = ''
  if (WarData.stats.state === 'preparation') {
    extraMessage = 'War starts ' + moment(WarData.stats.startTime).fromNow()
  } else if (WarData.stats.state === 'inWar') {
    extraMessage = 'War ends ' + moment(WarData.stats.endTime).fromNow()
  } else if (WarData.stats.state === 'warEnded') {
    extraMessage = 'War ended ' + moment(WarData.stats.endTime).fromNow()
  }
  var StatsMsg = `${WarData.stats.clan.name} vs ${WarData.stats.opponent.name}\n${extraMessage}`

  StatsMsg += "\n"
  StatsMsg += `memberCount: ${WarData.stats.clan.memberCount} vs ${WarData.stats.opponent.memberCount}\n`
  StatsMsg += `Attacks: ${WarData.stats.clan.attacks} vs ${WarData.stats.opponent.attacks * 2}\n`
  StatsMsg += `DestructionPercentage\n${WarData.stats.clan.destructionPercentage}% vs ${WarData.stats.opponent.destructionPercentage}% \n`
  StatsMsg += `Stars: ${WarData.stats.clan.stars} vs ${WarData.stats.opponent.stars}\n`

  message.reply(StatsMsg)
}
