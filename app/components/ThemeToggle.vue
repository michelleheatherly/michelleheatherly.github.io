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
      <span class="relative inline-flex h-5 w-5 items-center justify-center">
        <UIcon
          :name="IconSun"
          :class="[
            iconBaseClasses,
            isDark ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          ]"
        />
        <UIcon
          :name="IconMoon"
          :class="[
            iconBaseClasses,
            isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          ]"
        />
      </span>
    </UButton>

    <template #fallback>
      <UButton
        :aria-label="t('theme.switch', { mode: t('common.modes.dark') })"
        color="neutral"
        variant="ghost"
        size="sm"
        class="group/theme-toggle rounded-full border border-transparent bg-transparent hover:border-neutral-500/70 hover:bg-transparent hover:cursor-pointer transition-none duration-0 text-zinc-900 dark:text-zinc-100"
      >
        <span class="relative inline-flex h-5 w-5 items-center justify-center">
          <UIcon
            :name="IconMoon"
            class="absolute h-5 w-5 text-zinc-900 dark:text-zinc-100"
          />
        </span>
      </UButton>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import IconSun from '~icons/lucide/sun'
import IconMoon from '~icons/lucide/moon'
import { usePreferredReducedMotion, useMediaQuery } from '@vueuse/core'

const colorMode = useColorMode()
const { t } = useI18n()

const isDark = computed(() => colorMode.value === 'dark')
const nextTheme = computed(() => (isDark.value ? 'light' : 'dark'))

function switchTheme() {
  colorMode.preference = nextTheme.value
}

const reducedMotion = usePreferredReducedMotion()
const isCoarsePointer = useMediaQuery('(hover: none) and (pointer: coarse)')

const isSafari = computed(
  () =>
    typeof navigator !== 'undefined' &&
    /safari/i.test(navigator.userAgent) &&
    !/chrome|crios|opr|edg/i.test(navigator.userAgent)
)

const supportsViewTransition = computed(
  () => typeof document !== 'undefined' && 'startViewTransition' in document
)

const quickMode = computed(() => {
  if (typeof window === 'undefined') return true

  return (
    reducedMotion.value === 'reduce' ||
    isCoarsePointer.value ||
    isSafari.value ||
    !supportsViewTransition.value
  )
})

const ariaLabel = computed(() =>
  t('theme.switch', { mode: t(`common.modes.${nextTheme.value}`) })
)

const iconBaseClasses = computed(() => {
  const base = 'absolute h-5 w-5 text-zinc-900 dark:text-zinc-100'
  if (quickMode.value) {
    return base + ' transition-opacity duration-200'
  }
  return (
    base +
    ' transition-all duration-300 group-hover/theme-toggle:-translate-y-0.5 group-hover/theme-toggle:rotate-12'
  )
})

function onClick(e: MouseEvent) {
  if (quickMode.value) {
    switchTheme()
    return
  }

  startViewTransition(e)
}

function startViewTransition(event: MouseEvent) {
  if (typeof document === 'undefined' || !('startViewTransition' in document)) {
    switchTheme()
    return
  }

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
::view-transition-new(root) {
  z-index: 9999;
}
::view-transition-old(root) {
  z-index: 1;
}

.transition-none,
.transition-none * {
  transition: none !important;
  animation: none !important;
}
</style>