module.exports = {
  file(parent, args, context, info) {
    console.log(parent, args);
    //return context.db.Post.findAll();
  }
};
