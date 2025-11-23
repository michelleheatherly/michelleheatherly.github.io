<template>
  <section id="projects" class="relative transition-colors duration-300">
    <UContainer class="py-24">
      <div
        class="space-y-10 mb-12"
        v-motion
        :initial="motionInitial"
        :visibleOnce="motionVisible(projectDelays.container)"
      >
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div class="max-w-2xl space-y-4">
            <span
              class="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs uppercase tracking-[0.28em]"
            >
              <UIcon :name="IconBeaker" class="h-4 w-4" />
              {{ t('projects.badge') }}
            </span>

            <div class="space-y-3">
              <h2
                class="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white transition-colors duration-300"
              >
                {{ t('projects.title') }}
              </h2>
              <p
                class="text-base text-zinc-600 dark:text-zinc-300 transition-colors duration-300"
              >
                {{ t('projects.description') }}
              </p>
            </div>
          </div>

          <div>
            <UButton
              color="neutral"
              variant="outline"
              href="/resume.pdf"
              download
              class="justify-center group border transition-colors duration-300 bg-transparent"
            >
              <UIcon
                :name="IconArrowDownTray"
                class="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-12"
              />
              <span>{{ t('projects.resume') }}</span>
            </UButton>
          </div>
        </div>

        <div
          class="space-y-4 relative z-20"
          v-motion
          :initial="motionInitial"
          :visibleOnce="motionVisible(projectDelays.filters)"
        >
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="category in categoryFilters"
              :key="category.value"
              type="button"
              class="inline-flex cursor-pointer items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple/50 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_-20px_rgba(99,102,241,0.6)]"
              :class="[
                activeCategory === category.value
                  ? 'border-cyber-purple/60 bg-cyber-purple/15 text-cyber-purple dark:bg-cyber-purple/20'
                  : 'border-zinc-300/60 bg-white/70 text-zinc-600 hover:border-cyber-purple/40 hover:text-cyber-purple dark:border-zinc-700/60 dark:bg-white/5 dark:text-zinc-300'
              ]"
              @click="activeCategory = category.value"
            >
              {{ category.label }}
            </button>
          </div>

          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex w-full flex-wrap items-center gap-3 lg:w-auto">
              <UPopover
                v-model:open="tagMenuOpen"
                :content="{ side: 'bottom', align: 'start', sideOffset: 8, collisionPadding: 12 }"
                arrow
              >
                <UButton
                  color="gray"
                  variant="soft"
                  class="group inline-flex cursor-pointer items-center gap-3 rounded-full border px-4 py-1.5 text-sm font-medium
                        transition-all duration-300
                        border-zinc-300/60 bg-white/70 text-zinc-600
                        hover:-translate-y-0.5 hover:shadow-[0_14px_35px_-20px_rgba(99,102,241,0.6)]
                        hover:border-cyber-purple/40 hover:text-cyber-purple
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple/50
                        dark:border-zinc-700/60 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-cyber-purple"
                >
                  <UIcon
                    :name="IconTag"
                    class="h-5 w-5 text-zinc-400 group-hover:text-cyber-purple"
                  />

                  <span class="font-medium">
                    {{ t('projects.filters.tags.button') }}
                  </span>

                  <span
                    v-if="activeTags.length"
                    class="inline-flex items-center justify-center rounded-full bg-cyber-purple/15 px-2 text-xs font-semibold text-cyber-purple transition-colors duration-300 dark:bg-cyber-purple/20"
                  >
                    {{ activeTags.length }}
                  </span>

                  <UIcon
                    :name="tagMenuOpen ? IconChevronUp : IconChevronDown"
                    class="h-4 w-4 text-zinc-400 transition-transform duration-300 group-hover:text-cyber-purple"
                  />
                </UButton>

                <template #content>
                  <div class="space-y-4 p-4 dark:bg-zinc-900/90">
                    <div class="flex items-center justify-between gap-3">
                      <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        {{ t('projects.filters.tags.title') }}
                      </p>
                      <div class="flex items-center gap-3">
                        <button
                          v-if="activeTags.length"
                          type="button"
                          class="text-xs font-semibold uppercase tracking-[0.18em] text-cyber-green transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-green/40 cursor-pointer"
                          @click="activeTags = []"
                        >
                          {{ t('projects.filters.tags.clear') }}
                        </button>
                        <button
                          type="button"
                          class="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple/40 cursor-pointer"
                          @click="tagMenuOpen = false; tagSearchQuery = ''"
                        >
                          {{ t('projects.filters.tags.done') }}
                        </button>
                      </div>
                    </div>

                    <label class="relative block">
                      <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400 dark:text-zinc-500">
                        <UIcon :name="IconMagnifyingGlass" class="h-4 w-4" />
                      </span>
                      <input
                        v-model="tagSearchQuery"
                        type="search"
                        :placeholder="t('projects.filters.tags.searchPlaceholder')"
                        class="w-full rounded-2xl border border-zinc-200/60 bg-white/80 py-2 pl-10 pr-3 text-sm text-zinc-700 transition focus:border-cyber-purple/50 focus:outline-none focus:ring-2 focus:ring-cyber-purple/30 dark:border-zinc-600/60 dark:bg-white/10 dark:text-white"
                      />
                    </label>

                    <div class="max-h-64 space-y-2 overflow-y-auto pr-1 pt-2">
                      <p v-if="filteredTagOptions.length === 0" class="text-sm text-zinc-500 dark:text-zinc-400">
                        {{ t('projects.filters.tags.empty') }}
                      </p>
                      <button
                        v-for="tag in filteredTagOptions"
                        :key="tag"
                        type="button"
                        class="flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-2 text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple/40 hover:-translate-y-0.5"
                        :class="[
                          activeTags.includes(tag)
                            ? 'border-cyber-purple/55 bg-cyber-purple/15 text-cyber-purple hover:border-cyber-purple/70 hover:bg-cyber-purple/25 dark:bg-cyber-purple/20 dark:hover:bg-cyber-purple/30'
                            : 'border-transparent bg-zinc-100/80 text-zinc-600 hover:border-cyber-purple/55 hover:bg-cyber-purple/15 hover:text-cyber-purple dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-cyber-purple/20'
                        ]"
                        @click="activeTags = activeTags.includes(tag) ? activeTags.filter(t => t !== tag) : [...activeTags, tag]"
                      >
                        <span class="capitalize">{{ tag }}</span>
                        <UIcon
                          :name="activeTags.includes(tag) ? IconMinusCircle : IconPlusCircle"
                          :class="[
                            'h-5 w-5 transition-transform duration-300',
                            activeTags.includes(tag)
                              ? 'text-cyber-purple dark:text-cyber-purple'
                              : 'text-zinc-500 dark:text-zinc-400'
                          ]"
                        />
                      </button>
                    </div>
                  </div>
                </template>
              </UPopover>

              <button
                v-if="hasActiveFilters"
                type="button"
                class="ml-auto inline-flex items-center gap-2 rounded-full border border-transparent px-3.5 py-1.5 text-sm font-bold text-cyber-green transition-all duration-300 hover:-translate-y-0.5 hover:text-cyber-green hover:shadow-[0_16px_40px_-28px_rgba(59,130,246,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-green/40 cursor-pointer"
                @click="clearFilters"
              >
                <UIcon
                  :name="IconArrowPath"
                  class="h-4 w-4 text-cyber-green dark:text-cyber-green"
                />
                {{ t('projects.filters.reset') }}
              </button>
            </div>

            <div class="w-full lg:w-72">
              <label class="relative block">
                <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-400 dark:text-zinc-500">
                  <UIcon :name="IconMagnifyingGlass" class="h-5 w-5" />
                </span>
                <input
                  v-model="searchQuery"
                  type="search"
                  :placeholder="t('projects.filters.searchPlaceholder')"
                  class="w-full rounded-2xl border border-zinc-200/60 bg-white/80 py-2.5 pl-12 pr-4 text-sm text-zinc-700 shadow-sm transition focus:border-cyber-purple/50 focus:outline-none focus:ring-2 focus:ring-cyber-purple/30 dark:border-zinc-700/60 dark:bg-white/10 dark:text-white"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="filteredProjects.length > 0"
        class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        v-motion
        :initial="motionInitial"
        :visibleOnce="motionVisible(projectDelays.grid)"
      >
        <ProjectsCard
          v-for="p in filteredProjects"
          :key="p.title"
          :project="p"
        />
      </div>
      <div
        v-else
        class="rounded-[2.5rem] border border-dashed border-zinc-300/70 bg-white/60 py-16 text-center transition-colors duration-300 dark:border-zinc-700/60 dark:bg-white/5"
        v-motion
        :initial="motionInitial"
        :visibleOnce="motionVisible(projectDelays.grid)"
      >
        <div class="mx-auto max-w-md space-y-4 px-6">
           <img
              src="/sad-kitty.png"
              width="250"
              height="250"
              alt="A sad kitty illustration"
              class="mx-auto h-50 w-50 object-contain empty-state-kitty"
              loading="lazy"
            />
          <p class="text-lg font-semibold text-zinc-900 dark:text-white">
            {{ t('projects.empty.title') }}
          </p>
          <p class="text-sm text-zinc-600 dark:text-zinc-300">
            {{ t('projects.empty.description') }}
          </p>
          <UButton variant="solid" class="mt-2 cursor-pointer" @click="clearFilters">
            <UIcon :name="IconSparkles" class="h-5 w-5" />
            <span>{{ t('projects.empty.action') }}</span>
          </UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import IconBeaker from '~icons/heroicons/beaker-20-solid'
