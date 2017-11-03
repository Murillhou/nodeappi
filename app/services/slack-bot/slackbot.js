const _ = require('lodash'),
  slack = require('slack');
class Bot {
  constructor() {
    this.config = require('./config');
    slack.channels.list({ token: this.config.token })
      .then(result => {
        if(!_.find(result.channels, c => c.name === this.config.channel)) {
          throw new Error('Specified channel doesn´t exists.');
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  }
  postMessage(text) {
    return slack.chat.postMessage({ token: this.config.token, channel: this.config.channel, text });
  }
}
module.exports = Bot;