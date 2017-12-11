const conf = require(require('path').join(require('app-root-path').toString(), 'app', 'config'));
if(!conf.mqttMaxClients) {
  throw new Error('Missing environment variables: mqttMaxClients');
}
const Clients = require('./mqtt-clients');

module.exports = new Clients(conf.mqttMaxClients);