import IconArrowDownTray from '~icons/heroicons/arrow-down-tray-20-solid'
import IconTag from '~icons/heroicons/tag-20-solid'
import IconChevronUp from '~icons/heroicons/chevron-up-20-solid'
import IconChevronDown from '~icons/heroicons/chevron-down-20-solid'
import IconMagnifyingGlass from '~icons/heroicons/magnifying-glass-20-solid'
import IconMinusCircle from '~icons/heroicons/minus-circle-20-solid'
import IconPlusCircle from '~icons/heroicons/plus-circle-20-solid'
import IconArrowPath from '~icons/heroicons/arrow-path-20-solid'
import IconSparkles from '~icons/heroicons/sparkles-20-solid'

const categoryFilterMeta = [
  { key: 'all', value: 'all' },
  { key: 'front-end', value: 'front-end' },
  { key: 'full-stack', value: 'full-stack' },
  { key: 'design', value: 'design' }
] as const

type CategoryFilter = (typeof categoryFilterMeta)[number]['value']
type ProjectCategory = Exclude<CategoryFilter, 'all'>

type Project = {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  link: string
  codeLink?: string
  category: ProjectCategory
}

type LocalizedProjectEntry = Partial<Project> & { id?: string }

const projectCategoryValues = categoryFilterMeta
  .map((filter) => filter.value)
  .filter((value): value is ProjectCategory => value !== 'all')

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

