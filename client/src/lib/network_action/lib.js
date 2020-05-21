import gql from 'graphql-tag';

class NetworkAction {
  constructor(settings) {
    this.vue = settings.vue;
  }

  /*
  this.$apollo.mutate({
    mutation: gql`mutation ($video_id: Int!, $cover_id: Int!, $song_link: String, $description: String) {
      createPost(video_id: $video_id, cover_id: $cover_id, song_link: $song_link, description: $description) {
        id
      }
    }`,

    variables: {
      video_id: this.formData.video.id,
      cover_id: this.formData.cover.id,
      song_link: this.formData.songLink,
      description: this.formData.description
    }
  })
  */
  _getGqlData(data, returnProps, mutation) {
    const result = {
      variables: {},
      mutationArgs: [],
      mutationMethodArgs: []
    };

    for (let key in data) {
      result.variables[key] = data[key][1];

      result.mutationArgs.push(`$${key}: ${data[key][0]}`);

      result.mutationMethodArgs.push(`${key}: $${key}`);
    }

    result.mutationArgs.join(', ');
    result.mutationMethodArgs.join(', ');

    const mutationString = `mutation (${result.mutationArgs}) {
      ${mutation}(${result.mutationMethodArgs}) {
        ${returnProps}
      }
    }`;

    return {
      mutation: gql`${mutationString}`,
      variables: result.variables
    };
  }

  upload({type, file, onUploadProgress, scope}) {
    const cancelTokenSource = this.vue.$http.CancelToken.source();

    const promise = this.mutate({
      data: {
        file: ['Upload!', file],
        type: ['String!', type]
      },
      returnProps: 'id',
      mutation: 'upload',
      scope,
      context: {
        fetchOptions: {
          onUploadProgress,
          cancelToken: cancelTokenSource.token
        }
      }
    });

    return {
      promise,
      cancel: cancelTokenSource.cancel
    };
  }

  mutate({data, returnProps, mutation, context = {}, scope}) {
    return scope.$apollo.mutate(
      {
        ...this._getGqlData(data, returnProps, mutation),
        context
      }
    );
  }

  async run({scope, mutation, data, returnProps, msg}) {

    // Set loading status
    if (scope.isLoading) return;
    scope.isLoading = true;

    // Show start notification
    this.vue.$helpers.notify({texts: msg, step: 'start', self: scope});

    // Run network request
    let result;
    try {

      result = await this.mutate({data, returnProps, mutation, scope});
    } catch (err) {
      this.vue.$helpers._notifyError({err, msg, scope});
      return;
    }

    // On success
    this.vue.$helpers.notify({texts: msg, step: 'success', self: scope});
    scope.isLoading = false;
    scope.notification = null;

    return result.data[mutation];
  }
}

export default NetworkAction;
