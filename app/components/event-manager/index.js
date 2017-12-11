const events = require('events'),
  path = require('path'),
  rootPath = require('app-root-path').toString(),
  { error: errorlog, log } = require(path.join(rootPath, 'app', 'components', 'logging'))
  ('nodeappi_components_eventmanager'),
  acl = require(path.join(rootPath, 'app', 'components', 'acl'));

class EventManager extends events.EventEmitter {
  constructor() {
    super();
  }
}
const instance = new EventManager();

instance.on('userupdate', (doc, upd) => {
  if(doc === null) {
    log('User creation event detected!');
    acl.userCreated(upd)
      .then(result => {
        log('' + result);
      })
      .catch(error => {
        errorlog('' + error);
      });
  }
});

module.exports = instance;