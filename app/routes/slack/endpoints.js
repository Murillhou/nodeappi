const path = require('path'),
  rootPath = require('app-root-path').toString(),
  logging = require(path.join(rootPath, 'app', 'components', 'logging'))('nodeappi'),
  log = logging.log,
  errorlog = logging.errorlog,
  getUserName = require(path.join(rootPath.toString(), 'app', 'components', 'authentication'))
  .functions.getUserName;



const getPostMessageEndpoint = slackBot => (req, res) => {
  slackBot.postMessage('(Message received from nodeappi slackbot service, user: ' +
      getUserName(req, res) +
      ')\n  ' + req.body.message)
    .then(result => {
      log('--SLACKBOT-- ' + result.message.text);
      return res.status(result.ok ? 200 : 500).send({
        success: result.ok,
        msg: result.ok ?
          'Message was succesfully posted' : 'Error while trying to post the message.'
      });
    })
    .catch(error => {
      errorlog('--SLACKBOT-- ' + error.message);
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