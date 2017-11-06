const Clients = require('./mqtt-clients');
module.exports = new Clients(process.env.mqttMaxClients);