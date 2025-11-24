<template>
  <UApp>
    <section
      id="error-page"
      class="relative min-h-screen flex items-center justify-center transition-colors duration-300 bg-gradient-to-b from-[#fefcff] via-[#f6f1ff] to-[#e7d9ff] dark:from-[#03000b] dark:via-[#14022f] dark:to-[#05010f]"
    >
      <UContainer class="py-16">
        <div
          class="mx-auto max-w-2xl rounded-[2.5rem] border border-dashed border-zinc-300/70 bg-gradient-to-br from-[#fefbff] via-[#f2e6ff] to-[#d9c5ff] px-6 py-10 text-center shadow-sm backdrop-blur-md dark:border-zinc-700/60 dark:from-[#090114] dark:via-[#1a0456] dark:to-[#090117]"
          v-motion
          :initial="{ opacity: 0, y: 32, scale: 0.96 }"
          :enter="{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.55, ease: 'easeOut' }
          }"
        >
          <div
            class="space-y-6"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { delay: 0.12, duration: 0.45, ease: 'easeOut' }
            }"
          >
            <div class="flex flex-col items-center gap-4">
              <img 
                src="/confused-kitty.png"
                width="250"
                height="250"
                :alt="t('error.imageAlt')"
                class="mx-auto h-40 w-40 object-contain"
                :class="kittyClasses"
                loading="lazy"
              />

              <div class="space-y-3">
                <span
                  class="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-zinc-600/80 bg-white/20 dark:border-zinc-700/60 dark:bg-white/10 dark:text-zinc-300"
                >
                  <UIcon
                    :name="IconExclamationTriangle"
                    class="h-4 w-4 text-amber-500 dark:text-amber-400"
                  />
                  <span>{{ t('error.badge') }}</span>
                </span>

                <h1
                  class="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white transition-colors duration-300"
                >
                  {{ t('error.heading') }}
                </h1>

                <p class="text-sm md:text-base text-zinc-600 dark:text-zinc-300">
                  {{ t('error.description.primary') }}
                </p>
                <p class="text-sm md:text-base text-zinc-600 dark:text-zinc-300">
                  {{ t('error.description.secondary') }}
                </p>
              </div>
            </div>

            <div
              class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
              v-motion
              :initial="{ opacity: 0, y: 22 }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: { delay: 0.22, duration: 0.45, ease: 'easeOut' }
              }"
            >
              <UButton
                color="primary"
                variant="solid"
                class="justify-center cursor-pointer"
                @click="handleRetry"
              >
                <UIcon :name="IconArrowPath" class="h-5 w-5" />
                <span>{{ t('error.actions.retry') }}</span>
              </UButton>

              <UButton
                color="secondary"
                variant="outline"
                class="justify-center cursor-pointer"
                @click="handleGoHome"
              >
                <UIcon :name="IconHome" class="h-5 w-5" />
                <span>{{ t('error.actions.home') }}</span>
              </UButton>
            </div>

            <div class="mt-3 flex justify-center">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            <div
              class="mt-6 border-t border-zinc-200/70 pt-4 text-left dark:border-zinc-700/60"
              v-motion
              :initial="{ opacity: 0, y: 18 }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: { delay: 0.3, duration: 0.45, ease: 'easeOut' }
              }"
            >
              <button
                type="button"
                class="group inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-purple-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 cursor-pointer"
                @click="showDetails = !showDetails"
              >
                <UIcon
                  :name="showDetails ? IconChevronUp : IconChevronDown"
                  class="h-4 w-4 text-zinc-400 transition-transform duration-300 group-hover:translate-y-0.5"
                />
                <span>{{ t('error.technical.details') }}</span>
              </button>

              <Transition name="fade-slide">
                <div
                  v-if="showDetails"
                  class="mt-3 rounded-2xl border border-zinc-200/70 bg-zinc-950/95 p-4 text-xs text-zinc-200 shadow-inner max-h-64 overflow-auto font-mono dark:border-zinc-700/70"
                >
                  <p class="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    {{ t('error.technical.status') }}
                  </p>
                  <p class="mb-3 text-sm">{{ displayStatusCode }}</p>

                  <p class="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    {{ t('error.technical.message') }}
                  </p>
                  <p class="mb-3 text-sm break-words">
                    {{ displayMessage }}
                  </p>

                  <p
                    v-if="displayStack"
                    class="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-zinc-400"
                  >
                    {{ t('error.technical.stack') }}
                  </p>
                  <pre
                    v-if="displayStack"
                    class="whitespace-pre-wrap text-[0.7rem] leading-relaxed text-zinc-300"
                  >
  {{ displayStack }}</pre
                  >
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from 'nuxt/app'
import { clearError } from '#app'
import IconExclamationTriangle from '~icons/heroicons/exclamation-triangle-20-solid'
import IconArrowPath from '~icons/heroicons/arrow-path-20-solid'
import IconHome from '~icons/heroicons/home-20-solid'
import IconChevronUp from '~icons/heroicons/chevron-up-20-solid'
import IconChevronDown from '~icons/heroicons/chevron-down-20-solid'
import { usePreferredReducedMotion, useWindowSize, useMediaQuery } from '@vueuse/core'

