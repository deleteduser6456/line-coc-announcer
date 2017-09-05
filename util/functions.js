config = require('../config');

var clashApi = require('clash-of-clans-api');
let client = clashApi({
  token: config.cocApiKey
});

const nodePersist = require('node-persist');
const crypto = require('crypto');

global.Storage = nodePersist.create({
  dir: 'storage',
  expiredInterval: 1000 * 60 * 60 * 24 * 9 // Cleanup Files older than a week + 2 days for prep / war day.
})

Storage.initSync()

var users = Storage.getItemSync("users");
if (!users) {
  Storage.setItemSync("users", []);
}
var warAtt = Storage.getItemSync("warAttacks");
if (!warAtt) {
  warAtt = new Array(31);
  warAtt.fill("empty");
  warAtt[0] = "dont use me"
  Storage.setItemSync("warAttacks", warAtt);
}
var warCalls = Storage.getItemSync("warCalls");
if (!warCalls) {
  warCalls = new Array(31);
  warCalls.fill("empty");
  warCalls[0] = "dont use me"
  Storage.setItemSync("warCalls", warCalls);
}

exports.getCurrentWar = (clanTag, done) => {
  client
  .clanCurrentWarByTag(clanTag)
  .then(response => {
    parseCurrentWar(response);
    if (done) {
      done(response);
    }
  })
  .catch((err) => {
    console.log(err)
  });
}

exports.getWarLog = (clanTag, done) => {
  client
  .clanWarlogByTag(clanTag)
  .then(response => {
    if (done) {
      done(response);
    }
  })
  .catch((err) => {
    console.log(err)
  });
}

exports.getPlayer = (playerTag, done) => {
  client
  .playerByTag(playerTag)
  .then(response => {
    if (done) {
      done(response);
    }
  })
  .catch((err) => {
    console.log(err)
  });
}

global.list = (done) => {
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
          starMsg += ''
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
          starMsg += ''
        }

        list += `${index}. ${call}, ${starMsg} ${percent}%\n`
      } else {
        list += `${index}. ${call}\n`
      }
    }
  })

  if (done) done(list);
}

global.checkForUpdate = (currentCommit, commitComment) => {
  var lastUpdate = Storage.getItemSync("lastUpdate");
  if (!lastUpdate) {
    Storage.setItemSync("lastUpdate", currentCommit);
  } else {
    if (currentCommit !== lastUpdate) {
      var updateMsg = `New Update Available\n
      ${commitComment}`

      notify(updateMsg);
      Storage.setItemSync("lastUpdate", currentCommit);

    }
  }
}

global.notify = (string) => {
  var group = Storage.getItemSync("updateGroup");
  if (group) {
    Client.sendMessage(group, string);
  }
}

global.notifyUsers = (string) => {
  var users = Storage.getItemSync("users");
  if (user.length != 0) {
    users.forEach((user) => {
      client.sendMessage(user, string);
    })
  }
}

global.Players = {}

global.discordReportMessage = (WarData, remindermsg) => {

  var reminder = `${WarData.stats.clan.name} vs ${WarData.stats.opponent.name}\n
  ${remindermsg.title}\n
  ${remindermsg.body}`

  Storage.setItemSync(warId, WarData)

  notify(reminder);

}

