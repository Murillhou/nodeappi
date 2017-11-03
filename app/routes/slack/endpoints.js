const path = require('path'),
  rootPath = require('app-root-path'),
  auth = require(path.join(rootPath.toString(), 'app', 'components', 'authentication'));



const getPostMessageEndpoint = slackBot => (req, res) => {
  slackBot.postMessage('(Message received from nodeappengine service, user: ' +
      auth.getUserId(req, res) +
      ')\n  ' + req.body.message)
    .then(result => {
      console.log(result.msg);
      return res.status(result.ok ? 200 : 500).send({
        success: result.ok,
        msg: result.ok ?
          'Message was succesfully posted' : 'Error while trying to post the message.'
      });
    })
    .catch(error => {
      console.log(error.msg);
      return res.status(500).send({
        success: false,
        msg: 'Error while trying to post the message.',
        err: error
      });
    });
};
module.exports = {
  getPostMessageEndpoint
};