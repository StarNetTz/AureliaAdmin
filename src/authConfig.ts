let AuthConfig = {
  endpoint: 'auth',             // use 'auth' endpoint for the auth server
  configureEndpoints: ['auth','api'],  // add Authorization header to 'auth' endpoint
  accessTokenProp : 'BearerToken'
}

export {AuthConfig};
