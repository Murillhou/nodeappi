const Clients = require('./mqtt-clients'),
  config = require('./config');
module.exports = new Clients(config.maxClients);