# Focus App

A productivity application with pomodoro timer, task management, and customizable backgrounds.

## Features

- **Task Management**: Create, edit, and track tasks with drag-and-drop functionality
- **Focus Timer**: Pomodoro-style timer with work/break cycles
- **Dynamic Backgrounds**: Theme-aware background images that change with light/dark mode
- **Responsive Design**: Works on mobile and desktop

## Background System

The app includes a dynamic background system that:

1. Automatically switches between day/night variants based on theme
2. Supports multiple background sets that can be selected by users
3. Provides smooth transitions between backgrounds

To add a new background set:

1. Add the image files to `/public/backgrounds/` (both light and dark variants)
2. Update the `backgroundSets` array in `/components/main/background/background.jsx`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

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
