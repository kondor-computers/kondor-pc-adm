// === Існуючі (НЕ ЧІПАЄМО) ===
import {gpu} from './gpu'
import {build} from './build'
import {buildBenefit} from './buildBenefit'
import {buildAddon} from './buildAddon'

// Orphan `game.ts` — окрема сутність для довідника ігор.
// У Спринті 1А реєструємо щоб structure.ts показав «🎮 Ігри».
// Інші orphan-об'єкти (buildColor/buildComponent/configOption/
// configOptionGroup/gpuFpsRow) НЕ реєструємо — buildColor вимагає
// плагіна @sanity/color-input який не встановлений, а решта це
// мертвий код з попередньої моделі.
import {game} from './game'

// === Нові документи ===
import {page} from './page'
import {promoCode} from './promoCode'

// === Нові універсальні секції (Sprint 1А) ===
// === Blog (port from nbyg-adm — preserve original naming) ===
import {blogPost} from './documents/blogPost'
import {blogAuthor} from './documents/blogAuthor'
import {blogPage} from './documents/blogPage'
import {siteSeoPageTypes} from './documents/siteSeoPages'
import {paymentRequisites} from './documents/paymentRequisites'
import {siteContacts} from './documents/siteContacts'
import {homePcTasksSection} from './documents/homePcTasksSection'
import {seoSettings} from './objects/seoSettings'
import {faqAnswerButton} from './objects/faqAnswerButton'
import {faqQuestion} from './objects/faqQuestion'
import {gallerySection} from './objects/gallerySection'

import {breadcrumbs} from './sections/breadcrumbs'
import {anchorNav} from './sections/anchorNav'
import {heroSimple} from './sections/heroSimple'
import {textBlock} from './sections/textBlock'
import {imageFull} from './sections/imageFull'
import {imageTextSplit} from './sections/imageTextSplit'
import {featureList} from './sections/featureList'
import {mediaVideo} from './sections/mediaVideo'
import {statsStrip} from './sections/statsStrip'
import {faqAccordion} from './sections/faqAccordion'
import {ctaPromoBanner} from './sections/ctaPromoBanner'
import {tableSection} from './sections/tableSection'

export const schemaTypes = [
  // documents
  build,
  buildBenefit,
  buildAddon,
  gpu,
  game,
  page,
  promoCode,
  blogPost,
  blogAuthor,
  blogPage,
  ...siteSeoPageTypes,
  paymentRequisites,
  siteContacts,
  homePcTasksSection,
  // blog support objects (port from nbyg-adm)
  seoSettings,
  faqAnswerButton,
  faqQuestion,
  gallerySection,
  // section objects
  breadcrumbs,
  anchorNav,
  heroSimple,
  textBlock,
  imageFull,
  imageTextSplit,
  featureList,
  mediaVideo,
  statsStrip,
  faqAccordion,
  ctaPromoBanner,
  tableSection,
]
