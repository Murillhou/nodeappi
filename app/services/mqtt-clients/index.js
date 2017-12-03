if(!process.env.mqttMaxClients) {
  throw new Error('Missing environment variables: mqttMaxClients');
}
const Clients = require('./mqtt-clients');
module.exports = new Clients(process.env.mqttMaxClients);