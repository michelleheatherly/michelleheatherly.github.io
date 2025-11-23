<template>
  <section id="blog" class="relative overflow-hidden transition-colors duration-300">
    <UContainer class="relative py-24">
      <div class="grid items-start gap-14 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)]">
        <div
          :key="motionKey"
          class="space-y-6"
          ref="leftColRef"
          v-motion
          :initial="isClient ? motionInitialLeft : motionStaticLeft"
          :visibleOnce="isClient ? motionVisibleLeft(blogDelays.container) : false"
        >
          <span
            class="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs uppercase tracking-[0.28em] shadow-sm transition-colors duration-300"
          >
            <UIcon name="i-heroicons-newspaper-20-solid" class="h-4 w-4" />
            {{ t('blog.badge') }}
          </span>

          <div class="space-y-4">
            <h2
              class="text-3xl font-semibold leading-tight text-zinc-900 transition-colors duration-300 md:text-4xl dark:text-white"
            >
              {{ t('blog.title') }}
            </h2>

            <p
              class="text-lg text-zinc-600 transition-colors duration-300 dark:text-white/70"
            >
              {{ t('blog.description') }}
            </p>
          </div>

          <div
            ref="noteRef"
            class="flex items-start gap-3 rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-zinc-600 shadow-sm backdrop-blur transition-colors duration-300 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
          >
            <UIcon name="i-heroicons-language-20-solid" class="mt-1 h-5 w-5 shrink-0 text-cyber-purple" />
            <p>{{ t('blog.note') }}</p>
          </div>

          <div
            v-if="showFeedLink || showBlogLink"
            :key="motionKey + '-btns'"
            class="flex flex-wrap gap-3 pt-2"
          >
            <UButton
              v-if="showBlogLink"
              :href="blogUrl"
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              class="group border transition-colors duration-300 bg-transparent"
              variant="soft"
              color="neutral"
            >
              <UIcon
                name="i-heroicons-arrow-top-right-on-square-20-solid"
                class="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-12"
              />
              <span>{{ t('blog.actions.visit') }}</span>
            </UButton>

            <UButton
              v-if="showFeedLink"
              :href="feedUrl"
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              class="group border transition-colors duration-300 bg-transparent"
              variant="soft"
              color="neutral"
            >
              <UIcon
                name="i-heroicons-rss-20-solid"
                class="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-12"
              />
              <span>{{ t('blog.actions.open') }}</span>
            </UButton>
          </div>
        </div>

        <div
          :key="motionKey + '-right'"
          class="relative min-h-0 overflow-hidden pt-2"
          :style="feedHeight ? { height: feedHeight + 'px' } : undefined"
          v-motion
          :initial="isClient ? motionInitialRight : motionStaticRight"
          :visibleOnce="isClient ? motionVisibleRight(blogDelays.feed) : false"
        >
          <BlogFeedCards :max-height="feedHeight" />
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'global' })
const config = useRuntimeConfig()

const isClient = ref(false)
const motionKey = computed(() => (isClient.value ? 'client' : 'server'))

onMounted(() => {
  isClient.value = true
})

const leftColRef = ref<HTMLElement | null>(null)
const noteRef = ref<HTMLElement | null>(null)
const feedHeight = ref<number | null>(null)

function calcHeights() {
  if (typeof window === 'undefined' || window.innerWidth < 1024) {
    // Still add headroom in the child, but don't fix height on mobile
    feedHeight.value = null
    return
  }
  const left = leftColRef.value
  const note = noteRef.value
  if (!left || !note) {
    feedHeight.value = null
    return
  }
  const leftTop = left.getBoundingClientRect().top + window.scrollY
  const noteBottom = note.getBoundingClientRect().bottom + window.scrollY
  feedHeight.value = Math.max(0, Math.round(noteBottom - leftTop))
}

onMounted(() => {
  calcHeights()
  window.addEventListener('resize', calcHeights, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', calcHeights)
})

const feedUrlState = useState('feedUrl', () => (config.public.feedUrl ?? '').trim())
const blogBaseState = useState('blogUrl', () => (config.public.blogUrl ?? '').trim())

const blogUrl = computed(() => {
  const base = blogBaseState.value.replace(/\/+$/, '')
  if (!base) return ''
  return locale.value?.startsWith('de') ? `${base}/de` : base
})

const feedUrl = computed(() => feedUrlState.value)
const showFeedLink = computed(() => !!feedUrl.value)
const showBlogLink = computed(() => !!blogUrl.value)

const spring = {
  type: 'spring',
  stiffness: 110,
  damping: 24
} as const

const motionInitialLeft = {
  opacity: 0,
  y: 32
} as const

const motionStaticLeft = {
  opacity: 1,
  y: 0
} as const

const motionVisibleLeft = (delay: number) => ({
  opacity: 1,
  y: 0,
  transition: {
    ...spring,
    delay
  }
})

const motionInitialRight = {
  opacity: 0,
  x: 32,
  scale: 0.95
} as const

const motionStaticRight = {
  opacity: 1,
  x: 0,
  scale: 1
} as const

const motionVisibleRight = (delay: number) => ({
  opacity: 1,
  x: 0,
  scale: 1,
  transition: {
    ...spring,
    delay
  }
})

const blogDelays = {
  container: 0.08,
  feed: 0.28
}
</script>