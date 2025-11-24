<template>
  <div
    class="pointer-events-none fixed inset-0 -z-10 min-h-screen overflow-hidden select-none transition-colors duration-500 parallax-root"
    aria-hidden="true"
  >
    <!-- Conic gradient wash (always shown) -->
    <div
      class="absolute -inset-40 blur-3xl opacity-60 md:opacity-70
             transition-opacity duration-500 will-change-transform
             mix-blend-multiply dark:mix-blend-normal parallax-conic"
      :style="{ transform: layer1Transform }"
    />

    <!-- Desktop-only parallax content -->
    <template v-if="!isMobile">
      <!-- Nebula starfield -->
      <div
        class="absolute -top-[150vh] -bottom-[100vh] -left-24 -right-24 opacity-90 dark:opacity-10
               transition-opacity duration-500 will-change-transform mix-blend-multiply dark:mix-blend-screen parallax-nebula"
        :style="{
          transform: layer1Transform,
          backgroundPosition: layer1BgPos
        }"
      />

      <!-- Orbit arcs -->
      <svg
        v-for="(offset, idx) in layer2Offsets"
        :key="`orbit-${idx}`"
        class="absolute inset-0 opacity-55 dark:opacity-45 transition-opacity duration-500 will-change-transform
               mix-blend-multiply dark:mix-blend-luminosity"
        :style="{ transform: `translateY(${offset.toFixed(2)}px)` }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="orbitStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--orbit-stroke-start)" />
            <stop offset="45%" stop-color="var(--orbit-stroke-mid)" />
            <stop offset="100%" stop-color="var(--orbit-stroke-end)" />
          </linearGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="var(--node-glow-inner)" />
            <stop offset="100%" stop-color="var(--node-glow-outer)" />
          </radialGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#softGlow)" stroke="url(#orbitStroke)" stroke-width="1.6" fill="none" stroke-linecap="round">
          <path d="M -120 190 Q 320 40 860 200" opacity="0.55" />
          <path d="M -100 330 Q 340 270 840 360" opacity="0.65" stroke-dasharray="8 14" />
          <path d="M -80 480 Q 420 560 820 400" opacity="0.45" />
        </g>
        <g fill="url(#nodeGlow)" opacity="0.85">
          <circle cx="140" cy="180" r="16" />
          <circle cx="520" cy="120" r="20" />
          <circle cx="680" cy="340" r="14" />
          <circle cx="320" cy="420" r="18" />
        </g>
      </svg>

      <!-- Floating facets -->
      <div
        v-for="(offset, idx) in layer3Offsets"
        :key="`facet-primary-${idx}`"
        class="absolute left-[58%] top-[16%] w-[30vw] max-w-[420px] aspect-[4/3] rounded-[35%]
               opacity-35 dark:opacity-45 transition-opacity duration-500 will-change-transform
               mix-blend-multiply dark:mix-blend-luminosity parallax-facet-primary"
        :style="{ transform: `translateY(${offset.toFixed(2)}px) rotate(12deg)` }"
      />
      <div
        v-for="(offset, idx) in layer4Offsets"
        :key="`facet-secondary-${idx}`"
        class="absolute right-[62%] bottom-[12%] w-[36vw] max-w-[460px] aspect-square rounded-[40%]
               opacity-30 dark:opacity-40 transition-opacity duration-500 will-change-transform
               mix-blend-multiply dark:mix-blend-luminosity parallax-facet-secondary"
        :style="{ transform: `translateY(${offset.toFixed(2)}px) rotate(-18deg)` }"
      />

      <!-- Glow blobs -->
      <div
        v-for="(offset, idx) in layer3Offsets"
        :key="`glow-primary-${idx}`"
        class="absolute top-[-20%] left-[10%] w-[50vw] h-[50vw] rounded-full blur-[100px]
               opacity-45 dark:opacity-55 transition-opacity duration-500 will-change-transform
               mix-blend-multiply dark:mix-blend-normal parallax-glow-primary"
        :style="{ transform: `translateY(${offset.toFixed(2)}px)` }"
      />
      <div
        v-for="(offset, idx) in layer2Offsets"
        :key="`glow-secondary-${idx}`"
        class="absolute bottom-[-20%] right-[5%] w-[55vw] h-[55vw] rounded-full blur-[120px]
               opacity-45 dark:opacity-55 transition-opacity duration-500 will-change-transform
               mix-blend-multiply dark:mix-blend-normal parallax-glow-secondary"
        :style="{ transform: `translateY(${offset.toFixed(2)}px)` }"
      />
    </template>

    <!-- Subtle vignette (always shown) -->
    <div
      class="absolute inset-0 pointer-events-none transition-opacity duration-500
             opacity-20 dark:opacity-10 parallax-vignette"
    />
  </div>
