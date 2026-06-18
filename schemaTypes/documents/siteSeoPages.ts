import {createSeoSingleton, type SeoSingletonConfig} from './createSeoSingleton'

export const SITE_SEO_PAGE_CONFIGS = [
  {
    name: 'seoHomePage',
    title: 'Головна сторінка',
    subtitle: 'SEO для головної',
  },
  {
    name: 'seoPickerPage',
    title: 'Підбір',
    subtitle: 'SEO для сторінки підбору',
  },
  {
    name: 'seoPickerResultPage',
    title: 'Результат підбору',
    subtitle: 'SEO для сторінки результату підбору',
  },
  {
    name: 'seoCustomBuildPage',
    title: 'Кастомна збірка',
    subtitle: 'SEO для сторінки кастомної збірки',
  },
  {
    name: 'seoPcCatalogPage',
    title: 'ПК',
    subtitle: 'SEO для каталогу ПК',
  },
  {
    name: 'seoAccessoriesPage',
    title: 'Аксесуари',
    subtitle: 'SEO для сторінки аксесуарів',
  },
  {
    name: 'seoDeliveryPaymentPage',
    title: 'Доставка та оплата',
    subtitle: 'SEO для сторінки доставки та оплати',
  },
  {
    name: 'seoWarrantyPage',
    title: 'Гарантія',
    subtitle: 'SEO для сторінки гарантії',
  },
  {
    name: 'seoContactsPage',
    title: 'Контакти',
    subtitle: 'SEO для сторінки контактів',
  },
  {
    name: 'seoPublicOfferPage',
    title: 'Публічна оферта',
    subtitle: 'SEO для публічної оферти',
  },
  {
    name: 'seoPrivacyPolicyPage',
    title: 'Політика конфіденційності',
    subtitle: 'SEO для політики конфіденційності',
  },
  {
    name: 'seoRequisitesPage',
    title: 'Реквізити',
    subtitle: 'SEO для сторінки реквізитів',
  },
] as const satisfies readonly SeoSingletonConfig[]

/** Усі SEO-синглтони, крім blogPage (вже існує окремо). */
export const siteSeoPageTypes = SITE_SEO_PAGE_CONFIGS.map(createSeoSingleton)

export const SEO_MENU_ITEMS = [
  {schemaType: 'blogPage', documentId: 'blogPage', menuTitle: 'Блог'},
  ...SITE_SEO_PAGE_CONFIGS.map((page) => ({
    schemaType: page.name,
    documentId: page.name,
    menuTitle: page.title,
  })),
] as const
