# Japanese Dictionary App

An interactive Japanese dictionary built with **Next.js** and **Prisma**, designed to provide a clean, modern experience for learners of the Japanese language.

This project aims to combine accurate lexical data, intuitive navigation, and interactive learning features (like kanji stroke order practice) to help users improve their reading and writing skills.

---

## 🚀 Features

- **Dynamic Word and Kanji Pages**
  - `/word/[slug]`: Display words, their kanji components, kana readings, and multilingual definitions.
  - `/kanji/[slug]`: Display individual kanji with readings, meanings, and related words.

- **Interactive Kanji Practice**
  - `/kanji/[slug]/practice`: Practice writing kanji strokes with real-time feedback.
  - Powered by [Hanzi Writer](https://chanind.github.io/hanzi-writer/), which checks stroke order, direction, and accuracy — similar to how apps like :contentReference[oaicite:1]{index=1} handle writing exercises.

- **Modular Architecture**
  - `hooks/`: Custom React hooks for data fetching and logic separation.
  - `api/`: Centralized data access layer to keep database calls out of page components.
  - `lib/prisma`: Prisma client for database interaction.

- **Multilingual Definitions**
  - Each word includes glosses in English and French, with easy switching and clear UI.

---



















This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
