// setting the environment variables
const express = require('express')
const session = require('express-session')
const grant = require('grant-express')
const factoryGrantConfig = require('./utils/factory-grant-config')
const router = require('./router')

const getServerMiddleware = (options) => {
  const app = express()
  const grantConfig = factoryGrantConfig(options)

  app.use((req, res, next) => {
    var writeHead = res.writeHead;
    res.writeHead = function() {
      var cookies = res.get('Set-Cookie')
      var setSameSiteNone = function(str) {
        return str.replace(/;\s*SameSite\s*=\s*Lax\s*(?=;|$)/ig, '; SameSite=None; secure;');
      }
      if (cookies) {
        if (Array.isArray(cookies)) {
          cookies = cookies.map(setSameSiteNone)
        } else {
          cookies = setSameSiteNone(cookies)
        }
        res.set('Set-Cookie', cookies)
      }

      writeHead.apply(this, arguments)
    }
    next()
  })
  app.use(express.json())
  app.use(session({
    secret: 'grant',
    cookie: { sameSite: 'lax', secure: false },
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
