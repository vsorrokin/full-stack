'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    video_id: {
      type: DataTypes.INTEGER,
      references: {
        model: sequelize.models.File,
        key: 'id'
      }
    },
    cover_id: {
      type: DataTypes.INTEGER,
      references: {
        model: sequelize.models.File,
        key: 'id'
      }
    },
    song_link: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});

  Post.associate = function(models) {
    // associations can be defined here
  };

  return Post;
};
