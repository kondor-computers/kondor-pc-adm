import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {SEO_MENU_ITEMS} from './schemaTypes/documents/siteSeoPages'

function seoMenuItem(
  S: StructureBuilder,
  item: (typeof SEO_MENU_ITEMS)[number],
) {
  return S.listItem()
    .title(item.menuTitle)
    .child(
      S.document()
        .schemaType(item.schemaType)
        .documentId(item.documentId)
        .title(item.menuTitle),
    )
}

/**
 * Studio structure.
 *
 * Верхня частина — конструктор лендингів і його довідники.
 * Нижня (під дільником) — існуючий каталог ПК.
 */
export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Контент')
    .items([
      // === Конструктор лендингів ===
      S.listItem()
        .title('📄 Лендингові сторінки')
        .child(
          S.documentTypeList('page')
            .title('Сторінки')
            .defaultOrdering([
              {field: 'pathPrefix', direction: 'asc'},
              {field: 'slug.current', direction: 'asc'},
            ]),
        ),
      S.divider(),
      // === Блог ===
      S.listItem()
        .title('📰 Блог')
        .child(
          S.list()
            .title('Блог')
            .items([
              S.listItem()
                .title('Статті')
                .child(
                  S.documentTypeList('blogPost')
                    .title('Статті блогу')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Автори')
                .child(
                  S.documentTypeList('blogAuthor')
                    .title('Автори блогу')
                    .defaultOrdering([{field: 'name', direction: 'asc'}]),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('🔍 SEO')
        .child(
          S.list()
            .title('SEO')
            .items(SEO_MENU_ITEMS.map((item) => seoMenuItem(S, item))),
        ),
      S.listItem()
        .title('⚙️ Site settings')
        .child(
          S.list()
            .title('Site settings')
            .items([
              S.listItem()
                .title('Реквізити для оплати')
                .child(
                  S.document()
                    .schemaType('paymentRequisites')
                    .documentId('paymentRequisites')
                    .title('Реквізити для оплати'),
                ),
              S.listItem()
                .title('Контакти')
                .child(
                  S.document()
                    .schemaType('siteContacts')
                    .documentId('siteContacts')
                    .title('Контакти'),
                ),
              S.listItem()
                .title('Головна: для яких задач збираємо ПК')
                .child(
                  S.document()
                    .schemaType('homePcTasksSection')
                    .documentId('homePcTasksSection')
                    .title('Для яких задач збираємо ПК'),
                ),
              S.listItem().title('🎟️ Промокоди').child(S.documentTypeList('promoCode')),
            ]),
        ),
      S.divider(),
      // === Існуючий каталог (НЕ ЧІПАЄМО) ===
      S.listItem()
        .title('🖥️ Ігрові ПК')
        .child(
          S.documentTypeList('build')
            .title('Ігрові ПК')
            .defaultOrdering([{field: 'name', direction: 'asc'}]),
        ),
      S.listItem()
        .title('✨ Переваги')
        .child(
          S.documentTypeList('buildBenefit')
            .title('Переваги')
            .defaultOrdering([{field: 'sortOrder', direction: 'asc'}]),
        ),
      S.listItem().title('💾 GPU').child(S.documentTypeList('gpu')),
      S.listItem().title('🎮 Ігри').child(S.documentTypeList('game')),
    ])
