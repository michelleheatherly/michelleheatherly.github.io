<template>
  <footer
    ref="footerRef"
    class="relative overflow-hidden border-t border-black/10 py-16 transition-colors duration-700 bg-gradient-to-t from-[#f5f3ff] via-[#e4d8ff] to-[#c7b5ff] dark:border-white/10 dark:bg-gradient-to-t dark:from-[#241358] dark:via-[#3b1882] dark:to-[#5523a7]"
  >
    <div
      aria-hidden="true"
      class="absolute inset-0 z-0 opacity-90 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.65),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.4),transparent_55%)] dark:opacity-0 dark:bg-transparent"
    />
    <UContainer
      class="relative z-10 text-center text-zinc-600 transition-colors duration-300 text-sm dark:text-white/60"
    >
      <div
        class="relative z-10 grid gap-10 text-left lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12"
      >
        <section class="flex flex-col gap-6">
          <div class="inline-flex items-center gap-3">
            <span
              class="h-3 w-3 animate-ping-slow rounded-full bg-[#4ade80] shadow-[0_0_18px_rgba(34,197,94,0.85)]"
            />
            <span
              class="text-xs uppercase tracking-[0.4em] text-zinc-500 dark:text-white/40"
            >
              {{ t('footer.badge') }}
            </span>
          </div>

          <div class="space-y-2">
            <p
              class="text-lg font-semibold uppercase tracking-widest text-zinc-500 dark:text-white/50"
            >
              {{ siteName }}
            </p>
            <h2
              class="text-3xl font-bold text-zinc-900 transition-colors duration-300 dark:text-white"
            >
              {{ t('footer.headline') }}
            </h2>
            <p
              class="max-w-xl text-sm leading-relaxed text-zinc-600 transition-colors duration-300 dark:text-white/60"
            >
              {{ siteDescription }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-4">
            <NuxtLink
              v-for="link in socialLinks"
              :key="link.label"
              :aria-label="t('footer.social.visit', { label: link.label })"
              class="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white/50 text-zinc-500 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-cyber-purple/60 hover:bg-cyber-purple/10 hover:text-cyber-purple/90 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:border-cyber-purple/60 dark:hover:bg-cyber-purple/15 dark:hover:text-cyber-purple"
              :href="link.href"
              target="_blank"
              rel="noreferrer"
            >
              <span
                class="absolute inset-0 translate-y-full bg-gradient-to-br from-cyber-purple/25 to-cyber-purple/5 transition-transform duration-500 group-hover:translate-y-0"
              />
              <UIcon
                :name="link.icon"
                class="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]"
              />
            </NuxtLink>
          </div>
        </section>

       <section
          class="relative z-10 grid gap-6 items-start lg:grid-cols-[auto_minmax(0,1fr)] 
                lg:gap-8 lg:pl-4 xl:pl-8"
        >
           <NuxtImg 
              src="/celestial-kitty.png"
              width="400"
              height="400"
              alt="Celestial kitty illustration"
              class="h-40 w-auto object-contain sm:h-48 lg:h-56 self-start floaty-kitty"
              format="webp"
              loading="lazy"
              decoding="async"
            />

          <div class="grid gap-8 w-full max-w-xs lg:max-w-sm">
            <div
              v-for="column in footerColumns"
              :key="column.title"
              class="relative flex flex-col gap-4 group/column"
            >
              <div class="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                <span
                  class="h-2 w-2 mt-1 animate-ping-slow rounded-full bg-[#4ade80] shadow-[0_0_12px_rgba(34,197,94,0.75)] transition-transform duration-300 group-hover/column:scale-125"
                />
                <div class="space-y-3">
                  <header>
                    <h3
                      class="text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500 transition-colors duration-300 dark:text-white/40"
                    >
                      {{ column.title }}
                    </h3>
                  </header>
                  <ul
                    class="space-y-2 text-sm text-zinc-600 transition-colors duration-300 dark:text-white/60"
                  >
                    <template v-if="column.type === 'links'">
                      <li v-for="item in column.links" :key="item.label">
                        <NuxtLink
                          :href="item.href"
                          class="group relative inline-flex items-center gap-2 rounded-full py-1 text-zinc-600 transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple/40 dark:text-white/60"
                        >
                          <span
                            class="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-black opacity-0 transition-all duration-300 ease-out dark:bg-white/90
                                  group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100"
                          />
                          <span class="relative">
                            {{ item.label }}
                          </span>
                          <UIcon
                            name="i-heroicons-arrow-up-right-16-solid"
                            class="h-4 w-4 -translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                          />
                        </NuxtLink>
                      </li>
                    </template>
                    <li
                      v-else
                      v-for="highlight in column.highlights"
                      :key="highlight"
                      class="text-zinc-500 dark:text-white/50"
                    >
                      {{ highlight }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div
        class="relative z-10 mt-12 flex flex-col items-center gap-4 border-t border-zinc-300/70 pt-6 text-xs text-zinc-500 transition-colors duration-300 dark:border-white/10 dark:text-white/40 sm:flex-row sm:justify-between"
      >
        <span class="flex items-center gap-2">
          <span>
            {{ t('footer.bottom.crafted', { year: currentYear, site: siteName }) }}
          </span>
        </span>
        <span class="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </span>
      </div>
    </UContainer>

    <ClientOnly>
      <ScrollToTop :footer-visible="footerVisible" />
    </ClientOnly>
  </footer>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const footerRef = ref<HTMLElement | null>(null)
const footerVisible = useState<boolean>('footer-visible', () => false)
const FOOTER_VISIBILITY_RATIO = 0.6
const currentYear = new Date().getFullYear()

const navItemsMeta = [
  { key: 'home', href: '#home' },
  { key: 'about', href: '#about' },
  { key: 'education', href: '#education' },
  { key: 'skills', href: '#skills' },
  { key: 'projects', href: '#projects' },
  { key: 'blog', href: '#blog' },
  { key: 'contact', href: '#contact' }

] as const

const { t } = useI18n()

const siteName = computed(() => t('footer.siteName'))
const siteDescription = computed(() => t('footer.description'))

const primarySections = computed(() =>
  navItemsMeta.map((item) => ({
    label: t(`footer.columns.navigate.items.${item.key}`),
    href: item.href
  }))
)

const socialLinks = useSocialLinks()

const footerColumns = computed(() => [
  {
    title: t('footer.columns.navigate.title'),
    links: primarySections.value,
    type: 'links' as const
  }
])

if (import.meta.client) {
  useIntersectionObserver(
    footerRef,
    ([entry]) => {
      if (!entry) {
        footerVisible.value = false
        return
      }

      const ratio = entry.intersectionRatio ?? 0
      footerVisible.value = entry.isIntersecting && ratio >= FOOTER_VISIBILITY_RATIO
    },
    {
      threshold: Array.from({ length: 11 }, (_, index) => index / 10),
      rootMargin: '0px 0px -40px 0px'
    }
  )
}
</script>


<style scoped>
.animate-ping-slow {
  animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  75% {
    transform: scale(1.4);
    opacity: 0;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.floaty-kitty {
  animation: floaty-kitty-bob 10s ease-in-out infinite;
  transform-origin: center bottom;
  will-change: transform;
  position: relative;

  /* Soft, diffused glow */
  filter:
    drop-shadow(0 0 10px rgba(155, 92, 255, 0.25))  /* cyber-purple */
    drop-shadow(0 0 18px rgba(23, 157, 104, 0.18))  /* cyber-green */
    drop-shadow(0 0 30px rgba(155, 92, 255, 0.15));

  transition:
    transform 300ms ease,
    filter 300ms ease;
}

.floaty-kitty:hover {
  animation-play-state: paused;
  transform: translate3d(0, -6px, 0) rotate(4deg) scale(1.03);
  filter:
    drop-shadow(0 0 14px rgba(155, 92, 255, 0.32))
    drop-shadow(0 0 24px rgba(23, 157, 104, 0.22))
    drop-shadow(0 0 40px rgba(155, 92, 255, 0.20));
}

.floaty-kitty::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;

  background: radial-gradient(
    circle,
    rgba(155, 92, 255, 0.15) 0%,   /* cyber-purple */
    rgba(23, 157, 104, 0.08) 40%,  /* cyber-green */
    transparent 75%
  );

  filter: blur(20px);
  transform: scale(1.3);
  opacity: 0.6;
  transition: opacity 300ms ease;
}

.floaty-kitty:hover::after {
  opacity: 0.75;
}

@keyframes floaty-kitty-bob {
  0% {
    transform: translate3d(0, 0, 0) rotate(-2deg);
  }
  25% {
    transform: translate3d(0, -8px, 0) rotate(1deg);
  }
  50% {
    transform: translate3d(0, -4px, 0) rotate(3deg);
  }
  75% {
    transform: translate3d(0, -10px, 0) rotate(0deg);
  }
  100% {
    transform: translate3d(0, 0, 0) rotate(-2deg);
  }
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  .floaty-kitty {
    animation: none;
    transform: none;
    filter: none;
  }
}
</style>
