const serverMiddleware = require('./server')

export default function NuxtAuth(moduleOptions) {
  const options = {
    ...moduleOptions,
    ...this.options["@storyblok/nuxt-auth"]
  }

  if (!options.id) {
    console.error('@storyblok/nuxt-auth is missing id (CLIENT_ID)');
    return
  }
  if (!options.secret) {
    console.error('@storyblok/nuxt-auth is missing secret (CLIENT_SECRET)');
    return
  }
  if (!options.redirect_uri) {
    console.error('@storyblok/nuxt-auth is missing redirect_uri (CLIENT_REDIRECT_URI)');
    return
  }

  if (!options.access_url) options.access_url = 'https://app.storyblok.com/oauth/token'

  // this.addServerMiddleware(path.resolve(__dirname, 'server.js'))
  this.addServerMiddleware(serverMiddleware(options))

  console.log('ℹ @storyblok/nuxt-auth module was succesfully initialized.')
}

// REQUIRED if publishing the module as npm package
module.exports.meta = require('../package.json')

