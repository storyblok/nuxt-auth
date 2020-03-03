# @storyblok/nuxt-auth
[![npm (scoped with tag)](https://img.shields.io/npm/v/@storyblok/nuxt-auth/latest.svg?style=flat-square)](https://npmjs.com/package/@storyblok/nuxt-auth)
[![npm](https://img.shields.io/npm/dt/@storyblok/nuxt-auth.svg?style=flat-square)](https://npmjs.com/package/@storyblok/nuxt-auth)
[![Dependencies](https://david-dm.org/storyblok/@storyblok/nuxt-auth/status.svg?style=flat-square)](https://david-dm.org/storyblok/@storyblok/nuxt-auth)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> Storyblok's authentification module for the Nuxt.js

## Requirements

You can create a custom Storyblok app only if you are part of the [partner program](https://www.storyblok.com/partners).

## Setup
- Add `@storyblok/nuxt-auth` dependency using yarn or npm to your project
- Add `@storyblok/nuxt-auth` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    [
      '@storyblok/nuxt-auth',
      {
        id: 'Client ID from Storyblok App',
        secret: 'Secret from Storyblok App',
        redirect_uri: 'REDIRECT_URI' // Equal to callbakc URL of Oauth2 from Storyblok App
      }
    ],
 ]
}
```

## Recommended Setup

- install `dotenv` module and create `.env` file in root of your project
- keep all the confidential informations in `.env` file
- load confidental information in `nuxt.config.js` using `dotenv` package 

```js
require('dotenv').config()

export default {
  // ...
  modules: [
    '@nuxtjs/dotenv',
    [
      '@storyblok/nuxt-auth',
      {
        id: process.env.CONFIDENTIAL_CLIENT_ID,
        secret: process.env.CONFIDENTIAL_CLIENT_SECRET,
        redirect_uri: process.env.CONFIDENTIAL_CLIENT_REDIRECT_URI
      }
    ]
  ]
  // ...
}
```

```js
// .env file
CONFIDENTIAL_CLIENT_ID="Id from Storyblok App"
CONFIDENTIAL_CLIENT_SECRET="Secret from Storyblok App"
CONFIDENTIAL_CLIENT_REDIRECT_URI="callback url of your app"
```

## Usage

The module registers auth middleware in your Nuxt.js project and router for the StoryblokClient. After that you can use axios in your vue files to get data from Storyblok using the [Management API](https://www.storyblok.com/docs/api/management). **Not all features of Management API supported. Only GET supported in this beta.**

Prefix all paths in axios with `/auth/explore/`. If you want to get all stories from space ide 606, you would call with management API `spaces/606/stories/` here you call `/auth/explore/spaces/606/stories/`. Check more samples down.

```js
import axios from 'axios'

export default {
  data() {
    return {
      stories: []
    }
  },
  mounted() {
    if (window.top == window.self) {
      window.location.assign('https://app.storyblok.com/oauth/app_redirect')
    } else {
      this.loadStories()
    }
  },
  methods: {
    loadStories() {
      axios.get(`/auth/explore/spaces/${this.$route.query.space_id}/stories`)
        .then((res) => {
          // do what you want to do ;) 
          // this is only basic sample
          this.stories = res.data.stories
        })
      }
  }
}
```

## Samples

Read this step by step sample guide from Storyblok. (TODO write sample) 

# NOTE

**This is still beta! Use this module for first experiments with custom storyblok apps. More complex functionality will be added with version 1 release. Current version supports only GET.**

Features need for v1 release:

- [ ] request body
- [ ] write cleaner docs
- [ ] add more complex samples
- [ ] write down sample article
- [ ] move auth check from mounted

## License

[MIT License](./LICENSE)

Copyright (c) Storyblok <it@storyblok.com>
