// Required files, libraries and modules
const mongoose = require('mongoose'),
  NodeACL = require('acl'),
  path = require('path'),
  rootPath = require('app-root-path').toString(),
  log = require(path.join(rootPath, 'app', 'components', 'logging'))('nodeappi_components_acl').log;
// Generic debug logger for NodeACL
const logger = () => ({ debug: function(msg) { log(msg); } });

// Create a new access control list by providing the mongo backend
const mongoBackend = new NodeACL.mongodbBackend(mongoose.connection.db, '_acl');
const acl = new NodeACL(mongoBackend, logger());

/**
 * Set newly created user´s permisions by matching the user type(s) 
 * with the implicitly defined user roles.
 * @param {mongoose.Model} u User mongoose document, or any object containing a "userType" String property.
 */
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
              { resources: '/api/slack', permissions: ['get'] }
            ]
          }]);
          break;
        case 'slackuser':
          acl.allow([{
            roles: [u.username + '_role'],
            allows: [
              { resources: '/api/mqtt', permissions: ['get'] },
              { resources: '/api/slack', permissions: ['get', 'post'] }
            ]
          }]);
          break;
      }
      // ADD ROLE TO USER
      acl.addUserRoles(u.username, u.username + '_role', error => {
        if(error) {
          return reject(error);
        }
      });
    });
    return resolve(u.usertype.toString() + ' user-type roles added to the user ' + u.username + '.');
  });

module.exports = {
  acl,
  userCreated
};