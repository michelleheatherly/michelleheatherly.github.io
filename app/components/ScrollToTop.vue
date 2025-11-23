<template>
  <Teleport to="body">
    <Transition name="fade-slide">
      <button
        v-show="show"
        :style="{ bottom: bottomPx }"
        :aria-label="t('scrollIndicator.top')"
        class="fixed right-5 z-[60] inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2
          text-xs font-medium tracking-wide
          shadow-[0_4px_24px_rgba(88,28,135,0.25)]
          ring-1 ring-black/10 dark:ring-white/10
          backdrop-blur-md
          bg-gradient-to-br from-[#a78bfa]/90 via-[#8b5cf6]/90 to-[#7c3aed]/90
          text-white/95
          hover:shadow-[0_12px_36px_rgba(88,28,135,0.4)]
          hover:brightness-110
          hover:scale-[1.03]
          hover:-translate-y-[1px]
          active:scale-[0.98]
          transition-all duration-300
          dark:from-[#5b21b6]/90 dark:via-[#6d28d9]/90 dark:to-[#7c3aed]/90"
        @click="onClick"
      >
        <span class="h-2 w-2 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.8)]"></span>
        <span class="uppercase tracking-[0.12em]">{{ t('scrollIndicator.top') }}</span>
        <UIcon name="i-heroicons-chevron-up-20-solid" class="h-4 w-4 text-white/95" />
      </button>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useWindowScroll, useThrottleFn } from '@vueuse/core'

type Props = {
  footerVisible?: boolean
  liftWhenFooter?: number
  showAfter?: number
}
const props = withDefaults(defineProps<Props>(), {
  footerVisible: false,
  liftWhenFooter: 96, // ~6rem
  showAfter: 240
})

const { t } = useI18n()

const { y } = useWindowScroll()

const show = computed(() => y.value > props.showAfter)

const bottomPx = computed(() => {
  // base = 20px (1.25rem) + safe-area inset; lift extra if footer visible
  const base = 20
  const lift = props.footerVisible ? props.liftWhenFooter : 0
  return `${base + lift}px`
})

const onClick = useThrottleFn(() => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}, 400, true)
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: none;
  }
}
</style>