global.discordAttackMessage = (WarData, attackData) => {

  let clanPlayer
  let opponentPlayer
  if (attackData.who === 'clan') {
    clanPlayer = Players[attackData.attackerTag]
    opponentPlayer = Players[attackData.defenderTag]


    var warAtt = Storage.getItemSync("warAttacks");
    var warCalls = Storage.getItemSync("warCalls");
    if (attackData.stars === 3) {
      warCalls[opponentPlayer.mapPosition] = "hide";
      Storage.setItemSync("warCalls", warCalls);
    } else {
      var opponentSpot = warAtt[opponentPlayer.mapPosition];

      if (opponentSpot !== "empty") {
        var args = opponentSpot.split(" ");

        var stars = args[0];
        var percent = args[1];

        if (percent < Math.round(attackData.destructionPercentage)) {
          warAtt[opponentPlayer.mapPosition] = `${attackData.stars} ${attackData.destructionPercentage}`
          Storage.setItemSync("warAttacks", warAtt);
        }

      } else {
        warAtt[opponentPlayer.mapPosition] = `${attackData.stars} ${attackData.destructionPercentage}`
        Storage.setItemSync("warAttacks", warAtt);
      }
    }

  } else if (attackData.who === 'opponent') {

  } else {
    return
  }
  var AttackMessage;

  if (attackData.who === 'clan') {
    if (attackData.stars == 1) {
      AttackMessage = `
        ${WarData.stats.clan.name} attacked ${WarData.stats.opponent.name}
        Attacker: ${Players[attackData.attackerTag].name}
        Defender: ${Players[attackData.defenderTag].name}
        destructionPercentage: ${attackData.destructionPercentage}%
        stars: 🌟
      `
    } else if (attackData.stars == 2) {
      AttackMessage = `
        ${WarData.stats.clan.name} attacked ${WarData.stats.opponent.name}
        Attacker: ${Players[attackData.attackerTag].mapPosition}. ${Players[attackData.attackerTag].name}
        Defender: ${Players[attackData.defenderTag].mapPosition}. ${Players[attackData.defenderTag].name}
        destructionPercentage: ${attackData.destructionPercentage}%
        stars: 🌟🌟
      `
    } else if (attackData.stars == 3) {
      AttackMessage = `
        ${WarData.stats.clan.name} attacked ${WarData.stats.opponent.name}
        Attacker: ${Players[attackData.attackerTag].mapPosition}. ${Players[attackData.attackerTag].name}
        Defender: ${Players[attackData.defenderTag].mapPosition}. ${Players[attackData.defenderTag].name}
        destructionPercentage: ${attackData.destructionPercentage}%
        stars: 🌟🌟🌟
      `
    } else {
      AttackMessage = `
        ${WarData.stats.clan.name} attacked ${WarData.stats.opponent.name}
        Attacker: ${Players[attackData.attackerTag].name}
        Defender: ${Players[attackData.defenderTag].name}
        destructionPercentage: ${attackData.destructionPercentage}%
        stars: 0
      `
    }
  }
  if (attackData.who === 'opponent') {
    if (attackData.stars == 1) {
      AttackMessage = `
        ${WarData.stats.opponent.name} attacked ${WarData.stats.clan.name}
        Attacker: ${Players[attackData.attackerTag].mapPosition}. ${Players[attackData.attackerTag].name}
        Defender: ${Players[attackData.defenderTag].mapPosition}. ${Players[attackData.defenderTag].name}
        destructionPercentage: ${attackData.destructionPercentage}%
        stars: 🌟
      `
    } else if (attackData.stars == 2) {
      AttackMessage = `
        ${WarData.stats.opponent.name} attacked ${WarData.stats.clan.name}
        Attacker: ${Players[attackData.attackerTag].mapPosition}. ${Players[attackData.attackerTag].name}
        Defender: ${Players[attackData.defenderTag].mapPosition}. ${Players[attackData.defenderTag].name}
        destructionPercentage: ${attackData.destructionPercentage}%
        stars: 🌟🌟
      `
    } else if (attackData.stars == 3) {
      AttackMessage = `
        ${WarData.stats.opponent.name} attacked ${WarData.stats.clan.name}
        Attacker: ${Players[attackData.attackerTag].mapPosition}. ${Players[attackData.attackerTag].name}
        Defender: ${Players[attackData.defenderTag].mapPosition}. ${Players[attackData.defenderTag].name}
        destructionPercentage: ${attackData.destructionPercentage}%
        stars: 🌟🌟🌟
      `
    } else {
      AttackMessage = `
        ${WarData.stats.opponent.name} attacked ${WarData.stats.clan.name}
        Attacker: ${Players[attackData.attackerTag].mapPosition}. ${Players[attackData.attackerTag].name}
        Defender: ${Players[attackData.defenderTag].mapPosition}. ${Players[attackData.defenderTag].name}
        destructionPercentage: ${attackData.destructionPercentage}%
        stars: 0
      `
    }
  }

  list((list) => {
    WarData.lastReportedAttack = attackData.order
    Storage.setItemSync(warId, WarData);

    AttackMessage += `\n ${list}`;
    notify(AttackMessage);
  })
}

