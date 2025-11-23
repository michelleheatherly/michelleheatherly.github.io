export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    'unplugin-icons/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxtjs/i18n'
  ],
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark'
  },
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error'],
    },
    icons: ['heroicons']
  },
  icon: {
    serverBundle: {
      collections: ['heroicons']
    }
  },
  tailwindcss: {
    viewer: false
  },
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'de', iso: 'de-DE', name: 'Deutsch', file: 'de.json' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    lazy: true,
    langDir: 'locales',
    vueI18n: './i18n.config.ts'
  },
  app: {
    baseURL: import.meta.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Michelle Heatherly',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: 'apple-touch-icon.png' },
        { rel: 'manifest', href: 'site.webmanifest' },
      ],
    }
  },
  runtimeConfig: {
    public: {
      feedUrl: import.meta.env.NUXT_PUBLIC_FEED_URL || 'https://example.com/feed.xml',
      blogUrl: import.meta.env.NUXT_PUBLIC_BLOG_URL || 'https://example.com/blog',
      blogAltUrl: import.meta.env.NUXT_PUBLIC_BLOG_ALT_URL || 'https://example.github.io/blog',
      contactApiKey: import.meta.env.NUXT_PUBLIC_CONTACT_API_KEY || '',
      email: import.meta.env.NUXT_PUBLIC_EMAIL || ''
    },
  },
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/', '/api/feed'],
      crawlLinks: false,
      failOnError: false,
      ignore: ['/portfolio-website-2025/_nuxt/**', '/_nuxt/**'],
    },
    preset: 'github_pages'
  },
  routeRules: {
    '/': { prerender: true },
  },
  css: ['@/assets/css/main.css'],
  image: {}
})
