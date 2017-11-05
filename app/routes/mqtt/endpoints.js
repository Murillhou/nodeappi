  const path = require('path'),
    rootPath = require('app-root-path'),
    authFunctions = require(
      path.join(rootPath.toString(), 'app', 'components', 'authentication', 'functions')
    );

  const getPublishEndpoint = mqttClients => (req, res) => {
    mqttClients.newClient('mqtt://test.mosquitto.org', 1883, authFunctions.getUserId(req, res))
      .then(result => {
        console.log(result.msg);
        return mqttClients.publish(
          req.body.topic, req.body.message, 1, false, authFunctions.getUserId(req, res)
        );
      })
      .then(result => {
        console.log(result.msg);
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