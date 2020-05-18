const { Router } = require('express')
const getTokenFromCode = require('./utils/get-token-from-code')
const getStoryblokClient = require('./utils/get-storyblok-client')
const getExploreUrl = require('./utils/get-explore-url')

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
      res.status(500).json({error: e.message})
    }
  })

  router.get('/explore/*', async function (req, res, next) {
    const client = getStoryblokClient(req.session, options)
    const url = getExploreUrl(req.url || '')

    try {
      const response = await client.get(url)

      res.json(response)
    } catch (e) {
      console.log(e)
      const errorData = { error: e.message }

      if (e.response) {
        res.status(e.response.status).json(errorData)
        return
      }

      res.status(500).json(errorData)
    }
  })

  router.post('/explore/*', async function (req, res, next) {
    const client = getStoryblokClient(req.session, options)
    const body = req.body
    const url = getExploreUrl(req.url || '')

    try {
      const { header, data } = await client.post(url, body)

      res.json({ header, data })
    } catch (e) {
      console.log(e)
      const errorData = { error: e.message }

      if (e.response) {
        res.status(e.response.status).json(errorData)
        return
      }

      res.status(500).json(errorData)
    }
  })

  router.put('/explore/*', async function (req, res, next) {
    const client = getStoryblokClient(req.session, options)
    const body = req.body
    const url = getExploreUrl(req.url || '')

    try {
      const { header, data } = await client.put(url, body)

      res.json({ header, data })
    } catch (e) {
      console.log(e)
      const errorData = { error: e.message }

      if (e.response) {
        res.status(e.response.status).json(errorData)
        return
      }

      res.status(500).json(errorData)
    }
  })

  router.delete('/explore/*', async function (req, res, next) {
    const client = getStoryblokClient(req.session, options)
    const url = getExploreUrl(req.url || '')

    try {
      const { header, data } = await client.delete(url)

      res.json({ header, data })
    } catch (e) {
      console.log(e)
      const errorData = { error: e.message }

      if (e.response) {
        res.status(e.response.status).json(errorData)
        return
      }

      res.status(500).json(errorData)
    }
  })

  router.get('/user', async function (req, res) {
    const client = getStoryblokClient(req.session, options)

    try {
      const response = await client.get('oauth/user_info')

      res.json(response)
    } catch (e) {
      console.log(e)
      const errorData = { error: e.message }

      if (e.response) {
        res.status(e.response.status).json(errorData)
        return
      }

      res.status(500).json(errorData)
    }
  })

  return router
}

module.exports = getRouter
