<template>
  <ClientOnly>
    <UButton
      :aria-label="ariaLabel"
      color="neutral"
      variant="ghost"
      size="sm"
      :class="[
        'group/theme-toggle rounded-full border border-transparent bg-transparent hover:border-neutral-500/70 hover:bg-transparent hover:cursor-pointer',
        'text-zinc-900 dark:text-zinc-100',
        quickMode ? 'transition-none duration-0' : 'transition duration-300'
      ]"
      @click="onClick"
    >
      <UIcon
        :name="isDark ? IconSun : IconMoon"
        :class="[
          'h-5 w-5',
          'text-zinc-900 dark:text-zinc-100',
          quickMode
            ? 'transition-none duration-0'
            : 'transition-transform duration-500 group-hover/theme-toggle:-translate-y-0.5 group-hover/theme-toggle:rotate-12'
        ]"
      />
    </UButton>

    <template #fallback>
      <UButton
        :aria-label="ariaLabel"
        color="neutral"
        variant="ghost"
        size="sm"
        class="group/theme-toggle rounded-full border border-transparent bg-transparent hover:border-neutral-500/70 hover:bg-transparent hover:cursor-pointer transition-none duration-0 text-zinc-900 dark:text-zinc-100"
        @click="switchTheme"
      >
        <UIcon
          :name="isDark ? IconSun : IconMoon"
          class="h-5 w-5 text-zinc-900 dark:text-zinc-100 transition-none duration-0"
        />
      </UButton>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import IconSun from '~icons/lucide/sun'
import IconMoon from '~icons/lucide/moon'
import { useWindowSize, useMediaQuery } from '@vueuse/core'

const colorMode = useColorMode()
const { t } = useI18n()

const isDark = computed(() => colorMode.value === 'dark')
const nextTheme = computed(() => (isDark.value ? 'light' : 'dark'))
const modeLabel = computed(() => t(`common.modes.${nextTheme.value}`))
const ariaLabel = computed(() => t('theme.switch', { mode: modeLabel.value }))

function switchTheme() {
  colorMode.preference = nextTheme.value
}

const isSafari = computed(
  () =>
    typeof navigator !== 'undefined' &&
    /safari/i.test(navigator.userAgent) &&
    !/chrome|crios|opr|edg/i.test(navigator.userAgent)
)

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

const supportsViewTransition = () =>
  typeof document !== 'undefined' && 'startViewTransition' in document

const { width } = useWindowSize()
const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)')
const isMobileViewport = computed(() => width.value < 1024)
const isMobile = computed(() => isMobileViewport.value || isTouch.value)

const quickMode = computed(
  () =>
    isMobile.value ||
    prefersReduced() ||
    isSafari.value ||
    !supportsViewTransition()
)

function onClick(e: MouseEvent) {
  if (quickMode.value) {
    switchTheme()
    return
  }

  startViewTransition(e)
}

function startViewTransition(event: MouseEvent) {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  // @ts-expect-error experimental
  const transition = document.startViewTransition(() => {
    switchTheme()
  })

  transition.ready.then(() => {
    const duration = 600
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ]
      },
      {
        duration,
        easing: 'cubic-bezier(.76,.32,.29,.99)',
        pseudoElement: '::view-transition-new(root)'
      }
    )
  })
}
</script>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-new(root) { z-index: 9999; }
::view-transition-old(root) { z-index: 1; }

.transition-none,
.transition-none * {
  transition: none !important;
  animation: none !important;
}
</style>