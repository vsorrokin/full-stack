module.exports = {
  Query: {
    posts: (parent, args, context, info) => {

      // let req = {authorization: {}};
      // let res = {authorization: {}};
      // let next = () => {};
      // t(req, res, next);
      return context.db.Post.findAll();
    }
  },
  Mutation: {
    createPost: (parent, { video_id, cover_id, song_link, description }, { db }, info) =>
      db.Post.create({
        video_id,
        cover_id,
        song_link,
        description
      })
  }
};
