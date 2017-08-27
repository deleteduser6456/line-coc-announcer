
exports.run = (client, message, args) => {
  var requestMessage = `RequestedBy: ${message.author.displayName}
  TroopsRequested: ${args.join(" ")}`

  notify(request)

}
