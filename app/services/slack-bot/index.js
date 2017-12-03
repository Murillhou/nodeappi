if(!process.env.slackbotChannel || !process.env.slackbotToken) {
  throw new Error('Missing environment variables: slackbotChannel, slackbotToken');
}
const Bot = require('./slackbot');
module.exports = new Bot();