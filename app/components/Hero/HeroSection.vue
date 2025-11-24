<template>
  <section id="home" class="hero-section relative transition-colors duration-300">
    <UContainer class="pt-16 pb-20 md:pt-20 md:pb-28 lg:py-36">
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <div
          class="space-y-6"
          v-motion
          :initial="motionInitial"
          :enter="motionEnter(0.12)"
        >
          <span
            :class="[
              'availability-pill inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] transition-colors duration-300',
              { group: enableHover }
            ]"
            :aria-label="t('hero.availability')"
          >
            <UIcon
              name="i-heroicons-rocket-launch-20-solid"
              class="h-4 w-4"
            />
            <span class="availability-pill__text" aria-hidden="true">
              {{ t('hero.availability') }}
            </span>
          </span>

          <h1
            class="hero-headline text-4xl md:text-6xl font-extrabold leading-tight
                   text-zinc-900 dark:text-white transition-colors duration-300"
          >
            {{ t('hero.headline.start') }}
            <span class="hero-headline__accent">
              {{ t('hero.accent') }}
            </span>
            {{ t('hero.headline.end') }}
          </h1>

          <p
            class="max-w-prose text-zinc-600 dark:text-white/70 transition-colors duration-300"
          >
            {{ t('hero.description') }}
          </p>

          <div class="flex flex-wrap gap-3">
            <UButton
              size="lg"
              to="#projects"
              :class="{ group: enableHover }"
            >
              <UIcon
                name="i-heroicons-bolt-20-solid"
                class="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-12"
              />
              <span>{{ t('hero.cta.projects') }}</span>
            </UButton>

            <UButton
              size="lg"
              color="neutral"
              variant="soft"
              to="#contact"
              :class="[
                'border transition-colors duration-300 bg-transparent',
                { group: enableHover }
              ]"
            >
              <UIcon
                name="i-heroicons-envelope-20-solid"
                class="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-12"
              />
              <span>{{ t('hero.cta.contact') }}</span>
            </UButton>
          </div>

          <div class="mt-2">
            <HeroScrollIndicator />
          </div>
        </div>

        <div
          class="rounded-3xl overflow-hidden"
          :class="{ group: enableHover }"
          v-motion
          :initial="motionInitial"
          :enter="motionEnter(0.22)"
        >
          <NuxtImg 
            src="/WerkIt-©LaurenRoberts2024-56.jpg"
            width="870"
            height="580"
            :alt="t('hero.portraitAlt')"
            class="block w-full aspect-[1.5] object-cover transition-transform duration-700"
            :class="imageHoverClasses"
            format="webp"
            loading="eager"
            fetchpriority="high"
            preload
          />
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import { useWindowSize, useMediaQuery } from '@vueuse/core'
const { t } = useI18n()

const spring = {
  type: 'spring',
  stiffness: 85,
  damping: 26
} as const

const motionInitial = {
  opacity: 0,
  y: 24
} as const

const motionEnter = (delay: number) => ({
  opacity: 1,
  y: 0,
  transition: {
    ...spring,
    delay
  }
})

const hasMounted = ref(false)
onMounted(() => {
  hasMounted.value = true
})

const { width } = useWindowSize()
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

const enableHover = computed(
  () => hasMounted.value && width.value >= 1024 && canHover.value
)

const imageHoverClasses = computed(() =>
  enableHover.value ? 'group-hover:scale-105' : ''
)
</script>

<style scoped>
.hero-section .hero-headline {
  position: relative;
  text-shadow:
    1px 1px 0 rgba(124, 58, 237, 0.28),
    2px 2px 0 rgba(91, 33, 182, 0.22),
    6px 10px 24px rgba(16, 185, 129, 0.2);
}

.hero-section .hero-headline__accent {
  display: inline-block;
  background: linear-gradient(120deg, #c6a7ff, #8c5cf7 55%, #4ade80);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow:
    1px 1px 0 rgba(76, 29, 149, 0.28),
    3px 6px 18px rgba(74, 222, 128, 0.26);
}

.hero-section .availability-pill {
  gap: 0;
}

.hero-section .availability-pill__text {
  display: inline-block;
  opacity: 1;
  max-width: none;
  margin-left: 0.5rem;
  padding-left: 0.25rem;
  white-space: nowrap;
}
</style>