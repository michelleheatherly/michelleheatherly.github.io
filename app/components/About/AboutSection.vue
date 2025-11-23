<template>
  <section id="about" class="relative transition-colors duration-300">
    <UContainer class="relative py-24">
      <div class="space-y-12">
        <div class="flex justify-start">
          <span
            class="inline-flex items-center gap-2 rounded-full border px-4 py-1
                   text-xs font-semibold uppercase tracking-[0.28em] transition-colors duration-300"
          >
            <UIcon name="i-heroicons-sparkles-20-solid" class="h-4 w-4" />
            {{ t('about.badge') }}
          </span>
        </div>

        <div class="grid items-start gap-12 lg:grid-cols-12">
          <div
            class="relative space-y-10 pb-6 sm:pb-8 lg:col-span-7"
            v-motion
            :initial="motionInitialText"
            :visibleOnce="motionVisibleText(0.08)"
          >
            <div class="space-y-8">
              <div class="space-y-4">
                <h2
                  class="text-3xl font-semibold leading-tight text-zinc-900 transition-colors duration-300
                         md:text-4xl dark:text-white"
                >
                  {{ t('about.heading') }}
                </h2>

                <p
                  class="text-lg text-zinc-600 transition-colors duration-300 dark:text-white/70"
                >
                  {{ t('about.description') }}
                </p>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div
                  class="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 p-5 transition-all duration-300
                         shadow-sm hover:-translate-y-1 hover:shadow-[0_35px_65px_-48px_rgba(16,185,129,0.55)]
                         dark:border-white/10 dark:bg-white/10"
                >
                  <div
                    class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500
                           group-hover:opacity-100"
                    style="background: radial-gradient(120% 120% at 0% 0%, rgba(34,197,94,0.18), transparent 55%)"
                  />
                  <div class="relative">
                    <p class="text-xs font-semibold uppercase tracking-wide">
                      {{ t('about.cards.superpower.title') }}
                    </p>
                    <p class="mt-2 text-sm text-zinc-600 transition-colors duration-300 dark:text-white/70">
                      {{ t('about.cards.superpower.body') }}
                    </p>
                  </div>
                </div>

                <div
                  class="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 p-5 transition-all duration-300
                         shadow-sm hover:-translate-y-1 hover:shadow-[0_35px_65px_-48px_rgba(59,130,246,0.55)]
                         dark:border-white/10 dark:bg-white/10"
                >
                  <div
                    class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500
                           group-hover:opacity-100"
                    style="background: radial-gradient(120% 120% at 90% 10%, rgba(59,130,246,0.2), transparent 55%)"
                  />
                  <div class="relative">
                    <p class="text-xs font-semibold uppercase tracking-wide">
                      {{ t('about.cards.approach.title') }}
                    </p>
                    <p class="mt-2 text-sm text-zinc-600 transition-colors duration-300 dark:text-white/70">
                      {{ t('about.cards.approach.body') }}
                    </p>
                  </div>
                </div>

                <div
                  class="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 p-5 transition-all duration-300
                         shadow-sm hover:-translate-y-1 hover:shadow-[0_35px_65px_-48px_rgba(168,85,247,0.55)]
                         dark:border-white/10 dark:bg-white/10"
                >
                  <div
                    class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500
                           group-hover:opacity-100"
                    style="background: radial-gradient(120% 120% at 10% 90%, rgba(168,85,247,0.2), transparent 55%)"
                  />
                  <div class="relative">
                    <p class="text-xs font-semibold uppercase tracking-wide">
                      {{ t('about.cards.toolkit.title') }}
                    </p>
                    <p class="mt-2 text-sm text-zinc-600 transition-colors duration-300 dark:text-white/70">
                      {{ t('about.cards.toolkit.body') }}
                    </p>
                  </div>
                </div>

                <div
                  class="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 p-5 transition-all duration-300
                         shadow-sm hover:-translate-y-1 hover:shadow-[0_35px_65px_-48px_rgba(244,114,182,0.55)]
                         dark:border-white/10 dark:bg-white/10"
                >
                  <div
                    class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500
                           group-hover:opacity-100"
                    style="background: radial-gradient(120% 120% at 90% 90%, rgba(236,72,153,0.18), transparent 55%)"
                  />
                  <div class="relative">
                    <p class="text-xs font-semibold uppercase tracking-wide">
                      {{ t('about.cards.focus.title') }}
                    </p>
                    <p class="mt-2 text-sm text-zinc-600 transition-colors duration-300 dark:text-white/70">
                      {{ t('about.cards.focus.body') }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <UBadge
                  v-for="badge in aboutBadges"
                  :key="badge"
                  class="border transition-all duration-300
                         hover:-translate-y-1 hover:shadow-[0_18px_35px_-22px_rgba(129,140,248,0.65)] bg-transparent"
                  color="neutral"
                  variant="soft"
                >
                  {{ badge }}
                </UBadge>
              </div>
            </div>
          </div>

          <div
            class="lg:col-span-5 lg:pl-6 xl:pl-10 lg:flex lg:items-start lg:justify-center"
            v-motion
            :initial="motionInitialImage"
            :visibleOnce="motionVisibleImage(0.16)"
          >
            <div
              class="group relative overflow-hidden rounded-[2.75rem] bg-transparent transition-colors duration-300"
            >
              <div class="relative overflow-hidden rounded-[2.75rem]">
                <NuxtImg
                  src="/WerkIt-©LaurenRoberts2024-53.jpg"
                  width="569"
                  height="850"
                  :alt="t('about.portraitAlt')"
                  class="block h-auto w-full rounded-[2.75rem] object-cover transition-transform duration-700 group-hover:scale-105 lg:h-[34rem] lg:max-h-[34rem]"
                  format="webp"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n()

const aboutBadges = computed(() => {
  const raw = tm('about.badges')
  if (!Array.isArray(raw)) return []
  return raw.map((badge) => (typeof badge === 'string' ? badge : rt(badge)))
})

const spring = {
  type: 'spring',
  stiffness: 120,
  damping: 22
} as const

const motionInitialText = {
  opacity: 0,
  y: 18
} as const

const motionVisibleText = (delay: number) => ({
  opacity: 1,
  y: 0,
  transition: {
    ...spring,
    delay
  }
})

const motionInitialImage = {
  opacity: 0,
  y: 26
} as const

const motionVisibleImage = (delay: number) => ({
  opacity: 1,
  y: 0,
  transition: {
    ...spring,
    delay
  }
})
</script>