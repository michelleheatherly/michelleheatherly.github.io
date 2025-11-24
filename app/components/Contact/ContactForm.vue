<template>
  <form
    ref="formRef"
    class="group/contact relative overflow-hidden rounded-2xl border border-black/10 bg-white/95 p-6 shadow-[0_45px_85px_-45px_rgba(14,20,48,0.55)] backdrop-blur-2xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/70 md:p-8"
    @submit.prevent="handleSubmit"
    @pointermove="updateSpotlight"
    @pointerleave="resetSpotlight"
    @pointercancel="resetSpotlight"
    :aria-busy="isSubmitting"
  >
    <input type="hidden" name="access_key" :value="apiKey" />
    <input type="hidden" name="subject" :value="t('contact.form.emailSubject')" />

    <div
      v-if="enableHoverEffects"
      class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
      :class="{ 'opacity-100': spotlight.active }"
      :style="spotlightStyle"
    ></div>
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -right-12 -top-24 h-48 w-48 rounded-full bg-gradient-to-br from-cyber-purple/50 via-cyber-green/40 to-transparent blur-3xl"
    ></div>
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -bottom-28 -left-16 h-56 w-56 rounded-full bg-gradient-to-tr from-cyber-green/35 via-sky-400/20 to-transparent blur-3xl"
    ></div>

    <div class="relative z-[1] space-y-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-2">
          <span class="text-xs font-semibold uppercase tracking-[0.45em] text-zinc-500 dark:text-white/40">
            {{ t('contact.form.badge') }}
          </span>
          <h3 class="text-2xl font-semibold text-zinc-900 transition-colors duration-300 dark:text-white">
            {{ t('contact.form.title') }}
          </h3>
          <p class="text-sm text-zinc-600 transition-colors duration-300 dark:text-white/70">
            {{ t('contact.form.description') }}
          </p>
        </div>
        <div class="hidden sm:flex">
          <div
            class="relative h-14 w-14 overflow-hidden rounded-full border border-white/40 bg-gradient-to-br from-cyber-purple/60 via-cyber-green/40 to-teal-300/30 shadow-[0_18px_35px_-18px_rgba(124,58,237,0.65)]"
          >
            <div class="absolute inset-2 rounded-full border border-white/40"></div>
            <div class="absolute inset-0 flex items-center justify-center text-white">
              <UIcon name="i-heroicons-paper-airplane-20-solid" class="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="space-y-2 sm:col-span-1">
          <span class="text-xs font-medium uppercase tracking-wide text-zinc-500 transition-colors duration-300 dark:text-white/50">
            {{ t('contact.form.fields.name.label') }}
          </span>
          <input
            type="text"
            name="name"
            autocomplete="name"
            required
            :placeholder="t('contact.form.fields.name.placeholder')"
            :class="fieldClasses"
          />
        </label>
        <label class="space-y-2 sm:col-span-1">
          <span class="text-xs font-medium uppercase tracking-wide text-zinc-500 transition-colors duration-300 dark:text-white/50">
            {{ t('contact.form.fields.email.label') }}
          </span>
          <input
            type="email"
            name="email"
            autocomplete="email"
            required
            :placeholder="t('contact.form.fields.email.placeholder', { symbol: '@' })"
            :class="fieldClasses"
          />
        </label>
        <label class="space-y-2 sm:col-span-2">
          <span class="text-xs font-medium uppercase tracking-wide text-zinc-500 transition-colors duration-300 dark:text-white/50">
            {{ t('contact.form.fields.notes.label') }}
          </span>
          <textarea
            name="message"
            required
            :placeholder="t('contact.form.fields.notes.placeholder')"
            :class="textareaClasses"
          ></textarea>
        </label>
      </div>

      <div class="space-y-4">
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="status !== 'idle'"
            class="flex flex-col items-center gap-2"
            aria-live="polite"
          >
            <img
              v-if="status === 'success'"
              src="/starfleet-kitty.png"
              width="512"
              height="768"
              alt="Starfleet kitty celebrating success"
              class="h-75 w-75 object-contain"
              :class="kittyClasses"
              loading="lazy"
            />
            <img
              v-else
              src="/starfleet-kitty-error.png"
              width="512"
              height="768"
              alt="Starfleet kitty looking concerned"
              class="h-75 w-75 object-contain"
              :class="kittyClasses"
              loading="lazy"
            />
            <p
              :class="[
                'text-sm font-semibold text-center sm:text-left',
                status === 'success'
                  ? 'text-emerald-600 dark:text-emerald-300'
                  : 'text-red-500 dark:text-red-300'
              ]"
            >
              {{ status === 'success' ? t('contact.form.success') : errorMessage || t('contact.form.error') }}
            </p>
          </div>
        </Transition>

        <div class="flex justify-end">
          <UButton
            v-if="status !== 'success'"
            type="submit"
            size="lg"
            class="group overflow-hidden cursor-pointer w-max justify-center"
            :disabled="isSubmitting"
            :class="{ 'opacity-70 cursor-not-allowed': isSubmitting }"
          >
            <UIcon
              name="i-heroicons-sparkles-20-solid"
              class="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-12"
            />
            <span>
              {{ isSubmitting ? t('contact.form.submitting') : t('contact.form.submit') }}
            </span>
            <span class="relative ml-2 flex h-2 w-2" v-if="!isSubmitting">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
          </UButton>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { usePreferredReducedMotion, useWindowSize, useMediaQuery } from '@vueuse/core'

