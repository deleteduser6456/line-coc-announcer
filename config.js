module.exports = {
  line: {
    channelAccessToken: "",
    channelSecret: "",
    port: "8080"
  },
  updateInterval: 60 * 2, // 2 Minutes
  cocApiKey: '',
  clanTag: "",
  finalMinutes: 15,
  messages: {
    prepDay: {
      title: 'War has been declared',
      body: 'The battle begins %date%\n@ %time%'
    },
    battleDay: {
      title: 'The war has begun!',
      body: 'Attack!'
    },
    lastHour: {
      title: 'The final hour is upon us!',
      body: 'If you haven\'t made both of your attacks you better get on it.'
    },
    finalMinutes: {
      title: 'The final minutes are here!',
      body: 'If you haven\'t made both of your attacks you better get on it.'
    }
  }
}
