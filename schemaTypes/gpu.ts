import { defineField, defineType } from "sanity";
import { catalogSkuField } from "./lib/catalogSku";

type FpsRow = {
  game?: { _ref?: string };
  resolution?: string;
  settings?: string;
};

function fpsUniqKey(row: FpsRow): string | null {
  const gameKey = row.game?._ref;
  if (!gameKey || !row.resolution) return null;
  return [gameKey, row.resolution, row.settings ?? "high"].join("|");
}

export const gpu = defineType({
  name: "gpu",
  title: "Відеокарта",
  type: "document",
  fields: [
    defineField({
      name: "brand",
      title: "Бренд",
      type: "string",
      options: { list: ["NVIDIA", "AMD"] },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "model",
      title: "Модель",
      type: "string",
      description: "Напр. RTX 5060, RX 7600 XT",
      validation: (R) => R.required(),
    }),
    catalogSkuField({
      source: (doc) => [doc.brand, doc.model].filter(Boolean).join(" "),
      description: "Напр. NVIDIA-RTX-5070-12GB. Generate — з бренду та моделі.",
    }),
    defineField({
      name: "vram",
      title: "VRAM",
      type: "string",
      description: "Напр. 8 GB, 16 GB",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "priceUah",
      title: "Доплата в конфігураторі (₴)",
      type: "number",
      description:
        "Доплата при виборі цієї відеокарти. 0 — базовий рівень. " +
        "На збірці ціна не дублюється — оновлюється тільки тут.",
      initialValue: 0,
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: "fps",
      title: "FPS дані",
      description: "Базові показники FPS для цієї відеокарти. В самому ПК можна задати коефіцієнт коригування.",
      type: "array",
      validation: (R) =>
        R.custom((rows) => {
          if (!Array.isArray(rows)) return true;
          const seen = new Set<string>();
          for (const raw of rows) {
            const key = fpsUniqKey((raw ?? {}) as FpsRow);
            if (!key) continue;
            if (seen.has(key)) {
              return "FPS рядки мають бути унікальні за комбінацією: game + resolution + settings.";
            }
            seen.add(key);
          }
          return true;
        }),
      of: [
        {
          type: "object",
          title: "FPS запис",
          fields: [
            defineField({
              name: "game",
              title: "Гра",
              type: "reference",
              to: [{ type: "game" }],
              description: "Обери документ гри — це єдиний спосіб зв'язку FPS з game.",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "resolution",
              title: "Роздільна здатність",
              type: "string",
              options: {
                list: [
                  { title: "Full HD (1080p)", value: "fullhd" },
                  { title: "2K (1440p)", value: "2k" },
                  { title: "4K (2160p)", value: "4k" },
                ],
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: "settings",
              title: "Налаштування графіки",
              type: "string",
              options: {
                list: [
                  { title: "Низькі", value: "low" },
                  { title: "Середні", value: "medium" },
                  { title: "Високі", value: "high" },
                  { title: "Ультра", value: "ultra" },
                ],
              },
              initialValue: "high",
            }),
            defineField({
              name: "fpsAvg",
              title: "Середній FPS",
              type: "number",
              validation: (R) => R.required().min(1),
            }),
            defineField({
              name: "fpsMin",
              title: "Мінімальний FPS (1% low)",
              type: "number",
            }),
            defineField({
              name: "verified",
              title: "Перевірено в лабораторії",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "notes",
              title: "Примітки",
              type: "string",
              description: "Напр. «з FSR», «без трасування»",
            }),
          ],
          preview: {
            select: {
              gameName: "game.name",
              resolution: "resolution",
              settings: "settings",
              fpsAvg: "fpsAvg",
            },
            prepare({ gameName, resolution, settings, fpsAvg }) {
              const gameLabel = gameName || "unknown-game";
              return {
                title: `${gameLabel} · ${resolution} · ${settings}`,
                subtitle: `${fpsAvg} FPS avg`,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      brand: "brand",
      model: "model",
      vram: "vram",
      sku: "sku.current",
      priceUah: "priceUah",
    },
    prepare({ brand, model, vram, sku, priceUah }) {
      const price =
        priceUah === 0 ? "включено" : `+${priceUah?.toLocaleString("uk")} ₴`;
      return {
        title: `${brand} ${model}`,
        subtitle: sku ? `${sku} · ${vram} · ${price}` : `${vram} · ${price}`,
      };
    },
  },
});