global.fixISO = str => {
  return str.substr(0,4) + "-" + str.substr(4,2) + "-" + str.substr(6,5) + ":" + str.substr(11,2) + ":" +  str.substr(13)
}

global.parseCurrentWar = (war) => {
  // Making sure we actually have war data to mess with lol
  if (war && war.reason != 'accessDenied' && war.state != 'notInWar') {
    let sha1 = crypto.createHash('sha1')
    let opponentTag = war.opponent.tag
    sha1.update(war.clan.tag + opponentTag + war.preparationStartTime)
    global.warId = sha1.digest('hex');

    var WarData = Storage.getItemSync(warId);
    if (!WarData) {
      WarData = { lastReportedAttack: 0, prepDayReported: false, clanCastleReported: false, battleDayReported: false, lastHourReported: false, finalMinutesReported: false }
      var warCall;
      warCalls = new Array(war.teamSize + 1);
      warCalls.fill("empty");
      warCalls[0] = "dont use me"
      Storage.setItemSync("warCalls", warCalls);

      var warAtt;
      warAtt = new Array(war.teamSize + 1);
      warAtt.fill("empty");
      warAtt[0] = "dont use me"
      Storage.setItemSync("warAttacks", warAtt);
    }

    let tmpAttacks = {}
    war.clan.members.forEach(member => {
      Players[member.tag] = member
      if (member.attacks) {
        member.attacks.forEach(attack => {
          tmpAttacks[attack.order] = Object.assign(attack, {who: 'clan'})
        })
      }
    })
    war.opponent.members.forEach(member => {
      Players[member.tag] = member
      if (member.attacks) {
        member.attacks.forEach(attack => {
          tmpAttacks[attack.order] = Object.assign(attack, {who: 'opponent'})
        })
      }
    })

    let TH9v9 = {
      clan: {
        attempt: 0,
        success: 0
      },
      opponent: {
        attempt: 0,
        success: 0
      }
    }
    let TH10v10 = {
      clan: {
        attempt: 0,
        success: 0
      },
      opponent: {
        attempt: 0,
        success: 0
      }
    }
    let TH10v11 = {
      clan: {
        attempt: 0,
        success: 0
      },
      opponent: {
        attempt: 0,
        success: 0
      }
    }
    let TH11v11 = {
      clan: {
        attempt: 0,
        success: 0
      },
      opponent: {
        attempt: 0,
        success: 0
      }
    }
    Object.keys(tmpAttacks).forEach(k => {
      let attack = tmpAttacks[k]
      let clanPlayer
      let opponentPlayer
      if (attack.who === 'clan') {
        clanPlayer = Players[attack.attackerTag]
        opponentPlayer = Players[attack.defenderTag]
      } else if (attack.who === 'opponent') {
        opponentPlayer = Players[attack.attackerTag]
        clanPlayer = Players[attack.defenderTag]
      }
      if (clanPlayer.townhallLevel === 9 && opponentPlayer.townhallLevel === 9) {
        if (attack.who === 'clan') {
          TH9v9.clan.attempt++
        } else if (attack.who === 'opponent') {
          TH9v9.opponent.attempt++
        }
        if (attack.stars === 3) {
          if (attack.who === 'clan') {
            TH9v9.clan.success++
          } else if (attack.who === 'opponent') {
            TH9v9.opponent.success++
          }
        }
      } else if (clanPlayer.townhallLevel === 10) {
        if (opponentPlayer.townhallLevel === 10) {
          if (attack.who === 'clan') {
            TH10v10.clan.attempt++
          } else if (attack.who === 'opponent') {
            TH10v10.opponent.attempt++
          }
          if (attack.stars === 3) {
            if (attack.who === 'clan') {
              TH10v10.clan.success++
            } else if (attack.who === 'opponent') {
              TH10v10.opponent.success++
            }
          }
        } else if (opponentPlayer.townhallLevel === 11) {
          if (attack.who === 'clan') {
            TH10v11.clan.attempt++
          } else if (attack.who === 'opponent') {
            TH10v11.opponent.attempt++
          }
          if (attack.stars === 3) {
            if (attack.who === 'clan') {
              TH10v11.clan.success++
            } else if (attack.who === 'opponent') {
              TH10v11.opponent.success++
            }
          }
        }
      } else if (clanPlayer.townhallLevel === 11 && opponentPlayer.townhallLevel === 11) {
        if (attack.who === 'clan') {
          TH11v11.clan.attempt++
        } else if (attack.who === 'opponent') {
          TH11v11.opponent.attempt++
        }
        if (attack.stars === 3) {
          if (attack.who === 'clan') {
            TH11v11.clan.success++
          } else if (attack.who === 'opponent') {
            TH11v11.opponent.success++
          }
        }
      }
    })

    WarData.stats = {
      state: war.state,
      endTime: war.endTime,
      startTime: war.startTime,
      hitrate: {
        TH9v9: TH9v9,
        TH10v10: TH10v10,
        TH10v11: TH10v11,
        TH11v11: TH11v11
      },
      clan: {
        tag: war.clan.tag,
        name: war.clan.name,
        stars: war.clan.stars,
        attacks: war.clan.attacks,
        destructionPercentage: war.clan.destructionPercentage,
        memberCount: war.clan.members.length
      },
      opponent: {
        tag: war.opponent.tag,
        name: war.opponent.name,
        stars: war.opponent.stars,
        attacks: war.opponent.attacks,
        destructionPercentage: war.opponent.destructionPercentage,
        memberCount: war.opponent.members.length
      }
    }

    let attacks = []
    let earnedStars = {}
    let attacked = {}
    Object.keys(tmpAttacks).forEach(k => {
      let attack = tmpAttacks[k]
      let newStars = 0
      let fresh = false
      if (!attacked[attack.defenderTag]) {
        fresh = true
        attacked[attack.defenderTag] = true
      }
      if (earnedStars[attack.defenderTag]) {
        newStars = attack.stars - earnedStars[attack.defenderTag]
        if (newStars < 0) newStars = 0
        if (earnedStars[attack.defenderTag] < attack.stars) earnedStars[attack.defenderTag] = attack.stars
      } else {
        earnedStars[attack.defenderTag] = attack.stars
        newStars = attack.stars
      }
      attacks.push(Object.assign(attack, {newStars: newStars, fresh: fresh}))
    })

    let startTime = new Date(fixISO(war.startTime))
    let endTime = new Date(fixISO(war.endTime))
    let prepTime = startTime - new Date()
    let remainingTime = endTime - new Date()
    if (war.state == 'preparation') {
      if (!WarData.prepDayReported) {

        let prepDay = config.messages.prepDay
        prepDay.body = prepDay.body.replace('%date%', startTime.toDateString()).replace('%time%', startTime.toTimeString())
        WarData.prepDayReported = true
        discordReportMessage(WarData, prepDay)

      } else if (!WarData.clanCastleReported && prepTime < 120 * 60 * 1000) {
        let clanCastleReminder = config.messages.clanCastleReminder;
        WarData.clanCastleReported = true
        discordReportMessage(WarData, clanCastleReminder);
      }
    }
    if (!WarData.battleDayReported && startTime < new Date()) {

      let battleDay = config.messages.battleDay
      WarData.battleDayReported = true
      discordReportMessage(WarData, battleDay)

    }
    if (!WarData.lastHourReported && remainingTime < 60 * 60 * 1000) {

      let lastHour = config.messages.lastHour
      WarData.lastHourReported = true
      discordReportMessage(WarData, lastHour)

    }
    if (!WarData.finalMinutesReported && remainingTime < config.finalMinutes * 60 * 1000) {

      let finalMinutes = config.messages.finalMinutes
      WarData.finalMinutesReported = true
      discordReportMessage(WarData, finalMinutes)

    }
    let reportFrom = WarData.lastReportedAttack

    attacks.slice(reportFrom).forEach(attack => {

      discordAttackMessage(WarData, attack);

    })
    Storage.setItemSync(warId, WarData);
  } else if (war && war.reason == 'notInWar') {
    console.log(chalk.orange.bold(clan.tag.toUpperCase().replace(/O/g, '0') + ' Clan is not currently in war.'))
  } else if (war && war.reason == 'accessDenied') {
    console.log(chalk.red.bold(clan.tag.toUpperCase().replace(/O/g, '0') + ' War Log is not public'))
  }
}
