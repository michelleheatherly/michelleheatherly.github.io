<template>
  <section id="skills" class="relative transition-colors duration-300">
    <UContainer class="py-24">
      <div
        class="max-w-2xl space-y-4 mb-10"
        v-motion
        :initial="motionInitial"
        :visibleOnce="motionVisible(skillDelays.container)"
      >
        <span
          class="inline-flex items-center gap-2 rounded-full border px-4 py-1
                 text-xs font-semibold uppercase tracking-[0.28em] transition-colors duration-300"
        >
          <UIcon name="i-heroicons-wrench-screwdriver-20-solid" class="h-4 w-4" />
          {{ t('skills.badge') }}
        </span>

        <h2
          class="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-white transition-colors duration-300"
        >
          {{ t('skills.title') }}
        </h2>

        <p class="text-zinc-600 dark:text-zinc-300 transition-colors duration-300">
          {{ t('skills.description') }}
        </p>
      </div>

      <div
        class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
        v-motion
        :initial="motionInitial"
        :visibleOnce="motionVisible(skillDelays.cards)"
      >
        <UCard
          v-for="section in skillSections"
          :key="section.id"
          class="group relative h-full overflow-hidden rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80
                 bg-white/60 dark:bg-zinc-900/60 backdrop-blur transition-all duration-400
                 cursor-pointer"
          :class="cardHoverClasses"
          @mouseenter="handleCardMouseEnter(section.id)"
          @mouseleave="handleCardMouseLeave(section.id)"
          @click="toggleSection(section.id)"
        >
          <div
            class="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 transition-opacity duration-500"
            :class="[section.accentGradient, { 'opacity-100': isExpanded(section.id) }]"
          />
          <div
            class="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 mix-blend-overlay"
            :class="[section.motif, { 'opacity-70': isExpanded(section.id) }]"
          />
          <div
            class="pointer-events-none absolute -right-12 top-12 h-28 w-28 rounded-full blur-3xl opacity-0 transition duration-700"
            :class="[section.accentGlow, { 'opacity-80': isExpanded(section.id) }]"
          />

          <div class="relative p-6 h-full">
            <div class="flex h-full flex-col gap-6">
              <div class="flex items-start gap-4">
                <div class="relative">
                  <span
                    class="relative grid h-12 w-12 place-items-center rounded-2xl border border-zinc-200/70 dark:border-zinc-700/70
                           bg-white/70 dark:bg-zinc-900/70 transition-all duration-500"
                    :class="iconHoverClasses"
                  >
                    <UIcon
                      :name="section.icon"
                      class="h-6 w-6 text-cyber-purple transition-transform duration-500"
                      :class="iconTransformClasses"
                    />
                  </span>
                  <span
                    class="pointer-events-none absolute -right-1 -top-1 h-3 w-3 rounded-full bg-cyber-purple/80 transition duration-500"
                    :class="isExpanded(section.id) ? 'opacity-100 animate-ping' : 'opacity-0'"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-zinc-900 dark:text-white transition-colors duration-300">
                    {{ section.title }}
                  </h3>
                  <p class="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 transition-colors duration-300">
                    {{ section.blurb }}
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <span
                  v-for="highlight in section.highlights"
                  :key="highlight"
                  class="text-xs font-medium tracking-wide uppercase px-3 py-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-800/80
                         text-zinc-600 dark:text-zinc-200 bg-white/70 dark:bg-zinc-900/70 transition-colors duration-300"
                  :class="highlightHoverClasses"
                >
                  {{ highlight }}
                </span>
              </div>

              <div class="mt-auto">
                <div
                  class="overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/70 transition-all duration-500"
                  :class="isExpanded(section.id) ? 'max-h-28 opacity-100' : 'max-h-0 opacity-0'"
                >
                  <p class="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                    {{ section.peek }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            class="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full
                   border border-zinc-200/80 bg-white/80 text-zinc-500 dark:border-zinc-700/80 dark:bg-zinc-900/80
                   opacity-80 transition duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple/40"
            :class="isExpanded(section.id) ? 'opacity-0 -translate-y-1 scale-95' : ''"
            :aria-expanded="isExpanded(section.id)"
            aria-label="Toggle details"
            @click.stop="toggleSection(section.id)"
          >
            <UIcon
              v-if="!isExpanded(section.id)"
              :name="IconChevronDoubleDown"
              class="h-4 w-4 transition-transform duration-500 text-zinc-500 dark:text-zinc-300"
            />
            <UIcon
              v-else
              :name="IconChevronDoubleUp"
              class="h-4 w-4 transition-transform duration-500 text-zinc-500 dark:text-zinc-300"
            />
          </button>
        </UCard>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import { useWindowSize, useMediaQuery } from '@vueuse/core'
