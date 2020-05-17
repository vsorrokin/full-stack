import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, concat, split } from 'apollo-link';
import { buildAxiosFetch } from 'axios-fetch';
import axios from 'axios';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';

// Install the vue plugin
Vue.use(VueApollo);

// Create the apollo client
export default function createApolloProvider(store) {
  const ssr = typeof window === 'undefined';

  const host = ssr ? `http://${GCONFIG.docker.APIHost}` : GCONFIG.API.host;
  const uri = `${host}:${GCONFIG.API.port}/graphql`;

  const httpLink = new HttpLink({
    uri,
    fetch: buildAxiosFetch(axios)
  });

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${store.state.token}`,
      }
    });

    return forward(operation);
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
    link: concat(authMiddleware, httpLink),
    cache,
    ...(ssr ? {
      // Set this on the server to optimize queries when SSR
      ssrMode: true,
    } : {
      // This will temporary disable query force-fetching
      ssrForceFetchDelay: 100,
    })
  });

  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
  });

  return apolloProvider;
}