const props = defineProps<{
  error: NuxtError
}>()

const showDetails = ref(false)
const { t } = useI18n()

const displayStatusCode = computed(
  () =>
    props.error?.statusCode ??
    // @ts-ignore - Nuxt error variations
    props.error?.status ??
    'N/A'
)

const displayMessage = computed(
  () =>
    props.error?.message ??
    // @ts-ignore
    props.error?.statusMessage ??
    'Unknown error'
)

const displayStack = computed(() => {
  // @ts-ignore
  return props.error?.stack || props.error?.cause?.stack || ''
})

const handleRetry = () => {
  clearError()
}

const handleGoHome = () => {
  clearError({ redirect: '/' })
}

const prefersReduced = usePreferredReducedMotion()
const { width } = useWindowSize()
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

const hasMounted = ref(false)
onMounted(() => {
  hasMounted.value = true
})

const isDesktop = computed(() => width.value >= 1024)

const enableKittyMotion = computed(
  () =>
    hasMounted.value &&
    isDesktop.value &&
    canHover.value &&
    prefersReduced.value !== 'reduce'
)

const kittyClasses = computed(() =>
  enableKittyMotion.value ? 'error-kitty' : ''
)
</script>

<style scoped>
.error-kitty {
  animation: error-kitty-bob 10s ease-in-out infinite;
  transform-origin: center bottom;
  will-change: transform;
  position: relative;

  filter:
    drop-shadow(0 0 9px rgba(126, 78, 255, 0.25))
    drop-shadow(0 0 16px rgba(16, 185, 129, 0.18))
    drop-shadow(0 0 28px rgba(126, 78, 255, 0.2));
  transition:
    transform 300ms ease,
    filter 300ms ease;
}

.error-kitty::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;

  background: radial-gradient(
    circle,
    rgba(126, 78, 255, 0.15) 0%,
    rgba(16, 185, 129, 0.08) 40%,
    transparent 75%
  );

  filter: blur(18px);
  transform: scale(1.35);
  opacity: 0.6;
  transition: opacity 300ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .error-kitty:hover {
    animation-play-state: paused;
    transform: translate3d(0, -5px, 0) rotate(2deg) scale(1.02);
    filter:
      drop-shadow(0 0 14px rgba(126, 78, 255, 0.35))
      drop-shadow(0 0 22px rgba(16, 185, 129, 0.25))
      drop-shadow(0 0 36px rgba(126, 78, 255, 0.24));
  }

  .error-kitty:hover::after {
    opacity: 0.75;
  }
}

@keyframes error-kitty-bob {
  0% {
    transform: translate3d(0, 0, 0) rotate(-2deg);
  }
  25% {
    transform: translate3d(0, -6px, 0) rotate(1deg);
  }
  50% {
    transform: translate3d(0, -3px, 0) rotate(3deg);
  }
  75% {
    transform: translate3d(0, -8px, 0) rotate(0deg);
  }
  100% {
    transform: translate3d(0, 0, 0) rotate(-2deg);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease,
    filter 200ms ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
  filter: blur(4px);
}

@media (prefers-reduced-motion: reduce) {
  .error-kitty {
    animation: none;
    transform: none;
    filter: none;
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: opacity 150ms ease;
  }

  .fade-slide-enter-from,
  .fade-slide-leave-to {
    transform: none;
    filter: none;
  }
}
</style>
