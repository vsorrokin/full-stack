const queryPost = require('./query/post');
const queryFile = require('./query/file');

const mutationPost = require('./mutation/post');
const mutationUpload = require('./mutation/upload');

const graphqlFields = require('graphql-fields');

const GraphQLJSON = require('graphql-type-json');

module.exports = {
  JSON: GraphQLJSON,

  Post: {
    cover(parent, args, context, info) {
      //const id = parent.dataValues.cover_id;
      const attributes = Object.keys(graphqlFields(info, {}, { excludedFields: ['__typename'] }));

      return context.db.File.findOne({
        where: {id : parent.get('cover_id')},
        attributes
      });
    },

    video(parent, args, context, info) {
      //const id = parent.dataValues.cover_id;
      const attributes = Object.keys(graphqlFields(info, {}, { excludedFields: ['__typename'] }));

      return context.db.File.findOne({
        where: {id : parent.get('video_id')},
        attributes
      });
    }
  },
  Query: {
    ...queryPost,
    ...queryFile
  },
  Mutation: {
    ...mutationPost,
    ...mutationUpload
  }
};
