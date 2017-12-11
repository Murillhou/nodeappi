const _ = require('lodash'),
  slack = require('slack'),
  conf = require(require('path').join(require('app-root-path').toString(), 'app', 'config'));
class Bot {
  constructor() {
    slack.channels.list({ token: conf.slackbotToken })
      .then(result => {
        if(!_.find(result.channels, c => c.name === conf.slackbotChannel)) {
          throw new Error('Specified channel doesn´t exists.');
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  }
  postMessage(text) {

    return slack.chat.postMessage({
      token: conf.slackbotToken,
      channel: conf.slackbotChannel,
      text
    });
  }
}
module.exports = Bot;