<template>
  <section id="contact" class="relative transition-colors duration-300">
    <UContainer class="py-24">
      <div class="relative overflow-hidden">
        <div class="relative grid gap-10 px-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div
            v-motion
            :initial="motionInitial"
            :visibleOnce="motionVisible(contactDelays.collab)"
          >
            <ContactCollabPanel
              :headline="t('contact.headline')"
              :description="t('contact.description')"
            />
          </div>

          <div
            v-motion
            :initial="motionInitialForm"
            :visibleOnce="motionVisible(contactDelays.form)"
          >
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
  stiffness: 140,
  damping: 22
} as const

const motionInitial = {
  opacity: 0,
  y: 18
} as const

const motionInitialForm = {
  opacity: 0,
  y: 18,
  x: 12,
  scale: 0.97
} as const

const motionVisible = (delay: number) => ({
  opacity: 1,
  y: 0,
  x: 0,
  scale: 1,
  transition: {
    ...spring,
    delay
  }
})

const contactDelays = {
  collab: 0.02,
  form: 0.12
}
</script>
