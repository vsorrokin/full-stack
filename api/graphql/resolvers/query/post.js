module.exports = {
  posts(parent, args, context, info) {
    return context.db.Post.findAll();
  }
};