const isProjectCategory = (value: unknown): value is ProjectCategory =>
  typeof value === 'string' && projectCategoryValues.includes(value as ProjectCategory)

const normalizeProjectEntries = (value: unknown): LocalizedProjectEntry[] => {
  if (!value) return []

  if (Array.isArray(value)) {
    return value as LocalizedProjectEntry[]
  }

  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([id, entry]) => ({
      id,
      ...(entry as LocalizedProjectEntry)
    }))
  }

  return []
}

const projects = computed<Project[]>(() => {
  const localized = resolveLocaleValue(tm('projects.list'))
  const entries = normalizeProjectEntries(localized)

  return entries
    .map((entry) => {
      const id =
        typeof entry.id === 'string' && entry.id.length > 0
          ? entry.id
          : typeof entry.title === 'string' && entry.title.length > 0
            ? entry.title
            : null
      const title = typeof entry.title === 'string' && entry.title.length > 0 ? entry.title : null
      const description =
        typeof entry.description === 'string' && entry.description.length > 0 ? entry.description : null
      const image = typeof entry.image === 'string' && entry.image.length > 0 ? entry.image : null
      const link = typeof entry.link === 'string' && entry.link.length > 0 ? entry.link : null
      const codeLink =
        typeof entry.codeLink === 'string' && entry.codeLink.length > 0 ? entry.codeLink : undefined
      const category = isProjectCategory(entry.category) ? entry.category : null

      if (!id || !title || !description || !image || !link || !category) {
        return null
      }

      const tags = Array.isArray(entry.tags)
        ? entry.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
        : []

      return {
        id,
        title,
        description,
        image,
        link,
        codeLink,
        category,
        tags
      }
    })
    .filter((project): project is Project => Boolean(project))
})

