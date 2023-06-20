# @storyblok/nuxt-auth [DEPRECATED]
[![npm (scoped with tag)](https://img.shields.io/npm/v/@storyblok/nuxt-auth/latest.svg?style=flat-square)](https://npmjs.com/package/@storyblok/nuxt-auth)
[![npm](https://img.shields.io/npm/dt/@storyblok/nuxt-auth.svg?style=flat-square)](https://npmjs.com/package/@storyblok/nuxt-auth)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> **⚠️ Disclaimer: No Longer Maintained:**
Please be aware that this library/package is no longer actively maintained or supported. However, it is important to note that this change will not break any existing functionality or cause disruptions. While bug fixes, updates, and new feature development will not be provided, the library/package will continue to work as it currently does. Compatibility with future systems, frameworks, or dependencies is not guaranteed, and caution should be exercised when using it with the latest technologies. The issue tracker is no longer monitored, and new issues will not be addressed. The decision to discontinue the maintenance and support of this library/package was driven by resource limitations and a shift in project focus. We recommend considering **[Storyblok App Extension Auth](https://github.com/storyblok/app-extension-auth)** as an alternative solution. No further contributions or pull requests will be accepted for this library/package.

 
Storyblok's authentification module for the Nuxt.js

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

## Module options

The module options can receive the following fields:

### id (required)

The client id from Storyblok App

### secret (required)

The secret id from Storyblok App

### redirect_uri (required)

Callback URL to your app

### return_url (optional)

* default: '/'

The entry point to your application. It is a page that will be receive the `space_id` information as router query parameters. See the "Defining a new entry point" section for more details

## Usage

The module registers auth middleware in your Nuxt.js project and router for the StoryblokClient. After that you can use axios in your vue files to get data from Storyblok using the [Management API](https://www.storyblok.com/docs/api/management). 

### Using Management API

To use Storyblok Management API, all paths in axios was prefixed with `/auth/`. If you want to get all stories from space ide 606, you would call with management API `spaces/606/stories/` here you call `/auth/spaces/606/stories/`.

For example, to get all stories from specific space:

```js
import axios from 'axios'

export default {
  data() {
    return {
      stories: [],
      perPage: null,
      total: null
    }
  },
  mounted() {
    if (window.top == window.self) {
      // when your app is authenticated,
      // this URL will be redirect to <YOUR_APP_URL>/space_id?<AUTHORIZED_SPACE>
      window.location.assign('https://app.storyblok.com/oauth/app_redirect')
    } else {
      // however, once authenticated and inside of Storyblok Space APP,
      // you're able to use axios to make the necessary requests
      // for example, get the stories from the authenticated space
      this.loadStories()
    }
  },
  methods: {
    loadStories() {
      // get the space id from URL and use it in requests
      axios.get(`/auth/spaces/${this.$route.query.space_id}/stories`)
        .then((res) => {
          // do what you want to do ;) 
          // this is only basic sample
          this.perPage = res.data.perPage
          this.total = res.data.total
          this.stories = res.data.stories
        })
      }
  }
}
```

Another example, to create a new story:

```js
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      story: {
        name: ''
      }
    }
  },
  methods: {
    createStory() {
      this.loading = true

      // The request body is the same from Management API
      // https://www.storyblok.com/docs/api/management#core-resources/stories/create-story
      const body = {
        story: { ...this.story }
      }

      // get the space id from URL and use it in requests
      return axios
        .post(`/auth/spaces/${this.$route.query.space_id}/stories`, body)
        .then((res) => {
          this.loading = false
        })
      }
  }
}
```

### Get the authenticated user information

To get information about the authenticated user, you should make a `GET` request to `/auth/user` path.

Example:

```js
import axios from 'axios'

export default {
  data() {
    return {
      user: {}
    }
  },
  mounted() {
    if (window.top == window.self) {
      window.location.assign('https://app.storyblok.com/oauth/app_redirect')
    } else {
      this.loadUserInformation()
    }
  },
  methods: {
    loadUserInformation() {
      axios.get(`/auth/user?space_id=${this.$route.query.space_id}`)
        .then((res) => {
          this.user = res.data || {}
        })
      }
  }
}
```

### Defining a new entry point

Change this setting if you want to have a different entry point than the default one `'/'`. Example:

```js
// ...
  '@storyblok/nuxt-auth',
  {
    id: process.env.CONFIDENTIAL_CLIENT_ID,
    secret: process.env.CONFIDENTIAL_CLIENT_SECRET,
    redirect_uri: process.env.CONFIDENTIAL_CLIENT_REDIRECT_URI,
    return_url: '/auth'
  }
// ...
```

With this configuration you can create a file for the `/auth` route and handle the logic there. You will find the query parameter `space_id` in  `$router.query` which needs to be used for the api calls:

```vue
<template>
  <div>
    <h1> The space id is {{ space_id }} </h1>
  </div>
</template>

<script>
export default {
  name: 'AuthExamplePage',
  data: () => ({
    space_id: null
  }),
  mounted () {
    // get the space_id from $router.query object
    this.space_id = this.$route.query.space_id
  }
}
</script>
```

## Example app

Check out the workflow manager app to see an example [github.com/storyblok/storyblok-workflow-app](https://github.com/storyblok/storyblok-workflow-app).

## License

[MIT License](./LICENSE)

Copyright (c) Storyblok <it@storyblok.com>
