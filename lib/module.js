const serverMiddleware = require('./server')

export default function NuxtAuth(moduleOptions) {
  const options = {
    ...moduleOptions,
    ...this.options["@storyblok/nuxt-auth"]
  }

  if (!options.access_url) options.access_url = 'https://app.storyblok.com/oauth/token'

  // this.addServerMiddleware(path.resolve(__dirname, 'server.js'))
  this.addServerMiddleware(serverMiddleware(options))

  console.log('✅ Loaded storyblok-nuxt-auth module ')
}

// REQUIRED if publishing the module as npm package
module.exports.meta = require('../package.json')

