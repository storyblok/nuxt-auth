# @storyblok/nuxt-auth
[![npm (scoped with tag)](https://img.shields.io/npm/v/@storyblok/nuxt-auth/latest.svg?style=flat-square)](https://npmjs.com/package/@storyblok/nuxt-auth)
[![npm](https://img.shields.io/npm/dt/@storyblok/nuxt-auth.svg?style=flat-square)](https://npmjs.com/package/@storyblok/nuxt-auth)
[![Dependencies](https://david-dm.org/storyblok/@storyblok/nuxt-auth/status.svg?style=flat-square)](https://david-dm.org/storyblok/@storyblok/nuxt-auth)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> Storyblok's authentification module for the Nuxt.js

## Features

The module features

## Setup
- Add `storyblok-nuxt` dependency using yarn or npm to your project
- Add `storyblok-nuxt` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    [
      '@storyblok/nuxt-auth',
      {
        id: 'CONFIDENTIAL_CLIENT_ID', // from your storyblok application
        secret: 'CONFIDENTIAL_CLIENT_SECRET', // from your storyblok application
        redirect_uri: 'CONFIDENTIAL_CLIENT_REDIRECT_URI' // from your storyblok application
      }
    ],
 ]
}
```

## Usage

Will be added soon

```js
WIP
```

## License

[MIT License](./LICENSE)

Copyright (c) Storyblok <it@storyblok.com>
