const axios = require('axios')
const qs = require('qs')

/**
 * The getTokenFromCode function will be receive an acess_url
 * and a config object to make a request to the access_url
 * to get access and refresh tokens
 * 
 * An example of config to get access token:
 * {
 *   grant_type: 'authorization_code',
 *   code: 'XXXXXXX',
 *   client_id: 'YYYYYYY',
 *   client_secret: 'ZZZZZZZ',
 *   redirect_uri: 'WWWWWWW'
 * }
 * 
 * An another example of config to refresh the acess token:
 * {
 *   grant_type: 'refresh_token',
 *   refresh_token: 'XXXXXXX', // instead of using code
 *   client_id: 'YYYYYYY',
 *   client_secret: 'ZZZZZZZ',
 *   redirect_uri: 'WWWWWWW'
 * }
 * 
 * @method getTokenFromCode
 * @param  {String} access_url
 * @param  {Object} config
 * @return {Promise<Object>}
 */
const getTokenFromCode = (access_url, config) => {
  return new Promise((resolve, reject) => {
    const requestConfig = {
      url: access_url,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        ...config
      })
    }
  
    axios(requestConfig)
      .then(response => {
        const { access_token, refresh_token } = response.data
  
        resolve({
          access_token,
          refresh_token: refresh_token || config.refresh_token
        })
      })
      .catch(reject)
  })
}

module.exports = getTokenFromCode
