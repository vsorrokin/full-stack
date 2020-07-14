const availableCommands = {
  'dev': 'Start development server',
  'migrate': 'Run database migrations',
  'clear': 'Clear database data'
};

// Dependencies
const GCONFIG = require('../config.json');
const cliSelect = require('./vendor/cli-select');
const {spawn} = require ('child_process');
const fs = require('fs');
const Tasks = require('./tasks');

// Prepare tasks to run
const tasks = Tasks({
  GCONFIG,

  shell(cmd) {
    console.log('EXECUTING:', cmd);
    const spawned = spawn(cmd, [], {shell: true, stdio: 'inherit'});
  },

  async areYouSure(text) {
    console.log('Are you sure want to ' + text + '?');
    const val = await cliSelect({
      values: ['Yes', 'No'],
      defaultValue: 1
    });

    return val.value === 'Yes' ? true : false;
  }
});


(async function() {
  // Get task name to run
  let task = {};

  if (process.argv[2]) {
    task.id = process.argv[2];
  } else {
    try {
      task = await cliSelect({
        values: availableCommands
      });
    } catch (e) {}
  }

  if (!task.id) return;

  // Run the task
  tasks[task.id]();
})()
