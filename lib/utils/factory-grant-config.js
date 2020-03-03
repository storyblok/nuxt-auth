const SHA256 = require('crypto-js/sha256')
const uuid = require('uuid/v4')

const getConfig = (options) => {
  const codeIdentifier = uuid()

  return {
    defaults: {
      protocol: 'http',
      host: 'http://localhost:3000'
    },
    storyblok: {
      key: options.id,
      secret: options.secret,
      redirect_uri: options.redirect_uri,
      callback: '/callback',
      authorize_url: 'https://app.storyblok.com/oauth/authorize',
      access_url: 'https://app.storyblok.com/oauth/token',
      oauth: 2,
      scope: 'read_content write_content',
      custom_params: {
        code_chalenge: SHA256(codeIdentifier).toString(),
        code_chalenge_method: 'S256',
        state: codeIdentifier
      }
    }
  }
}

module.exports = getConfig
