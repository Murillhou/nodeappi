  const path = require('path'),
    rootPath = require('app-root-path').toString(),
    { error: errorlog, log } =
    require(path.join(rootPath, 'app', 'components', 'logging'))('nodeappi_routes_mqtt'),
    getUserName = require(path.join(rootPath.toString(), 'app', 'components', 'authentication'))
    .functions.getUserName;

  /**
   * Returns an Express endpoint for publishing mqtt messages given a mqtt-clients Client instance
   * @param {app.services.mqtt-clients.mqtt-clients.Client} mqttClients 
   */
  const getPublishEndpoint = mqttClients => (req, res) => {
    mqttClients.newClient('mqtt://test.mosquitto.org', 1883, getUserName(req, res))
      .then(result => {
        log(result.message);
        return mqttClients.publish(
          req.body.topic, req.body.message, 1, false, getUserName(req, res)
        );
      })
      .then(result => {
        log(result.message);
        return res.status(200).send({
          success: true,
          message: 'Message was succesfully published'
        });
      })
      .catch(error => {
        errorlog(error.message);
        return res.status(500).send({
          success: false,
          message: 'Error while trying to publish the message.',
          error
        });
      });
  };

  module.exports = {
    getPublishEndpoint
  };