const conf = require(require('path').join(require('app-root-path').toString(), 'app', 'config'));

if(!conf.authenticationSecret) {
  throw new Error('Missing environment variables: authenticationSecret');
}
const configPassport = require('./config-passport'),
  functions = require('./functions');

module.exports = {
  functions,
  configPassport
};