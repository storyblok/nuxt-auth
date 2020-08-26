const { Router } = require('express')
const getTokenFromCode = require('./utils/get-token-from-code')
const getStoryblokClient = require('./utils/get-storyblok-client')
const getExploreUrl = require('./utils/get-explore-url')

const getRouter = (options) => {
  const router = Router()

  router.get('/test', async function (req, res, next) {
    req.session.max = (req.session.max || 0) + 1
    req.session.save()
    res.json({sess: req.session.max})
  })

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

      if (!req.session.spaces) {
        req.session.spaces = {}
      }

      if (!req.session.spaces[space_id]) {
        req.session.spaces[space_id] = {}
      }

      req.session.spaces[space_id].application_code = code
      req.session.spaces[space_id].access_token = access_token
      req.session.spaces[space_id].refresh_token = refresh_token

      const returnUrl = options.return_url || '/'
      res.redirect(`${returnUrl}?space_id=${space_id}`)
    } catch (e) {
      console.log(e)
      res.status(500).json({error: e.message})
    }
  })

  router.get('/spaces/:space_id/*', async function (req, res, next) {
    const client = getStoryblokClient(req.session, req.params.space_id, options)
    const url = getExploreUrl(req.url)

    try {
      const { data, perPage, total } = await client.get(url)

      res.json({ perPage, total, ...data })
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

  router.post('/spaces/:space_id/*', async function (req, res, next) {
    const client = getStoryblokClient(req.session, req.params.space_id, options)
    const body = req.body
    const url = getExploreUrl(req.url)

    try {
      const response = await client.post(url, body)

      res.json(response.data)
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

  router.put('/spaces/:space_id/*', async function (req, res, next) {
    const client = getStoryblokClient(req.session, req.params.space_id, options)
    const body = req.body
    const url = getExploreUrl(req.url)

    try {
      const response = await client.put(url, body)

      res.json(response.data)
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

  router.delete('/spaces/:space_id/*', async function (req, res, next) {
    const client = getStoryblokClient(req.session, req.params.space_id, options)
    const url = getExploreUrl(req.url)

    try {
      const response = await client.delete(url)

      res.json(response.data)
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
    const client = getStoryblokClient(req.session, req.query.space_id, options)

    try {
      const response = await client.get('oauth/user_info')

      res.json(response.data)
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
