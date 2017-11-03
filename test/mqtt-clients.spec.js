const chai = require('chai'),
  chaiAsPromised = require("chai-as-promised"),
  should = chai.should(),
  expect = chai.expect;

const Clients = require('../mqtt-clients');

describe('MqttClients', () => {
  it('should return a proper object', done => {
    const mqttClients = new Clients(2);
    mqttClients.should.haveOwnProperty(['newClient']);
    mqttClients.should.haveOwnProperty(['setOnConnected']);
    mqttClients.should.haveOwnProperty(['setOnConnectionLost']);
    mqttClients.should.haveOwnProperty(['setOnPacketSend']);
    mqttClients.should.haveOwnProperty(['setOnMessage']);
    mqttClients.should.haveOwnProperty(['connect']);
    done();
  });
  it('should be able to intialize with some given clients', done => {
    done('TODO');
  });
  it('should be able to create and store a new client', done => {
    const mqttClients = new Clients(2);
    mqttClients.newClient('test.mosquitto.org', 1883, 'nodeappi_test');
    done();
  });
});