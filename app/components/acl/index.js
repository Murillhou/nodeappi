/**
 * http://usejsdoc.org/
 */

/* jshint loopfunc:true */

// Load required packages
const mongoose = require('mongoose'),
  NodeACL = require('acl'),
  path = require('path'),
  rootPath = require('app-root-path').toString(),
  logging = require(path.join(rootPath, 'app', 'components', 'logging'))('nodeappi_components_acl'),
  log = logging.log;

// Generic debug logger for NodeACL
const logger = () => ({ debug: function(msg) { log(msg); } });
// Create a new access control list by providing the mongo backend
const mongoBackend = new NodeACL.mongodbBackend(mongoose.connection.db, '_acl');
const acl = new NodeACL(mongoBackend, logger());


const userCreated = u =>
  new Promise((resolve, reject) => {
    // CREATE USER SPECIFIC ROLES
    u.usertype.forEach(type => {
      switch(type) {
        case 'admin':
          acl.allow([{
            roles: ['admin_role'],
            allows: [
              { resources: '/api/users', permissions: '*' },
              { resources: '/api/users', permissions: '*' },
              { resources: '/api/mqtt', permissions: '*' },
              { resources: '/api/slack', permissions: '*' }
            ]
          }]);
          break;
        case 'commonuser':
          acl.allow([{
            roles: [u.username + '_role'],
            allows: [
              { resources: '/api/mqtt', permissions: ['get'] },
              { resources: '/api/slack', permissions: ['get'] }
            ]
          }]);
          break;
        case 'mqttuser':
          acl.allow([{
            roles: [u.username + '_role'],
            allows: [
              { resources: '/api/mqtt', permissions: ['get', 'post'] },
              { resources: '/api/slack', permissions: ['get', 'post'] }
            ]
          }]);
          break;
        case 'slackuser':
          acl.allow([{
            roles: [u.username + '_role'],
            allows: [
              { resources: '/api/mqtt', permissions: ['get', 'post'] },
              { resources: '/api/slack', permissions: ['get', 'post'] }
            ]
          }]);
          break;
      }
      // ADD ROLE TO USER
      acl.addUserRoles(u.username, u.username + '_role', function(err) {
        if(err) {
          return reject(err);
        }
      });
    });
    return resolve(u.usertype.toString() + ' user-type roles added to the user ' + u.username + '.');
  });

module.exports = {
  acl,
  userCreated
};