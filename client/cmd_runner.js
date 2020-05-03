if (!global.GCONFIG) {
  global.GCONFIG = require('./config.json');
}

const execa = require('execa');

module.exports = async function run(cmd) {
  const cmdsString = cmd.trim().replace(/\s\s+/g, ' ')
  const cmdsList = cmdsString.split('&&');

  for (let i = 0; i < cmdsList.length; i++) {
    const cmdParts = cmdsList[i].trim().split(' ');

    try {
      await execa(cmdParts[0], cmdParts.slice(1), {preferLocal: true, stdio: 'inherit'});
    } catch (e) {
      console.log(e);
    }

  }
}
