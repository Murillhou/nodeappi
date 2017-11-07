const events = require('events'),
  path = require('path'),
  rootPath = require('app-root-path').toString(),
  logging = require(path.join(rootPath, 'app', 'components', 'logging'))('nodeappi'),
  log = logging.log,
  errorlog = logging.errorlog,
  acl = require(path.join(rootPath, 'app', 'components', 'acl'));

class EventManager extends events.EventEmitter {
  constructor() {
    super();
  }
}
const instance = new EventManager();

instance.on('userupdate', (doc, upd, ...rest) => {
  if(doc === null) {
    log('--EVENTS-- User creation event detected!');
    acl.userCreated(upd)
      .then(result => {
        log('--EVENTS-- ' + result);
      })
      .catch(error => {
        errorlog('--EVENTS-- ' + error);
      });
  }
});

module.exports = instance;