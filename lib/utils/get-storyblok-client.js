const StoryblokClient = require('storyblok-js-client')

/**
 * @method getStoryblokClient
 * @param  {String} token access_token
 * @return {StoryblokJSClient}
 */
const getStoryblokClient = token => {
  return new StoryblokClient({
    oauthToken: `Bearer ${token}`
  })
}

module.exports = getStoryblokClient
