<template>
  <header
    class="sticky top-0 z-[90] border-b transition-all duration-500 transform-gpu header-surface"
    :class="[
      headerSurfaceClasses,
      shouldHideHeader ? '-translate-y-full opacity-0 pointer-events-none' : 'opacity-100'
    ]"
    :style="headerSurfaceStyles"
  >
    <UContainer class="flex items-center justify-between py-3">
      <NuxtLink
        to="/"
        class="flex items-center gap-3 focus-visible:outline-none"
        @click="handleBrandClick"
      >
        <span
          class="font-semibold tracking-wide text-zinc-900 dark:text-white transition-colors duration-300"
        >
          &lt;{{ brandLabel }} /&gt;
        </span>
      </NuxtLink>

      <nav class="hidden lg:block">
        <ul class="flex gap-6 items-center">
          <li
            v-for="l in navLinks"
            :key="l.to"
          >
            <ULink
              :to="l.to"
              class="relative text-sm transition-colors duration-300
                     text-zinc-700 hover:text-zinc-900
                     dark:text-white/80 dark:hover:text-white
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple/40 rounded-md px-1"
              :class="enableHoverNav ? 'group' : ''"
            >
              {{ l.label }}
              <span
                class="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-black dark:bg-white/90 opacity-0 transition-all duration-300 ease-out
                       group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100"
              />
            </ULink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <button
          type="button"
          class="menu-toggle inline-flex cursor-pointer items-center justify-center lg:hidden transition duration-300
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                 text-zinc-800 dark:text-zinc-100 hover:text-zinc-950 dark:hover:text-white"
          :class="[
            {
              'menu-toggle--bg-open': isMenuOpen,
              'menu-toggle--icon-open': iconOpenState,
              'menu-toggle--closed': !isMenuOpen
            },
            enableHoverNav ? 'menu-toggle--hoverable' : ''
          ]"
          :aria-expanded="isMenuOpen"
          :aria-controls="menuId"
          :aria-label="menuButtonLabel"
          @click="toggleMenu"
        >
          <span class="menu-toggle__line" aria-hidden="true" />
          <span class="menu-toggle__line" aria-hidden="true" />
          <span class="menu-toggle__line" aria-hidden="true" />
        </button>
      </div>
    </UContainer>

    <Teleport to="body">
      <Transition name="menu-overlay">
        <div
          v-if="isMenuOpen"
          class="menu-overlay-surface fixed inset-0 z-[80] flex flex-col lg:hidden"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`${menuId}-title`"
          @click.self="closeMenu"
        >
          <div class="absolute inset-x-0 top-0 z-[95] pointer-events-none">
            <div class="mx-auto flex w-full max-w-7xl justify-end px-6 pt-3">
              <button
                type="button"
                class="menu-toggle inline-flex cursor-pointer items-center justify-center pointer-events-auto transition duration-300
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-purple/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                       text-zinc-800 dark:text-zinc-100 hover:text-zinc-950 dark:hover:text-white"
                :class="[
                  {
                    'menu-toggle--icon-open': iconOpenState,
                    'menu-toggle--closed': !isMenuOpen
                  },
                  enableHoverNav ? 'menu-toggle--hoverable' : ''
                ]"
                :aria-label="t('nav.menu.close')"
                @click.stop="closeMenu"
              >
                <span class="menu-toggle__line" aria-hidden="true" />
                <span class="menu-toggle__line" aria-hidden="true" />
                <span class="menu-toggle__line" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            class="menu-ripple"
            :class="{ 'menu-ripple--active': allowMenuRipple }"
            :style="rippleStyle"
          />

          <div class="relative z-10 flex h-full flex-col items-center justify-center gap-10 px-8 text-center">
            <nav :id="menuId">
              <ul class="space-y-6">
                <li
                  v-for="l in navLinks"
                  :key="l.to"
                >
                  <ULink
                    :to="l.to"
                    class="menu-link relative inline-block transform-gpu text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white/90 transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-cyber-purple/50 focus-visible:outline-none"
                    :class="menuLinkHoverClasses"
                    @click="handleMobileNavigate"
                  >
                    <span
                      class="pointer-events-none absolute inset-x-0 -bottom-8 -z-10 h-16 transform-gpu scale-95 rounded-full bg-cyber-purple/25 blur-[60px] opacity-0 transition-all duration-500 ease-out
                             group-hover:opacity-80 group-hover:scale-110 group-focus-visible:opacity-80 group-focus-visible:scale-110"
                    />
                    {{ l.label }}
                    <span
                      class="pointer-events-none absolute -bottom-2 left-0 block h-0.5 w-full origin-left scale-x-0 rounded-full bg-zinc-900 transition-all duration-500 ease-out
                             opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100 dark:bg-white"
                    />
                  </ULink>
                </li>
              </ul>
            </nav>

            <div class="flex flex-col items-center gap-4">
              <div class="flex items-center justify-center gap-4">
                <NuxtLink
                  v-for="link in socialLinks"
                  :key="link.label"
                  :aria-label="t('footer.social.visit', { label: link.label })"
                  class="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-black/10 text-zinc-500 transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                  :class="menuSocialHoverClasses"
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

              <div class="flex items-center justify-center gap-3">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import {
  useWindowScroll,
  usePreferredReducedMotion,
  useWindowSize,
  useEventListener,
  useMediaQuery
} from '@vueuse/core'

