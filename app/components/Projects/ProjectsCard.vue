<template>
  <UCard
    class="group relative h-full overflow-hidden rounded-2xl transition-all duration-300
           border border-black/10 dark:border-white/10
           bg-white/70 dark:bg-white/5 backdrop-blur-xl
           hover:-translate-y-1 hover:shadow-[0_24px_55px_-30px_rgba(129,140,248,0.65)]
           hover:border-cyber-purple/30
           focus-within:ring-2 focus-within:ring-cyber-purple/40"
    :ui="{ body: 'relative flex h-full flex-col p-0' }"
    @pointermove="handlePointerMove"
    @pointerleave="resetSpotlight"
  >
    <span
      class="pointer-events-none absolute inset-px rounded-2xl
             opacity-0 transition-opacity duration-500 group-hover:opacity-80"
      :style="{ background: spotlightBackground }"
    />

    <span
      class="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyber-purple/0 via-cyber-purple/10 to-cyber-green/0
             opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-soft-light"
    />

    <div class="relative">
      <a
        :href="project.link"
        target="_blank"
        rel="noreferrer"
        class="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple/50"
      >
        <NuxtImg
          :src="projectImageSrc"
          :alt="project.title"
          width="1030"
          height="560"
          class="h-44 w-full object-cover rounded-t-2xl transition-all duration-500 ease-out group-hover:scale-105"
          format="webp"
          loading="lazy"
          decoding="async"
        />
      </a>

      <span
        class="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md transition-all duration-300 shadow-sm"
        :class="categoryMeta.badgeClass"
      >
        <span class="h-1.5 w-1.5 rounded-full" :class="categoryMeta.dotClass" />
        {{ categoryMeta.label }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-4 space-y-3">
      <h3 class="text-lg font-semibold text-zinc-900 dark:text-white transition-colors duration-300">
        {{ project.title }}
      </h3>

      <p class="text-sm leading-relaxed text-zinc-600 dark:text-white/70 transition-colors duration-300">
        {{ project.description }}
      </p>

      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="t in project.tags"
          :key="t"
          :color="$colorMode.value === 'dark' ? 'primary' : 'secondary'"
          variant="soft"
          class="text-xs border border-black/10 dark:border-white/10 transition-colors duration-300"
          :ui="{ rounded: 'rounded-full' }"
        >
          {{ t }}
        </UBadge>
      </div>

      <div class="pt-2 mt-auto flex items-center justify-between gap-2">
        <UButton
          color="success"
          :to="project.link"
          target="_blank"
          rel="noreferrer"
          class="group/button transition-colors duration-300"
        >
          <UIcon
            name="i-heroicons-arrow-top-right-on-square-20-solid"
            class="h-5 w-5 transition-transform duration-500 group-hover/button:-translate-y-0.5 group-hover/button:rotate-12"
          />
          <span>{{ t('projects.card.view') }}</span>
        </UButton>

        <UButton
          v-if="projectCodeHref"
          color="secondary"
          :to="projectCodeHref"
          target="_blank"
          rel="noreferrer"
          class="group/code flex items-center gap-2 transition-colors duration-300"
        >
          <UIcon
            name="i-heroicons-code-bracket-20-solid"
            class="h-5 w-5 transition-transform duration-500 group-hover/code:-translate-y-0.5 group-hover/code:rotate-12"
          />
          <span>{{ t('projects.card.code') }}</span>
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'

const props = defineProps<{
  project: {
    title: string
    description: string
    image: string
    tags: string[]
    link: string
    codeLink?: string
    category: string
  }
}>()

const project = computed(() => props.project)
const { t } = useI18n()

const projectCodeHref = computed(() => {
  const source = project.value.codeLink?.trim()
  return source && source.length > 0 ? source : ''
})

const projectImageSrc = computed(() => {
  const raw = project.value.image?.trim() ?? ''
  if (!raw) return ''

  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('data:')) {
    return raw
  }

  return raw.startsWith('/') ? raw : `/${raw}`
})

const prefersReduced = usePreferredReducedMotion()
const pointerX = ref(50)
const pointerY = ref(110)

const spotlightBackground = computed(() => {
  if (prefersReduced.value === 'reduce') {
    return 'radial-gradient(160px circle at 50% 120%, rgba(139, 92, 246, 0.12), transparent 66%)'
  }

  return `radial-gradient(220px circle at ${pointerX.value}% ${pointerY.value}%,
    rgba(139, 92, 246, 0.35),
    transparent 70%)`
})

const categoryStyleMap: Record<
  string,
  {
    badgeClass: string
    dotClass: string
  }
> = {
  'front-end': {
    badgeClass:
      'bg-violet-100/90 text-violet-700 border border-violet-200/80 dark:bg-violet-500/25 dark:text-violet-50 dark:border-violet-300/40',
    dotClass: 'bg-violet-500 dark:bg-violet-300'
  },
  'full-stack': {
    badgeClass:
      'bg-emerald-100/90 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-500/25 dark:text-emerald-50 dark:border-emerald-300/40',
    dotClass: 'bg-emerald-500 dark:bg-emerald-300'
  },
  design: {
    badgeClass:
      'bg-amber-100/80 text-amber-700 border border-amber-200/70 dark:bg-amber-500/25 dark:text-amber-100 dark:border-amber-400/40',
    dotClass: 'bg-amber-400 dark:bg-amber-300'
  }
}

const fallbackCategoryStyle = {
  badgeClass:
    'bg-zinc-100/90 text-zinc-700 border border-zinc-200/80 dark:bg-white/10 dark:text-white/80 dark:border-white/15',
  dotClass: 'bg-zinc-400'
}

const categoryMeta = computed(() => {
  const currentCategory = project.value.category
  const fallbackLabel = currentCategory
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

  const style = categoryStyleMap[currentCategory]

  if (style) {
    return {
      label: t(`projects.card.categoryLabel.${currentCategory}`),
      badgeClass: style.badgeClass,
      dotClass: style.dotClass
    }
  }

  return {
    label: fallbackLabel,
    badgeClass: fallbackCategoryStyle.badgeClass,
    dotClass: fallbackCategoryStyle.dotClass
  }
})

function handlePointerMove(event: PointerEvent) {
  if (prefersReduced.value === 'reduce') return

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  pointerX.value = Math.round(x)
  pointerY.value = Math.round(y)
}

function resetSpotlight() {
  pointerX.value = 50
  pointerY.value = 110
}
</script>