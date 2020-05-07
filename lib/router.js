const { Router } = require('express')
const getTokenFromCode = require('./utils/get-token-from-code')
const getStoryblokClient = require('./utils/get-storyblok-client')

const getRouter = (options) => {
  const router = Router()

  router.get('/callback', async function (req, res, next) {
    const { space_id, code } = req.query

    try {
      const config = {
        grant_type: 'authorization_code',
        code,
        client_id: options.id,
        client_secret: options.secret,
        redirect_uri: options.redirect_uri
      }
      const { access_token, refresh_token } = await getTokenFromCode(
        options.access_url,
        config
      )

      req.session.application_code = code
      req.session.access_token = access_token
      req.session.refresh_token = refresh_token

      res.redirect(`/?space_id=${space_id}`)
    } catch (e) {
      console.log(e)
      res.json({error: e.message})
    }
  })

  router.get('/explore/*', async function (req, res, next) {
    const client = getStoryblokClient(req.session.access_token)

    const regex = /\/explore\//g
    const url = req.url.replace(regex, "")

    try {
      const response = await client.get(url)

      res.json(response.data)
    } catch (e) {
      console.log(e)
      res.json({error: e.message})
    }
  })

  router.get('/user', async function (req, res) {
    const client = getStoryblokClient(req.session.access_token)

    try {
      const response = await client.get('oauth/user_info')

      res.json(response.data)
    } catch (e) {
      console.log(e)
      res.json({error: e.message})
    }
  })

  return router
}

module.exports = getRouter
