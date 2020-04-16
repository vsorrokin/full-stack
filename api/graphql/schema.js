module.exports = `
  type Post {
    id: ID!
    video_id: Int!
    cover_id: Int!
    song_link: String
    description: String
  }

  type Query {
    posts: [Post!]!
  }
`;
