  const path = require('path'),
    rootPath = require('app-root-path').toString(),
    logging = require(path.join(rootPath, 'app', 'components', 'logging'))('nodeappi'),
    log = logging.log,
    errorlog = logging.errorlog,
    getUserName = require(
      path.join(rootPath.toString(), 'app', 'components', 'authentication'))
    .functions.getUserName;

  const getPublishEndpoint = mqttClients => (req, res) => {
    mqttClients.newClient('mqtt://test.mosquitto.org', 1883, getUserName(req, res))
      .then(result => {
        log('--MQTT-- ' + result.msg);
        return mqttClients.publish(
          req.body.topic, req.body.message, 1, false, getUserName(req, res)
        );
      })
      .then(result => {
        log('--MQTT-- ' + result.msg);
        return res.status(200).send({
          success: true,
          msg: 'Message was succesfully published'
        });
      })
      .catch(error => {
        return res.status(500).send({
          success: false,
          msg: 'Error while trying to publish the message.',
          err: error
        });
      });
  };

  module.exports = {
    getPublishEndpoint
  };