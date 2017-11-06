const _ = require('lodash'),
  slack = require('slack');
class Bot {
  constructor() {
    slack.channels.list({ token: process.env.slackbotToken })
      .then(result => {
        if(!_.find(result.channels, c => c.name === process.env.slackbotChannel)) {
          throw new Error('Specified channel doesn´t exists.');
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  }
  postMessage(text) {
    return slack.chat.postMessage({ token: process.env.slackbotToken, channel: process.env.slackbotChannel, text });
  }
}
module.exports = Bot;