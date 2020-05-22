import axios from 'axios';
import APIRequest from '@/lib/api_request/lib';

export default {

  posts(context) {
    return axios.get(APIRequest.getURL('post'))
      .then((res) => {
        context.commit('posts', res.data.data.posts);
        return res.data.data.posts;
      }).catch(e => {
        console.error('Can\'t load posts');
      });
  },

};
