const Clients = require('./mqtt-clients'),
  chai = require('chai'),
  chaiAsPromised = require("chai-as-promised"),
  should = chai.should(),
  expect = chai.expect,
  util = require('util');

describe('MqttClients', () => {
  it('should return a proper object', done => {
    const mqttClients = new Clients(2);
    expect(mqttClients).to.have.property('newClient');
    expect(mqttClients).to.have.property('setOnConnected');
    expect(mqttClients).to.have.property('setOnConnectionLost');
    expect(mqttClients).to.have.property('setOnPacketSend');
    expect(mqttClients).to.have.property('setOnMessage');
    expect(mqttClients).to.have.property('subscribe');
    expect(mqttClients).to.have.property('unsubscribe');
    expect(mqttClients).to.have.property('publish');
    done();
  });
  it('should be able to intialize with some given clients', done => {
    const mqtt = require('mqtt');
    const client =
      mqtt.connect('mqtt://test.mosquitto.org:1883', require('./mqtt-connect-options'));
    const mqttClients = new Clients(3, client);
    mqttClients.clientsStore.clients.length.should.be.eql(1);
    const client2 =
      mqtt.connect('mqtt://test.mosquitto.org:1883', require('./mqtt-connect-options'));
    const mqttClients2 = new Clients(3, client, client2);
    mqttClients2.clientsStore.clients.length.should.be.eql(2);
    done();

  });
  it('should be able to create and store a new client given the connection URL, port and client ID', done => {
    const mqttClients = new Clients(2);
    mqttClients.newClient('mqtt://test.mosquitto.org', 1883, 'nodeappi_test')
      .should.be.fulfilled.notify(done);
  });
});