const { t } = useI18n()

const navLinkDefs = [
  { key: 'home', to: '#home' },
  { key: 'about', to: '#about' },
  { key: 'education', to: '#education' },
  { key: 'skills', to: '#skills' },
  { key: 'projects', to: '#projects' },
  { key: 'blog', to: '#blog' },
  { key: 'contact', to: '#contact' }
] as const

const socialLinks = useSocialLinks()

const prefersReduced = usePreferredReducedMotion()
const { y } = useWindowScroll()
const { width } = useWindowSize()
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

const footerVisible = useState<boolean>('footer-visible', () => false)
const isMenuOpen = ref(false)
const iconOpenState = ref(false)
const rippleOrigin = ref({ x: 0, y: 0 })
const menuId = 'site-navigation'

let openTimeout: number | undefined

const navLinks = computed(() =>
  navLinkDefs.map((link) => ({
    ...link,
    label: t(`nav.links.${link.key}`)
  }))
)
const brandLabel = computed(() => t('nav.brand'))

const menuButtonLabel = computed(() =>
  isMenuOpen.value ? t('nav.menu.close') : t('nav.menu.open')
)

const glassProgress = computed(() => {
  if (isMenuOpen.value) {
    return 1
  }

  const start = 70
  const range = 110
  const progress = (y.value - start) / range
  return Math.min(Math.max(progress, 0), 1)
})

const showElevation = computed(
  () => y.value > 150 && !footerVisible.value && !isMenuOpen.value
)

const headerSurfaceClasses = computed(() =>
  showElevation.value ? 'shadow-[0_18px_34px_-28px_rgba(124,58,237,0.55)]' : ''
)

const headerSurfaceStyles = computed(() => {
  const eased = glassProgress.value === 0 ? 0 : Math.pow(glassProgress.value, 1.12)
  const lightBgOpacity = (0.28 * eased).toFixed(3)
  const darkBgOpacity = (0.1 * eased).toFixed(3)
  const lightBorderOpacity = (0.028 * eased).toFixed(3)
  const darkBorderOpacity = (0.028 * eased).toFixed(3)
  const blurStrength = (eased * 12).toFixed(1)

  return {
    '--header-bg-opacity-light': lightBgOpacity,
    '--header-bg-opacity-dark': darkBgOpacity,
    '--header-border-opacity-light': lightBorderOpacity,
    '--header-border-opacity-dark': darkBorderOpacity,
    backdropFilter: `blur(${blurStrength}px)`,
    WebkitBackdropFilter: `blur(${blurStrength}px)`
  }
})

const shouldHideHeader = computed(
  () => footerVisible.value && !isMenuOpen.value
)

const allowMenuRipple = computed(
  () => prefersReduced.value !== 'reduce'
)

const rippleStyle = computed(() => ({
  '--ripple-x': `${rippleOrigin.value.x}px`,
  '--ripple-y': `${rippleOrigin.value.y}px`
}))

const hasMounted = ref(false)
onMounted(() => {
  hasMounted.value = true
})

const isDesktop = computed(() => width.value >= 1024)

const enableHoverNav = computed(
  () =>
    hasMounted.value &&
    isDesktop.value &&
    canHover.value &&
    prefersReduced.value !== 'reduce'
)

const menuLinkHoverClasses = computed(() =>
  enableHoverNav.value
    ? 'group hover:text-zinc-900 dark:hover:text-white hover:drop-shadow-[0_0_25px_rgba(43,245,160,0.45)] focus-visible:text-zinc-900 dark:focus-visible:text-white focus-visible:drop-shadow-[0_0_25px_rgba(43,245,160,0.45)]'
    : ''
)

const menuSocialHoverClasses = computed(() =>
  enableHoverNav.value
    ? 'group hover:-translate-y-1 hover:scale-105 hover:border-cyber-purple/60 hover:bg-cyber-purple/10 hover:text-cyber-purple/90 dark:hover:border-cyber-purple/60 dark:hover:bg-cyber-purple/15 dark:hover:text-cyber-purple'
    : ''
)