const formRef = ref<HTMLFormElement | null>(null)
const apiKey = useRuntimeConfig().public.contactApiKey

const prefersReduced = usePreferredReducedMotion()
const { width } = useWindowSize()
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

const isDesktop = computed(() => width.value >= 1024)

const hasMounted = ref(false)
onMounted(() => {
  hasMounted.value = true
})

const enableHoverEffects = computed(
  () =>
    hasMounted.value &&
    isDesktop.value &&
    canHover.value &&
    prefersReduced.value !== 'reduce'
)

const kittyClasses = computed(() =>
  enableHoverEffects.value ? 'contact-kitty' : ''
)

const spotlight = reactive({
  x: 50,
  y: 50,
  active: false
})

const { t } = useI18n()

const isSubmitting = ref(false)
const status = ref<'idle' | 'success' | 'error'>('idle')
const errorMessage = ref('')

const spotlightStyle = computed(() => {
  if (!spotlight.active || prefersReduced.value === 'reduce' || !enableHoverEffects.value) {
    return {
      background:
        'radial-gradient(circle at 50% 50%, rgba(165,180,252,0.16), transparent 60%)'
    }
  }

  return {
    background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(165,180,252,0.28), transparent 60%)`
  }
})

const updateSpotlight = (event: PointerEvent) => {
  if (!formRef.value || prefersReduced.value === 'reduce' || !enableHoverEffects.value) return

  const rect = formRef.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  spotlight.x = Math.min(100, Math.max(0, x))
  spotlight.y = Math.min(100, Math.max(0, y))
  spotlight.active = true
}

const resetSpotlight = () => {
  if (!enableHoverEffects.value) return
  spotlight.active = false
}

const handleSubmit = async () => {
  if (!formRef.value || isSubmitting.value) return

  isSubmitting.value = true
  status.value = 'idle'
  errorMessage.value = ''

  try {
    const formData = new FormData(formRef.value)

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    })

    const result = await response.json()

    if (response.ok && result.success) {
      status.value = 'success'
      formRef.value.reset()
    } else {
      status.value = 'error'
      errorMessage.value = result.message || 'Submission failed.'
    }
  } catch (err: any) {
    status.value = 'error'
    errorMessage.value = err?.message || 'Network error.'
  } finally {
    isSubmitting.value = false
  }
}

const fieldClasses =
  'w-full rounded-xl border border-black/10 bg-white/90 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 backdrop-blur focus:outline-none focus:ring-2 focus:ring-cyber-purple/50 focus:border-transparent focus:shadow-[0_20px_45px_-28px_rgba(148,163,235,0.8)] transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50'
const textareaClasses = fieldClasses + ' min-h-[160px] resize-none align-top'
</script>

<style scoped>
.contact-kitty {
  animation: contact-kitty-bob 10s ease-in-out infinite;
  transform-origin: center bottom;
  will-change: transform;
  position: relative;

  filter:
    drop-shadow(0 0 10px rgba(155, 92, 255, 0.25))
    drop-shadow(0 0 18px rgba(23, 157, 104, 0.18))
    drop-shadow(0 0 30px rgba(155, 92, 255, 0.15));
  transition: transform 300ms ease, filter 300ms ease;
}

.contact-kitty::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(
    circle,
    rgba(155, 92, 255, 0.18) 0%,
    rgba(23, 157, 104, 0.1) 45%,
    transparent 75%
  );
  filter: blur(18px);
  transform: scale(1.25);
  opacity: 0.55;
  transition: opacity 300ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .contact-kitty:hover {
    animation-play-state: paused;
    transform: translate3d(0, -5px, 0) rotate(3deg) scale(1.02);
    filter:
      drop-shadow(0 0 14px rgba(155, 92, 255, 0.32))
      drop-shadow(0 0 24px rgba(23, 157, 104, 0.22))
      drop-shadow(0 0 40px rgba(155, 92, 255, 0.2));
  }

  .contact-kitty:hover::after {
    opacity: 0.75;
  }
}

@keyframes contact-kitty-bob {
  0% {
    transform: translate3d(0, 0, 0) rotate(-1deg);
  }
  25% {
    transform: translate3d(0, -6px, 0) rotate(2deg);
  }
  50% {
    transform: translate3d(0, -3px, 0) rotate(1deg);
  }
  75% {
    transform: translate3d(0, -7px, 0) rotate(0deg);
  }
  100% {
    transform: translate3d(0, 0, 0) rotate(-1deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-kitty {
    animation: none;
    transform: none;
    filter: none;
  }
}
</style>