</template>

<script setup lang="ts">
import { useScroll, usePreferredReducedMotion, useWindowSize, useMediaQuery } from '@vueuse/core'

const prefersReduced = usePreferredReducedMotion()
const { height: viewportHeight, width } = useWindowSize()
const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)')

const isMobileViewport = computed(() => width.value < 1024)
const isMobile = computed(() => isMobileViewport.value || isTouch.value)

const enableParallax = computed(
  () => !isMobile.value && prefersReduced.value !== 'reduce'
)

const y = ref(0)

if (import.meta.client) {
  const { y: scrollY } = useScroll(window)
  watchEffect(() => {
    y.value = scrollY.value
  })
}

const k = computed(() => (enableParallax.value ? 1 : 0))

const NEBULA_FALLBACK_SPAN = 1200
const loopSpan = computed(() => {
  const view = viewportHeight.value || 0
  if (!view) {
    return NEBULA_FALLBACK_SPAN
  }
  return Math.max(view * 1.5, NEBULA_FALLBACK_SPAN)
})

type LoopState = {
  raw: number
  base: number
  span: number
  offsets: number[]
}

const makeLoopState = (factor: number) =>
  computed<LoopState>(() => {
    if (k.value === 0) {
      return { raw: 0, base: 0, span: 0, offsets: [0] }
    }
    const span = loopSpan.value
    const raw = y.value * factor * k.value
    if (!span || !Number.isFinite(span)) {
      return { raw, base: raw, span: span || 0, offsets: [raw] }
    }
    const base = ((raw % span) + span) % span
    return {
      raw,
      base,
      span,
      offsets: [base - span, base, base + span]
    }
  })

const layer1Loop = makeLoopState(0.10)
const layer2Loop = makeLoopState(0.20)
const layer3Loop = makeLoopState(0.35)
const layer4Loop = makeLoopState(0.50)

const layer1Transform = computed(() =>
  k.value === 0 ? 'translateY(0px)' : `translateY(${layer1Loop.value.base.toFixed(2)}px)`
)

const layer1BgPos = computed(() => {
  if (k.value === 0) {
    return 'center 50%'
  }
  const shift = (y.value * 0.08 * k.value).toFixed(2)
  return `center calc(50% + ${shift}px)`
})

const layer2Offsets = computed(() => layer2Loop.value.offsets)
const layer3Offsets = computed(() => layer3Loop.value.offsets)
const layer4Offsets = computed(() => layer4Loop.value.offsets)
</script>

<style scoped>
.parallax-root {
  background-color: var(--page-bg);
}

.parallax-conic {
  background: conic-gradient(
    from 220deg at 50% 50%,
    var(--conic-a),
    transparent 25%,
    var(--conic-b),
    transparent 60%
  );
}

.parallax-nebula {
  background-image:
    linear-gradient(
      to bottom,
      rgba(15, 23, 42, 0.2) 0%,
      rgba(15, 23, 42, 0.12) 24%,
      transparent 58%,
      rgba(15, 23, 42, 0.28) 100%
    ),
    radial-gradient(circle at 12% 16%, rgba(99, 102, 241, 0.42) 0, transparent 46%),
    radial-gradient(circle at 84% 18%, rgba(129, 140, 248, 0.36) 0, transparent 48%),
    radial-gradient(circle at 66% 78%, rgba(56, 189, 248, 0.32) 0, transparent 58%),
    radial-gradient(circle at 20% 80%, rgba(96, 165, 250, 0.3) 0, transparent 62%),
    radial-gradient(circle at 52% 54%, rgba(236, 254, 255, 0.25) 0, transparent 48%),
    radial-gradient(circle at 36% 38%, rgba(226, 232, 240, 0.22) 0, transparent 44%);
  background-size: 150% 190%;
  background-repeat: repeat-y;
  filter: saturate(1.05) contrast(1.05);
}

.parallax-facet-primary {
  background: linear-gradient(140deg, var(--facet-primary), transparent 70%);
  border: 1px solid var(--facet-primary-border);
  box-shadow: 0 0 120px var(--facet-primary-shadow);
}

.parallax-facet-secondary {
  background: linear-gradient(200deg, var(--facet-secondary), transparent 60%);
  border: 1px solid var(--facet-secondary-border);
  box-shadow: 0 0 140px var(--facet-secondary-shadow);
}

.parallax-glow-primary {
  background: radial-gradient(circle at 30% 30%, var(--glow-purple), transparent 60%);
}

.parallax-glow-secondary {
  background: radial-gradient(circle at 60% 60%, var(--glow-green), transparent 60%);
}

.parallax-vignette {
  background: radial-gradient(120% 120% at 50% 10%, transparent 35%, rgba(0, 0, 0, 0.35) 100%);
}
</style>