module.exports = (req, res) =>
  res.status(200).json({
    success: true,
    data: {
      name: 'api',
      routes: [{
          URL: '/mqtt',
          method: 'GET',
          description: 'MQTT client API root path.',
          response: '{succes: boolean, data: Object}'
        },
        {
          URL: '/slack',
          method: 'GET',
          description: 'MQTT client API root path.',
          response: '{succes: boolean, data: Object}'
        }
      ]
    }
  });