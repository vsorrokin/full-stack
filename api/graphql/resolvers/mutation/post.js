module.exports = {
  createPost(parent, { video_id, cover_id, song_link, description }, context, info) {
    return context.db.Post.create({
      video_id,
      cover_id,
      song_link,
      description
    });
  }
};
