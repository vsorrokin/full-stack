module.exports = ({GCONFIG, shell, areYouSure}) => {
  return {

    // Run development server
    dev_server() {
      shell("LD_PRELOAD='/usr/src/app/node_modules/sharp/vendor/lib/libz.so' npx nodemon server.js")
    },

    // Run development environment
    dev() {
      shell('mut dev');
    },

    migrate_raw() {
      shell('npx sequelize db:migrate');
    },

    migrate() {
      shell('cmd npx sequelize db:migrate');

      // shell(`sequelize db:seed:all`)
      // shell(`sequelize db:seed:undo:all`)
      // shell(`sequelize seed:create --name ${options.name}`)
      // shell(`sequelize db:migrate:undo`)
      // shell(`sequelize migration:create --name ${options.name}`)
    },

    clear() {
      shell('cmd node development/tasks/clear_data.js');
    }

  }
}
