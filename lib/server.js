// setting the environment variables
const express = require('express')
const session = require('express-session')
const grant = require('grant-express')
const factoryGrantConfig = require('./utils/factory-grant-config')
const router = require('./router')

const getServerMiddleware = (options) => {  
  const app = express()
  const grantConfig = factoryGrantConfig(options)
  
  app.use(session({secret: 'grant'}))
  app.use(grant(grantConfig))
  app.use(router(options))

  return {
    path: '/auth',
    handler: app
  }
}

// Export the server middleware
module.exports = getServerMiddleware
