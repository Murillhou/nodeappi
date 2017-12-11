const _ = require('lodash'),
  mqtt = require('mqtt');
class Clients {
  constructor(maxSize, ...clients) {
    if(clients.length > maxSize) {
      throw Error('Initial clients number exceed the specified max length.');
    }
    this.maxClients = maxSize;
    //TODO check clients objects
    this.clientsStore = {
      clients,
      maxClients: this.maxClients,
      addClient: client => clients.length < this.maxClients ?
        clients.push(client) : new Error('Max clients size exceeded.'),
      getClient: cid => _.find(clients, c => c.options.clientId === cid),
      deleteClient: cid => _.pull(clients, _.find(clients, c => c.options.clientId === cid))
    };
  }

  newClient(host, port, clientId, user, password) {
    return new Promise((resolve, reject) => {
      try {
        const opts = require('./mqtt-connect-options');
        opts.clientId = clientId;
        if(user && password) {
          opts.user = user;
          opts.password = password;
        }
        if(this.clientsStore.getClient(clientId)) {
          if(this.clientsStore.getClient(clientId).connected) {
            return resolve({ message: 'Specified client already exists.' });
          } else {
            this.clientsStore.deleteClient(clientId);
          }
        }
        const c = mqtt.connect(host + ':' + port, opts);
        c.once('connect', () => {
          this.clientsStore.addClient(c);
          return resolve({ message: 'Client succesfully created and connected.' });
        });
        setTimeout(() => reject({ message: 'Timeout while trying to conect the new client.' }), 10000);
      } catch(exception) {
        return reject({
          message: 'Error while trying to create and conect a new client.',
          error: exception
        });
      }
    });
  }
  setOnConnected(clientId, onConnected) {
    this.clientsStore.getClient(clientId).on('connect', onConnected);
  }
  setOnConnectionLost(clientId, onConnectionLost) {
    this.clientsStore.getClient(clientId).on('close', onConnectionLost);
  }
  setOnPacketSend(clientId, onPacketSend) {
    this.clientsStore.getClient(clientId).on('packetSend', onPacketSend);
  }
  setOnMessage(clientId, onMessage) {
    this.clientsStore.getClient(clientId).on('message', onMessage);
  }
  publish(topic, payload, qos, retain, clientId) {
    return new Promise((resolve, reject) => {
      this.clientsStore.getClient(clientId).publish(topic, payload, { qos, retain }, error => {
        if(error) {
          return reject({ message: 'Error publishing.', error });
        }
        return resolve({ message: 'Succesfully published.' });
      });
    });
  }
  subscribe(topics, clientId) {
    return new Promise((resolve, reject) => {
      this.clientsStore.getClient(clientId).subscribe(topics, { qos: 1 }, error => {
        if(error) {
          return reject({ message: 'Error subscribing', error });
        }
        return resolve({ message: 'Succesfully subscribed.' });
      });
    });
  }
  unsubscribe(topics, clientId) {
    return new Promise((resolve, reject) => {
      this.clientsStore.getClient(clientId).unsubscribe(topics, error => {
        if(error) {
          return reject({ message: 'Error unsubscribing', error });
        }
        return resolve({ message: 'Succesfully unsubscribed.' });
      });
    });
  }
}
module.exports = Clients;