import IconChevronDoubleUp from '~icons/heroicons/chevron-double-up-20-solid'
import IconChevronDoubleDown from '~icons/heroicons/chevron-double-down-20-solid'

type SkillSectionContent = {
  title: string
  blurb: string
  highlights: string[]
  peek: string
}

const skillSectionMeta = [
  {
    id: 'frontend',
    icon: 'i-heroicons-rocket-launch-20-solid',
    accentGradient: 'from-cyber-purple/0 via-cyber-purple/20 to-cyber-purple/35',
    accentGlow: 'bg-cyber-purple/30',
    motif: 'bg-[radial-gradient(circle_at_top,rgba(165,180,252,0.22),transparent_60%)]'
  },
  {
    id: 'backend',
    icon: 'i-heroicons-swatch-20-solid',
    accentGradient: 'from-cyan-400/0 via-cyan-400/20 to-cyan-400/35',
    accentGlow: 'bg-cyan-400/30',
    motif: 'bg-[radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.22),transparent_58%)]'
  },
  {
    id: 'design',
    icon: 'i-heroicons-sparkles-20-solid',
    accentGradient: 'from-emerald-400/0 via-emerald-400/20 to-emerald-400/35',
    accentGlow: 'bg-emerald-400/30',
    motif: 'bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.24),transparent_55%)]'
  },
  {
    id: 'testing',
    icon: 'i-heroicons-eye-dropper-20-solid',
    accentGradient: 'from-amber-400/0 via-amber-400/20 to-amber-400/35',
    accentGlow: 'bg-amber-400/30',
    motif: 'bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.24),transparent_60%)]'
  },
  {
    id: 'collaboration',
    icon: 'i-heroicons-users-20-solid',
    accentGradient: 'from-rose-400/0 via-rose-400/20 to-rose-400/35',
    accentGlow: 'bg-rose-400/30',
    motif: 'bg-[radial-gradient(circle_at_bottom_left,rgba(251,113,133,0.22),transparent_60%)]'
  },
  {
    id: 'infrastructure',
    icon: 'i-heroicons-cog-8-tooth-20-solid',
    accentGradient: 'from-indigo-400/0 via-indigo-400/20 to-indigo-400/35',
    accentGlow: 'bg-indigo-400/30',
    motif: 'bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.22),transparent_58%)]'
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
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        resolveLocaleValue(val)
      ])
    )
  }

  return value
}

const skillSections = computed(() => {
  const localized = resolveLocaleValue(tm('skills.sections')) as
    | Record<string, SkillSectionContent>
    | undefined

  return skillSectionMeta.map((meta) => ({
    ...meta,
    ...(localized?.[meta.id] ?? {
      title: '',
      blurb: '',
      highlights: [],
      peek: ''
    })
  }))
})

const spring = {
  type: 'spring',
  stiffness: 140,
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

const skillDelays = {
  container: 0.0,
  cards: 0.12
}

const { width } = useWindowSize()
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

const hasMounted = ref(false)
onMounted(() => {
  hasMounted.value = true
})

const enableCardHover = computed(
  () => hasMounted.value && width.value >= 1024 && canHover.value
)

const cardHoverClasses = computed(() =>
  enableCardHover.value
    ? 'hover:-translate-y-1 hover:shadow-[0_22px_55px_-28px_rgba(165,180,252,0.55)] hover:border-cyber-purple/40'
    : ''
)

const iconHoverClasses = computed(() =>
  enableCardHover.value
    ? 'group-hover:border-transparent group-hover:bg-white dark:group-hover:bg-zinc-900 group-hover:shadow-[0_16px_40px_-30px_rgba(165,180,252,0.95)]'
    : ''
)

const iconTransformClasses = computed(() =>
  enableCardHover.value ? 'group-hover:-translate-y-0.5 group-hover:rotate-12' : ''
)

const highlightHoverClasses = computed(() =>
  enableCardHover.value ? 'group-hover:border-cyber-purple/50' : ''
)

const hoveredId = ref<string | null>(null)
const manualExpandedId = ref<string | null>(null)
const blockedHoverId = ref<string | null>(null)

const toggleSection = (id: string) => {
  const currentlyExpanded = isExpanded(id)

  if (currentlyExpanded) {
    manualExpandedId.value = null
    blockedHoverId.value = id
  } else {
    manualExpandedId.value = id
    blockedHoverId.value = null
  }
}

const handleCardMouseEnter = (id: string) => {
  if (!enableCardHover.value) return
  hoveredId.value = id
}

const handleCardMouseLeave = (id: string) => {
  if (hoveredId.value === id) {
    hoveredId.value = null
  }
  if (blockedHoverId.value === id) {
    blockedHoverId.value = null
  }
}

const isExpanded = (id: string) =>
  manualExpandedId.value === id ||
  (hoveredId.value === id && blockedHoverId.value !== id)
</script>
