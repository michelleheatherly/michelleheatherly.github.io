<template>
  <UButton
    color="neutral"
    variant="ghost"
    size="sm"
    class="rounded-full font-semibold tracking-wide border border-transparent bg-transparent hover:border-neutral-500/70 focus-visible:border-neutral-500/70 hover:bg-transparent hover:cursor-pointer transition duration-300 text-zinc-900 dark:text-zinc-100"
    :aria-label="buttonLabel"
    @click="toggleLocale"
  >
    {{ buttonText }}
  </UButton>
</template>

<script setup lang="ts">
const { locale, setLocale, t } = useI18n()

const supportedLocales = ['en', 'de'] as const
type SupportedLocale = (typeof supportedLocales)[number]

const nextLocale = computed<SupportedLocale>(() => {
  const current = locale.value as SupportedLocale
  return current === 'en' ? 'de' : 'en'
})

const buttonLabel = computed(() =>
  t('language.switch', { language: t(`common.languages.${nextLocale.value}`) })
)

const buttonText = computed(() => t(`common.localeLabel.${locale.value}`))

async function toggleLocale() {
  await setLocale(nextLocale.value)
}
</script>
