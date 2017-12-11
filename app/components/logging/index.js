const conf = require(require('path').join(require('app-root-path').toString(), 'app', 'config')),
  bunyan = require('bunyan'),
  fs = require('fs'),
  PrettyStream = require('bunyan-prettystream');

if(!conf.loggers) {
  throw new Error('Missing environment variables: loggers');
}

module.exports = name => {
  const streams = [];
  for(let l of conf.loggers.split(', ')) {
    switch(l) {
      case('file'):
        streams.push({
          level: 'info',
          stream: fs.createWriteStream(`/var/log/${name}_log.json`)
        });
        break;
      case('prettyFile'):
        let prettyFile = new PrettyStream();
        prettyFile.pipe(fs.createWriteStream(`/var/log/pretty_${name}_log.json`));
        streams.push({
          level: 'info',
          stream: prettyFile,
        });
        break;
      case('stdout'):
        streams.push({
          level: 'info',
          stream: process.stdout
        });
        break;
      case('prettyStdout'):
        let prettyStdOut = new PrettyStream();
        prettyStdOut.pipe(process.stdout);
        streams.push({
          level: 'info',
          stream: prettyStdOut
        });
        break;
    }
  }
  const logger = bunyan.createLogger({
    name,
    type: 'raw',
    streams
  });
  return {
    error: (err, ...rest) => {
      logger.error(err, rest.length ? rest.join() : '');
      if(conf.node_env && conf.node_env.includes('debug')) {
        console.log(' ' + name + '-' + Date.now() + ': ', err, rest.length ? rest.join() : '');
      }
    },
    log: (msg, ...rest) => {
      logger.info(msg, rest.length ? rest.join() : '');
      if(conf.node_env && conf.node_env.includes('debug')) {
        console.log(' ' + name + '-' + Date.now() + ': ', msg, rest.length ? rest.join() : '');
      }
    }
  };
};