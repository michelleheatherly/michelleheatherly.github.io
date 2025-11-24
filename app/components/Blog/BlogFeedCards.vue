<template>
  <div
    class="h-full space-y-6 pr-1"
    :style="maxHeight ? { maxHeight: maxHeight + 'px' } : undefined"
    :aria-busy="pending"
  >
    <div
      v-if="pending && !hasAnyItems"
      class="grid h-full gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2 -mt-2"
      aria-live="polite"
    >
      <span class="sr-only">{{ t('feed.loading') }}</span>
      <UCard
        v-for="(_, idx) in skeletonItems"
        :key="`feed-skeleton-${idx}`"
        class="relative overflow-hidden rounded-2xl border border-black/10 bg-white/60 p-5 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-white/10"
      >
        <div class="space-y-4">
          <USkeleton class="h-3 w-24 rounded-full bg-black/10 dark:bg-white/10" />
          <USkeleton class="h-5 w-3/4 rounded-full bg-black/10 dark:bg-white/10" />
          <USkeleton class="h-5 w-5/6 rounded-full bg-black/10 dark:bg-white/10" />
          <div class="space-y-2">
            <USkeleton class="h-3 w-full rounded-full bg-black/10 dark:bg-white/10" />
            <USkeleton class="h-3 w-2/3 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
          <USkeleton class="h-4 w-28 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </UCard>
    </div>

    <div
      v-else-if="error"
      class="flex h-full flex-col gap-3 overflow-y-auto rounded-2xl border border-rose-400/30 bg-rose-400/10 p-5 text-sm text-rose-600 shadow-sm transition-colors duration-300 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200"
    >
      <div class="flex items-start gap-3">
        <UIcon name="i-heroicons-exclamation-triangle-20-solid" class="mt-0.5 h-5 w-5 shrink-0" />
        <div class="space-y-1">
          <p class="font-medium">{{ t('feed.error.title') }}</p>
          <p class="text-xs text-rose-700/70 dark:text-rose-100/70">
            {{ t('feed.error.description') }}
          </p>
        </div>
      </div>
      <UButton size="xs" variant="soft" @click="refresh">
        <UIcon name="i-heroicons-arrow-path-20-solid" class="h-4 w-4" />
        <span>{{ t('feed.error.retry') }}</span>
      </UButton>
    </div>

    <div
      v-else-if="!localeItems.length"
      class="h-full overflow-y-auto rounded-2xl border border-black/10 bg-white/70 p-6 text-sm text-zinc-600 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
    >
      <p class="font-medium text-zinc-700 transition-colors duration-300 dark:text-white">
        {{ t('feed.empty.title') }}
      </p>
      <p class="mt-1 text-xs text-zinc-500 transition-colors duration-300 dark:text-white/60">
        {{ t('feed.empty.description') }}
      </p>
    </div>

    <div
      v-else
      class="grid h-full auto-rows-fr gap-5 overflow-y-auto pt-2 -mt-2 overscroll-contain"
      :class="{
        'sm:grid-cols-2': items.length >= 2,
        'lg:grid-cols-3': items.length >= 3
      }"
    >
      <UCard
        v-for="post in items"
        :key="post.link"
        class="group relative flex h-full transform-gpu flex-col justify-between overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-6 lg:p-7 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/[0.06]"
        :class="cardHoverClasses"
      >
        <span
          class="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyber-purple/0 via-cyber-purple/10 to-cyber-green/0 opacity-0 transition-opacity duration-500"
          :class="overlayHoverClasses"
        />
        <div class="relative flex h-full flex-col gap-4">
          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.22em]">
              {{ formatDate(post.date) }}
            </p>
            <h3 class="text-lg font-semibold leading-tight text-zinc-900 transition-colors duration-300 dark:text-white">
              <a
                :href="post.link"
                target="_blank"
                rel="noopener noreferrer"
                class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
              >
                {{ post.title }}
              </a>
            </h3>
          </div>

          <p
            v-if="post.summary"
            class="text-sm leading-relaxed text-zinc-600 transition-colors duration-300 dark:text-white/70"
          >
            {{ post.summary }}
          </p>

          <a
            :href="post.link"
            target="_blank"
            rel="noopener noreferrer"
            class="group/link mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
          >
            <span>{{ t('feed.card.readMore') }}</span>
            <UIcon
              name="i-heroicons-arrow-top-right-on-square-20-solid"
              class="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5 group-hover/link:rotate-12"
            />
          </a>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize, useMediaQuery } from '@vueuse/core'

const props = defineProps<{ maxHeight?: number | null }>()

const { t, locale } = useI18n({ useScope: 'global' })
const { data, pending, error, refresh } = useFeed()

type FeedCardItem = {
  title: string
  link: string
  date?: string
  summary?: string
  lang?: string | null
}

const allItems = computed<FeedCardItem[]>(() => (data.value?.items || []) as FeedCardItem[])

const hasAnyItems = computed(() => allItems.value.length > 0)

const activeLocale = computed(() =>
  locale.value?.toLowerCase().startsWith('de') ? 'de' : 'en'
)

const localeItems = computed<FeedCardItem[]>(() => {
  const loc = activeLocale.value
  return allItems.value.filter((item) => {
    const lang = item.lang?.toLowerCase() || ''
    return lang.startsWith(loc)
  })
})

const items = computed(() => localeItems.value.slice(0, 3))

const skeletonItems = computed(() => [0, 1, 2])

const { width } = useWindowSize()
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

const hasMounted = ref(false)
onMounted(() => {
  hasMounted.value = true
})

const enableHover = computed(
  () => hasMounted.value && width.value >= 1024 && canHover.value
)

const cardHoverClasses = computed(() =>
  enableHover.value
    ? 'hover:-translate-y-1.5 hover:border-cyber-purple/30 hover:shadow-[0_28px_60px_-40px_rgba(124,58,237,0.55)] dark:hover:border-cyber-purple/40'
    : ''
)

const overlayHoverClasses = computed(() =>
  enableHover.value ? 'group-hover:opacity-100' : ''
)

const dateFormatter = computed(() => {
  try {
    return new Intl.DateTimeFormat(locale.value || 'en', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return null
  }
})

function formatDate(iso?: string) {
  if (!iso) return t('feed.card.unknownDate')
  const formatter = dateFormatter.value
  if (!formatter) return t('feed.card.unknownDate')

  try {
    return formatter.format(new Date(iso))
  } catch {
    return t('feed.card.unknownDate')
  }
}
</script>