module.exports = {
  Query: {
    posts: (parent, args, { db }, info) => db.Post.findAll()
  }
};
