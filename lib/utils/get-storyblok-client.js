const StoryblokClient = require('storyblok-js-client')
const createAuthRefreshInterceptor = require('axios-auth-refresh')
const factoryGrantConfig = require('./factory-grant-config')
const getTokenFromCode = require('./get-token-from-code')

/**
 * @method getStoryblokClient
 * @param  {Object} session Express session
 * @return {StoryblokJSClient}
 */
const getStoryblokClient = (expressSession, spaceId, moduleOptions) => {
  const grantConfig = factoryGrantConfig(moduleOptions)
  const session = expressSession.spaces[spaceId]

  const storyblokInstance = new StoryblokClient({
    oauthToken: `Bearer ${session.access_token}`,
    region: spaceId > 1000000 ? 'us' : null
  })

  const refreshAuthLogic = failedRequest => getTokenFromCode(
    grantConfig.storyblok.access_url,
    {
      grant_type: 'refresh_token',
      refresh_token: session.refresh_token,
      client_id: grantConfig.storyblok.key,
      client_secret: grantConfig.storyblok.secret,
      redirect_uri: grantConfig.storyblok.redirect_uri
    }).then(tokenRefreshResponse => {
      session.access_token = tokenRefreshResponse.access_token
      session.refresh_token = tokenRefreshResponse.refresh_token
      failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.access_token
      return Promise.resolve()
    })

  createAuthRefreshInterceptor.default(
    storyblokInstance.client, refreshAuthLogic
  )

  return storyblokInstance
}

module.exports = getStoryblokClient
