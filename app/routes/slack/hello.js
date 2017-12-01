module.exports = (req, res) =>
  res.status(200).json({
    success: true,
    data: {
      name: 'slackbot',
      routes: [{
        URL: '/postmessage',
        method: 'POST',
        Authentication: 'JWT',
        description: 'Allows an authenticated user to post message on the configured Murillhou slack channel.',
        request: '{message: String}',
        response: '{succes: boolean, message: String}'
      }]
    }
  });