module.exports = (req, res) =>
  res.status(200).json({
    success: true,
    data: {
      router: [{
        URL: '/publish',
        method: 'POST',
        Authentication: 'JWT',
        description: 'Allows an authenticated user to publish a MQTT message on the configured broker.',
        request: '{topic: String, message: String}',
        response: '{succes: boolean, msg: String}'
      }]
    }
  });