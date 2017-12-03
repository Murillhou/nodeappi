if(!process.env.authenticationSecret) {
  throw new Error('Missing environment variables: authenticationSecret');
}
const configPassport = require('./config-passport'),
  functions = require('./functions');

module.exports = {
  functions,
  configPassport
};