const $ = (selector, scope = document) => scope.querySelector(selector)
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)]

const menuButton = $('.menu-toggle')
const nav = $('.site-nav')
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true'
  menuButton.setAttribute('aria-expanded', String(!open))
  nav.classList.toggle('open', !open)
})
$$('.site-nav a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false')
  nav.classList.remove('open')
}))

const themeButton = $('.theme-toggle')
const updateThemeLabel = () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
  themeButton.setAttribute('aria-label', `Switch to ${next} theme`)
}
updateThemeLabel()
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
  const apply = () => {
    document.documentElement.dataset.theme = next
    localStorage.setItem('acm-portfolio-theme', next)
    updateThemeLabel()
  }
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(apply)
  else apply()
})

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
$$('.reveal').forEach(element => revealObserver.observe(element))

const sections = $$('main section[id]')
const navLinks = $$('.site-nav a')
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`))
  })
}, { rootMargin: '-35% 0px -55%', threshold: 0 })
sections.forEach(section => sectionObserver.observe(section))

const screenData = {
  home: ['Home Dashboard', 'A prioritized view of mentor guidance, career fit and the next roadmap milestone.'],
  interests: ['Interests & Skills', 'Selectable interests and persistent skill chips keep personalization concise and editable.'],
  results: ['Assessment Results', 'A balanced profile summary explains influences without making unsupported psychological claims.'],
  explore: ['Career Exploration', 'Search, category filters, visible match context and saved states support discovery.'],
  details: ['Career Details', 'The role page answers the key question: why does this path match the user?'],
  mentor: ['AI Mentor', 'Supportive guidance, suggested prompts and a clear caution keep the interaction useful and honest.'],
  roadmap: ['Career Roadmap', 'A vertical milestone sequence separates completed, current and upcoming work.'],
  progress: ['Progress Tracker', 'Roadmap completion, weekly activity and skills in progress emphasize meaningful momentum.']
}
const screenKeys = Object.keys(screenData)
let selectedScreen = 0
const showcaseImage = $('#showcase-image')
const screenName = $('#screen-name')
const screenDescription = $('#screen-description')
const screenCount = $('#screen-count')
const screenTabs = $$('.screen-thumbnails button')
const setScreen = index => {
  selectedScreen = (index + screenKeys.length) % screenKeys.length
  const key = screenKeys[selectedScreen]
  showcaseImage.classList.add('changing')
  window.setTimeout(() => {
    showcaseImage.src = `./assets/screenshots/${key}.png`
    showcaseImage.alt = `${screenData[key][0]} screen`
    screenName.textContent = screenData[key][0]
    screenDescription.textContent = screenData[key][1]
    screenCount.textContent = `${String(selectedScreen + 1).padStart(2, '0')} / ${String(screenKeys.length).padStart(2, '0')}`
    screenTabs.forEach(tab => {
      const active = tab.dataset.screen === key
      tab.classList.toggle('active', active)
      tab.setAttribute('aria-selected', String(active))
      if (active) tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    })
    showcaseImage.classList.remove('changing')
  }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150)
}
screenTabs.forEach((tab, index) => tab.addEventListener('click', () => setScreen(index)))
$('#screen-prev').addEventListener('click', () => setScreen(selectedScreen - 1))
$('#screen-next').addEventListener('click', () => setScreen(selectedScreen + 1))
$('.showcase-stage').addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') setScreen(selectedScreen - 1)
  if (event.key === 'ArrowRight') setScreen(selectedScreen + 1)
})

const galleryCards = $$('.gallery-card')
const lightbox = $('.lightbox')
const lightboxImage = $('.lightbox img')
const lightboxTitle = $('#lightbox-title')
let galleryIndex = 0
const showGalleryImage = index => {
  galleryIndex = (index + galleryCards.length) % galleryCards.length
  const card = galleryCards[galleryIndex]
  lightboxImage.src = card.dataset.full
  lightboxImage.alt = `${card.dataset.title} full-screen application capture`
  lightboxTitle.textContent = card.dataset.title
}
galleryCards.forEach((card, index) => card.addEventListener('click', () => {
  showGalleryImage(index)
  lightbox.showModal()
}))
$('.lightbox-close').addEventListener('click', () => lightbox.close())
$('.lightbox-prev').addEventListener('click', () => showGalleryImage(galleryIndex - 1))
$('.lightbox-next').addEventListener('click', () => showGalleryImage(galleryIndex + 1))
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close() })
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') showGalleryImage(galleryIndex - 1)
  if (event.key === 'ArrowRight') showGalleryImage(galleryIndex + 1)
})
