const queryPost = require('./query/post');

const mutationPost = require('./mutation/post');
const mutationUpload = require('./mutation/upload');

module.exports = {
  Query: {
    ...queryPost
  },
  Mutation: {
    ...mutationPost,
    ...mutationUpload
  }
};
