<template>
  <div class="relative space-y-6">
    <span
      v-if="badgeText"
      class="inline-flex items-center gap-2 rounded-full border px-4 py-1
             text-xs font-semibold uppercase tracking-[0.28em] transition-colors duration-300"
    >
      <UIcon name="i-heroicons-users-20-solid" class="h-4 w-4" />
      {{ badgeText }}
    </span>

    <div class="space-y-4">
      <h2 class="text-2xl font-bold text-zinc-900 transition-colors duration-300 md:text-3xl dark:text-white">
        {{ headline }}
      </h2>
      <p class="text-zinc-600 transition-colors duration-300 dark:text-white/70">
        {{ description }}
      </p>
    </div>

    <div class="grid gap-3 pt-2 sm:grid-cols-2">
      <slot name="actions">
        <template v-for="link in contactActions" :key="link.label">
          <UButton
            :to="link.href"
            :target="link.target"
            :rel="link.target ? 'noreferrer' : undefined"
            variant="soft"
            color="neutral"
            class="rounded-lg border transition-colors duration-300 bg-transparent"
            :class="enableHoverButtons ? 'group' : ''"
          >
            <UIcon
              :name="link.icon"
              class="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-12"
            />
            <span>{{ link.label }}</span>
          </UButton>
        </template>

        <UButton
          to="#projects"
          variant="soft"
          color="neutral"
          class="rounded-lg border transition-colors duration-300 bg-transparent"
          :class="enableHoverButtons ? 'group' : ''"
        >
          <UIcon
            name="i-heroicons-bolt-20-solid"
            class="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-12"
          />
          <span>{{ t('contact.actions.projects') }}</span>
        </UButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize, useMediaQuery } from '@vueuse/core'

const props = defineProps<{
  badge?: string
  headline: string
  description: string
}>()

const { t } = useI18n()

const headline = computed(() => props.headline)
const description = computed(() => props.description)

const badgeText = computed(() => props.badge ?? t('contact.badge'))

const socialLinks = useSocialLinks()

const CONTACT_ORDER = ['email', 'github', 'linkedin'] as const

const contactActions = computed(() => {
  const linksByKey = new Map<string, Record<string, unknown>>()

  socialLinks.value.forEach((link) => {
    const key = String((link as Record<string, unknown>).key ?? '').toLowerCase()
    if (key) {
      linksByKey.set(key, link as Record<string, unknown>)
    }
  })

  return CONTACT_ORDER
    .map((key) => linksByKey.get(key))
    .filter(Boolean)
    .map((link) => {
      const href = String(link!.href ?? '')
      return {
        label: String(link!.label ?? ''),
        icon: String(link!.icon ?? ''),
        href,
        target: href.startsWith('http') ? '_blank' : undefined
      }
    })
})

const { width } = useWindowSize()
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

const hasMounted = ref(false)
onMounted(() => {
  hasMounted.value = true
})

const enableHoverButtons = computed(
  () => hasMounted.value && width.value >= 1024 && canHover.value
)
</script>