// setting the environment variables
const express = require('express')
const session = require('express-session')
const grant = require('grant-express')
const factoryGrantConfig = require('./utils/factory-grant-config')
const router = require('./router')

const getServerMiddleware = (options) => {
  const app = express()
  const grantConfig = factoryGrantConfig(options)
  let trustProxy = () => {
    return true
  }

  if (typeof options.trustProxy !== 'undefined') {
    trustProxy = options.trustProxy
  }

  app.use(express.json())
  app.set('trust proxy', trustProxy)
  app.use(session({
    secret: 'grant',
    cookie: { sameSite: 'none', secure: true },
    resave: false,
    saveUninitialized: true
  }))
  app.use(grant(grantConfig))
  app.use(router(options))

  return {
    path: '/auth',
    handler: app
  }
}

// Export the server middleware
module.exports = getServerMiddleware
