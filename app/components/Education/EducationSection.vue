<template>
  <section
    id="education"
    class="relative overflow-hidden transition-colors duration-500"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent"
    ></div>
    <div class="pointer-events-none absolute -top-32 right-24 h-64 w-64 rounded-full blur-[140px]"></div>
    <div class="pointer-events-none absolute -bottom-24 left-16 h-72 w-72 rounded-full blur-[160px]"></div>

    <UContainer class="relative py-24">
      <div class="space-y-12">
        <div
          class="space-y-5 max-w-2xl"
          v-motion
          :initial="motionInitial"
          :visibleOnce="motionVisible(educationDelays.container)"
        >
          <span
            class="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs uppercase tracking-[0.28em]"
          >
            <UIcon name="i-heroicons-academic-cap-20-solid" class="h-4 w-4" />
            {{ t('education.badge') }}
          </span>

          <h2
            class="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white transition-colors duration-300"
          >
            {{ t('education.title') }}
          </h2>

          <p
            class="text-base text-zinc-600 dark:text-white/70 transition-colors duration-300"
          >
            {{ t('education.description') }}
          </p>
        </div>

        <div
          class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          v-motion
          :initial="motionInitial"
          :visibleOnce="motionVisible(educationDelays.cards)"
        >
          <UCard
            v-for="category in educationCategories"
            :key="category.id"
            class="group education-card relative h-full overflow-hidden rounded-[2rem]
                   border border-black/10 bg-white/80 backdrop-blur-xl
                   transition-all duration-400 dark:border-white/10 dark:bg-white/10"
            :class="cardHoverClasses"
          >
            <div
              class="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full blur-3xl"
              :class="category.accent"
            ></div>
            <div
              class="pointer-events-none absolute inset-x-12 top-10 h-28 bg-gradient-to-br blur-3xl"
              :class="category.gradient"
            ></div>

            <div class="relative flex h-full flex-col gap-5 p-6">
              <div class="card-header">
                <div class="card-header-icon">
                  <UIcon :name="category.icon" class="h-10 w-10" />
                </div>
                <div class="space-y-1">
                  <h3 class="text-lg font-semibold text-zinc-900 dark:text-white transition-colors duration-300">
                    {{ category.label }}
                  </h3>
                  <p class="text-sm text-zinc-500 dark:text-white/60 transition-colors duration-300">
                    {{ category.description }}
                  </p>
                </div>
              </div>

              <ul class="timeline flex-1 space-y-6">
                <li
                  v-for="entry in category.entries"
                  :key="entry.title"
                  class="timeline-item"
                >
                  <div class="timeline-marker" aria-hidden="true">
                    <span class="timeline-bullet"></span>
                  </div>
                  <div class="timeline-content">
                    <p class="timeline-title font-semibold text-zinc-900 dark:text-white transition-colors duration-300">
                      {{ entry.title }}
                    </p>
                    <p
                      v-if="entry.period"
                      class="timeline-period text-[11px] font-semibold uppercase tracking-[0.18em]"
                    >
                      {{ entry.period }}
                    </p>
                    <p
                      v-if="entry.org"
                      class="timeline-org text-xs font-medium text-zinc-500 dark:text-white/60 transition-colors duration-300"
                    >
                      {{ entry.org }}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useWindowSize, usePreferredReducedMotion, useMediaQuery } from '@vueuse/core'

type EducationEntry = {
  title: string
  org: string
  period: string
}

type EducationCategoryContent = {
  label: string
  description: string
  entries: EducationEntry[]
}

const educationCategoryMeta = [
  {
    id: 'college',
    icon: 'i-heroicons-academic-cap-20-solid',
    accent: 'bg-cyber-purple/30',
    gradient: 'from-cyber-purple/40 via-cyber-purple/20 to-cyber-green/20'
  },
  {
    id: 'certifications',
    icon: 'i-heroicons-check-badge-20-solid',
    accent: 'bg-cyber-green/30',
    gradient: 'from-cyber-green/40 via-cyber-green/25 to-cyber-purple/20'
  },
  {
    id: 'trainings',
    icon: 'i-heroicons-light-bulb-20-solid',
    accent: 'bg-cyber-purple/20',
    gradient: 'from-cyber-purple/35 via-cyber-green/25 to-cyber-purple/15'
  }
] as const

