module.exports = (req, res) =>
  res.status(200).json({
    success: true,
    API: {
      name: 'nodeappengine',
      author: 'Murillhou',
      router: [{
          URL: '/authenticate',
          method: 'POST',
          description: 'Allows a registered user to login and to obtain a token ',
          request: '{user: String, password: String}',
          response: '{succes: boolean, token: JSONWebToken}'
        },
        {
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