module.exports = (req, res) =>
  res.status(200).json({
    success: true,
    data: {
      name: 'nodeappi',
      version: '1.0.0',
      description: 'Node.js + express simple API.',
      author: 'Murillhou',
      routes: [{
          URL: '/mqtt',
          method: 'GET',
          description: 'MQTT client API root path.',
          response: '{succes: boolean, token: JSONWebToken}'
        },
        {
          URL: '/slack',
          method: 'GET',
          description: 'MQTT client API root path.',
          response: '{succes: boolean, token: JSONWebToken}'
        }
      ]
    }
  });