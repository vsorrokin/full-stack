'use strict';
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    size: DataTypes.STRING,
    local_name: DataTypes.STRING,
    options: DataTypes.JSONB
  }, {});
  File.associate = function(models) {
    // associations can be defined here
  };
  return File;
};
