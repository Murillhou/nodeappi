const conf = require(require('path').join(require('app-root-path').toString(), 'app', 'config'));

if(!conf.slackbotChannel || !conf.slackbotToken) {
  throw new Error('Missing environment variables: slackbotChannel, slackbotToken');
}
const Bot = require('./slackbot');
module.exports = new Bot();