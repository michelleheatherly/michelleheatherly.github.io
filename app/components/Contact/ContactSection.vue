<template>
  <section id="contact" class="relative transition-colors duration-300">
    <UContainer class="py-24">
      <div
        class="relative overflow-hidden"
        v-motion
        :initial="motionInitial"
        :visibleOnce="motionVisible(contactDelays.container)"
      >
        <div class="relative grid gap-10 px-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <ContactCollabPanel
              :headline="t('contact.headline')"
              :description="t('contact.description')"
            />
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

const spring = {
  type: 'spring',
  stiffness: 110,
  damping: 24
} as const

const motionInitial = {
  opacity: 0,
  y: 48,
  scale: 0.95
} as const

const motionVisible = (delay: number) => ({
  opacity: 1,
  y: 0,
  scale: 1,
  transition: {
    ...spring,
    delay
  }
})

const contactDelays = {
  container: 0.12
}
</script>