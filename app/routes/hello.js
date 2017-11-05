module.exports = (req, res) =>
  res.status(200).json({
    success: true,
    data: {
      name: 'api',
      routes: [{
          URL: '/authenticate',
          method: 'POST',
          description: 'JWT authentication endpoint.',
          response: '{succes: boolean, token: JSONWebToken}'
        },
        {
          URL: '/mqtt',
          method: 'GET',
          description: 'MQTT clients API root path.',
          response: '{succes: boolean, data: Object}'
        },
        {
          URL: '/slack',
          method: 'GET',
          description: 'Slack-bot API root path.',
          response: '{succes: boolean, data: Object}'
        }
      ]
    }
  });