const categoryFilters = computed(() =>
  categoryFilterMeta.map((filter) => ({
    ...filter,
    label: t(`projects.filters.categories.${filter.key}`)
  }))
)

const searchQuery = ref('')
const activeCategory = ref<CategoryFilter>('all')
const activeTags = ref<string[]>([])
const tagMenuOpen = ref(false)
const tagSearchQuery = ref('')

const availableTags = computed(() => {
  const tags = new Set<string>()
  projects.value.forEach((project) => {
    project.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort((a, b) => a.localeCompare(b))
})

const filteredTagOptions = computed(() => {
  const query = tagSearchQuery.value.trim().toLowerCase()
  if (query.length === 0) return availableTags.value
  return availableTags.value.filter((tag) => tag.toLowerCase().includes(query))
})

const hasActiveFilters = computed(
  () => activeCategory.value !== 'all' || activeTags.value.length > 0 || searchQuery.value.trim().length > 0
)

const spring = {
  type: 'spring',
  stiffness: 120,
  damping: 24
} as const

const motionInitial = {
  opacity: 0,
  y: 22
} as const

const motionVisible = (delay: number) => ({
  opacity: 1,
  y: 0,
  transition: {
    ...spring,
    delay
  }
})

const projectDelays = {
  container: 0.08,
  filters: 0.24,
  grid: 0.4
}

const filteredProjects = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return projects.value.filter((project) => {
    const matchesCategory = activeCategory.value === 'all' || project.category === activeCategory.value
    const matchesTags =
      activeTags.value.length === 0 || activeTags.value.every((tag) => project.tags.includes(tag))
    const haystack = `${project.title} ${project.description} ${project.tags.join(' ')}`.toLowerCase()
    const matchesQuery = query.length === 0 || haystack.includes(query)

    return matchesCategory && matchesTags && matchesQuery
  })
})

const closeTagMenu = () => {
  tagMenuOpen.value = false
  tagSearchQuery.value = ''
}

const clearTagFilters = () => {
  activeTags.value = []
}

const clearFilters = () => {
  searchQuery.value = ''
  activeCategory.value = 'all'
  clearTagFilters()
  closeTagMenu()
}
</script>

<style scoped>
.empty-state-kitty {
  animation: empty-kitty-bob 10s ease-in-out infinite;
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

.empty-state-kitty:hover {
  animation-play-state: paused;
  transform: translate3d(0, -5px, 0) rotate(2deg) scale(1.02);
  filter:
    drop-shadow(0 0 14px rgba(126, 78, 255, 0.35))
    drop-shadow(0 0 22px rgba(16, 185, 129, 0.25))
    drop-shadow(0 0 36px rgba(126, 78, 255, 0.24));
}

.empty-state-kitty::after {
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

.empty-state-kitty:hover::after {
  opacity: 0.75;
}

@keyframes empty-kitty-bob {
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

@media (prefers-reduced-motion: reduce) {
  .empty-state-kitty {
    animation: none;
  }
}
</style>