const { t, tm, rt } = useI18n()

const resolveLocaleValue = (value: unknown): any => {
  if (Array.isArray(value)) {
    return value.map(resolveLocaleValue)
  }

  if (value && typeof value === 'object') {
    if ('type' in value && 'loc' in value) {
      return rt(value as any)
    }

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, resolveLocaleValue(val)])
    )
  }

  return value
}

const educationCategories = computed(() => {
  const localized = resolveLocaleValue(tm('education.categories')) as
    | Record<string, EducationCategoryContent>
    | undefined

  return educationCategoryMeta.map((meta) => {
    const content = localized?.[meta.id]

    return {
      ...meta,
      label: content?.label ?? '',
      description: content?.description ?? '',
      entries: Array.isArray(content?.entries) ? content.entries : []
    }
  })
})

const spring = {
  type: 'spring',
  stiffness: 135,
  damping: 22
} as const

const motionInitial = {
  opacity: 0,
  y: 18
} as const

const motionVisible = (delay: number) => ({
  opacity: 1,
  y: 0,
  transition: {
    ...spring,
    delay
  }
})

const educationDelays = {
  container: 0.0,
  cards: 0.14
}

const { width } = useWindowSize()
const prefersReduced = usePreferredReducedMotion()
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

const hasMounted = ref(false)
onMounted(() => {
  hasMounted.value = true
})

const isDesktop = computed(() => width.value >= 1024)

const enableHoverEffects = computed(
  () =>
    hasMounted.value &&
    isDesktop.value &&
    canHover.value &&
    prefersReduced.value !== 'reduce'
)

const cardHoverClasses = computed(() =>
  enableHoverEffects.value
    ? 'hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(99,102,241,0.55)]'
    : ''
)
</script>

<style scoped>
.education-card {
  --timeline-marker-width: 2.75rem;
  --timeline-gap: 1.15rem;
}

.card-header {
  display: grid;
  grid-template-columns: var(--timeline-marker-width) minmax(0, 1fr);
  column-gap: var(--timeline-gap, 1.15rem);
  align-items: flex-start;
}

.card-header-icon {
  display: flex;
  justify-content: center;
  padding-top: 0.1rem;
}

.timeline {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 1.05rem;
  bottom: 0;
  left: calc(var(--timeline-marker-width) / 2);
  width: 1px;
  background: var(--timeline-rail);
}

.timeline::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: calc(var(--timeline-marker-width) / 2);
  width: 0.65rem;
  height: 0.65rem;
  transform: translate(-50%, 50%);
  border-radius: 9999px;
  background: #179d68;
  box-shadow: 0 0 0 6px rgba(23, 157, 104, 0.12);
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: var(--timeline-marker-width) minmax(0, 1fr);
  column-gap: var(--timeline-gap, 1.15rem);
  align-items: flex-start;
}

.timeline-marker {
  position: relative;
  width: var(--timeline-marker-width);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 0.2rem;
}

.timeline-content {
  min-width: 0;
  padding-top: 0.15rem;
}

.timeline-bullet {
  position: absolute;
  top: 1.05rem;
  left: 50%;
  display: inline-flex;
  width: 0.65rem;
  height: 0.65rem;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background: #179d68;
  box-shadow: 0 0 0 6px rgba(23, 157, 104, 0.18);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

:global(.dark) .timeline-bullet {
  box-shadow: 0 0 0 6px rgba(23, 157, 104, 0.12);
}

@media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
  .timeline-item:hover .timeline-bullet {
    transform: translate(-50%, -50%) scale(1.08);
    box-shadow: 0 0 0 8px rgba(23, 157, 104, 0.22);
  }
}

.timeline-content p {
  margin: 0;
  display: block;
}

.timeline-period,
.timeline-org {
  margin-top: 0.375rem;
}

.timeline-description {
  margin-top: 0.85rem !important;
}
</style>