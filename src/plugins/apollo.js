import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { buildAxiosFetch } from 'axios-fetch';
import axios from 'axios';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';

// Install the vue plugin
Vue.use(VueApollo);

// Create the apollo client
export default function createApolloProvider() {
  const ssr = typeof window === 'undefined';

  const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: 'http://localhost:3333/graphql',
    fetch: buildAxiosFetch(axios)
  });

  const cache = new InMemoryCache();

  // If on the client, recover the injected state
  if (!ssr) {
    const state = window.__APOLLO_STATE__;
    if (state) {
      // If you have multiple clients, use `state.<client_id>`
      cache.restore(state.defaultClient);
    }
  }

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
    ...(ssr ? {
      // Set this on the server to optimize queries when SSR
      ssrMode: true,
    } : {
      // This will temporary disable query force-fetching
      ssrForceFetchDelay: 100,
    }),
  });

  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
  });

  return apolloProvider;
}
