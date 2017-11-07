const fs = require('fs'),
  bunyan = require('bunyan'),
  PrettyStream = require('bunyan-prettystream');

module.exports = name => {
  const prettyFile = new PrettyStream();
  prettyFile.pipe(fs.createWriteStream(`/var/log/pretty_${name}_log.json`));
  const prettyStdOut = new PrettyStream();
  prettyStdOut.pipe(process.stdout);
  const logger = bunyan.createLogger({
    name,
    type: 'raw',
    streams: [{
        level: 'info',
        stream: prettyFile,
      },
      {
        level: 'info',
        stream: fs.createWriteStream(`/var/log/${name}_log.json`)
      },
      {
        level: 'info',
        stream: prettyStdOut
      }
    ]
  });
  return {
    error: (err, ...rest) => {
      logger.error(err, rest.length ? rest.join() : '');
      console.log(' ' + name + '-' + Date.now() + ': ', err, rest.length ? rest.join() : '');
    },
    log: (msg, ...rest) => {
      logger.info(msg, rest.length ? rest.join() : '');
      console.log(' ' + name + '-' + Date.now() + ': ', msg, rest.length ? rest.join() : '');
    }
  };
};