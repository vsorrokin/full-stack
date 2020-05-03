import axios from 'axios';
import API from '@/lib/api/lib';

export default {

  posts(context) {
    return axios.get(API.getURL('post'))
      .then((res) => {
        context.commit('posts', res.data.data.posts);
        return res.data.data.posts;
      }).catch(e => {
        console.error('Can\'t load posts');
      });
  },

};
