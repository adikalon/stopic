export default {
  server: {
    host: '0.0.0.0'
  },
  loading: {
    color: '#349414',
    height: '5px'
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.APP_NAME || '',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: '/bootstrap.bundle.min.js', body: true }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/bootstrap.min.css',
    '@/assets/css/common.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/headers.js', mode: 'server' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  env: {
    appName: process.env.APP_NAME || '',
    apiUrl: (process.env.APP_URL || '').replace(/\/$/, ''),
    googleWebmasterId: process.env.YANDEX_WEBMASTER_ID || '',
    yandexMetrikaId: process.env.YANDEX_METRIKA_ID || '',
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || ''
  }
}