function openMenu(event?: MouseEvent) {
  iconOpenState.value = true

  if (import.meta.client) {
    if (event) {
      rippleOrigin.value = { x: event.clientX, y: event.clientY }
    } else {
      rippleOrigin.value = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }
    }

    if (openTimeout) {
      clearTimeout(openTimeout)
    }

    openTimeout = window.setTimeout(
      () => {
        isMenuOpen.value = true
      },
      prefersReduced.value === 'reduce' ? 0 : 160
    )
  } else {
    isMenuOpen.value = true
  }
}

function closeMenu() {
  iconOpenState.value = false

  if (import.meta.client && openTimeout) {
    clearTimeout(openTimeout)
    openTimeout = undefined
  }

  isMenuOpen.value = false
}

function toggleMenu(event?: MouseEvent) {
  if (!isMenuOpen.value) {
    openMenu(event)
  } else {
    closeMenu()
  }
}

function handleMobileNavigate() {
  closeMenu()
}

function handleBrandClick() {
  closeMenu()
}

if (import.meta.client) {
  watch(isMenuOpen, (open) => {
    document.body.classList.toggle('overflow-hidden', open)
  })

  const LG_BREAKPOINT = 1024

  watch(width, (value) => {
    if (isMenuOpen.value && value >= LG_BREAKPOINT) {
      closeMenu()
    }
  })
}

let removeEscapeListener: (() => void) | undefined

if (import.meta.client) {
  removeEscapeListener = useEventListener(document, 'keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeMenu()
    }
  })
}

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.classList.remove('overflow-hidden')
    if (openTimeout) {
      clearTimeout(openTimeout)
    }
  }

  removeEscapeListener?.()
})
</script>

<style scoped>
.header-surface {
  --header-bg-rgb: 248, 248, 255;
  --header-border-rgb: 113, 113, 122;
  --header-bg-opacity: var(--header-bg-opacity-light);
  --header-border-opacity: var(--header-border-opacity-light);
  --header-bg-opacity-light: 0;
  --header-bg-opacity-dark: 0;
  --header-border-opacity-light: 0;
  --header-border-opacity-dark: 0;
  border-color: rgba(var(--header-border-rgb), var(--header-border-opacity));
  transition: background-color 0.35s ease, border-color 0.35s ease;
}

:global(.dark) .header-surface {
  --header-bg-rgb: 14, 14, 18;
  --header-border-rgb: 226, 232, 240;
  --header-bg-opacity: var(--header-bg-opacity-dark);
  --header-border-opacity: var(--header-border-opacity-dark);
}

.menu-overlay-enter-active,
.menu-overlay-leave-active {
  transition: opacity 0.32s ease;
}

.menu-overlay-enter-from,
.menu-overlay-leave-to {
  opacity: 0;
}

.menu-overlay-surface {
  background: var(--menu-overlay-bg);
  transition: background 0.35s ease;
}

.menu-toggle {
  position: relative;
  z-index: 90;
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  border: 1px solid transparent;
  background-color: transparent;
  color: currentColor;
  overflow: hidden;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.25s ease;
}

.menu-toggle--hoverable {
  transition: transform 0.3s ease;
}

.menu-toggle--hoverable:hover {
  transform: translateY(-2px) rotate(6deg);
}

.menu-toggle__line {
  position: absolute;
  width: 22px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.7;
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s ease;
}

.menu-toggle__line:nth-child(1) {
  top: 12px;
}

.menu-toggle__line:nth-child(2) {
  top: 20px;
}

.menu-toggle__line:nth-child(3) {
  top: 28px;
}

.menu-toggle--icon-open .menu-toggle__line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-toggle--icon-open .menu-toggle__line:nth-child(2) {
  opacity: 0;
}

.menu-toggle--icon-open .menu-toggle__line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.menu-toggle:hover .menu-toggle__line {
  opacity: 0.92;
}

@media (prefers-reduced-motion: reduce) {
  .menu-toggle__line,
  .menu-toggle--hoverable {
    transition: none;
  }

  .menu-toggle--hoverable:hover {
    transform: none;
  }
}

.menu-ripple {
  position: fixed;
  width: 120vmax;
  height: 120vmax;
  left: var(--ripple-x);
  top: var(--ripple-y);
  border-radius: 9999px;
  transform: translate(-50%, -50%) scale(0.05);
  background: radial-gradient(
    circle at center,
    rgba(155, 92, 255, 0.72) 0%,
    rgba(43, 245, 160, 0.28) 45%,
    rgba(12, 10, 16, 0) 70%
  );
  opacity: 0;
  pointer-events: none;
}

.menu-ripple--active {
  animation: menu-ripple-open 0.6s cubic-bezier(.76, .32, .29, .99) forwards;
}

@keyframes menu-ripple-open {
  0% {
    transform: translate(-50%, -50%) scale(0.05);
    opacity: 0.75;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}
</style>