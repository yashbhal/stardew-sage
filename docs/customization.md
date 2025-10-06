# UI Customization Guide

## Overview

Tailwind CSS powers the Stardew Sage look and feel. Colors, fonts, spacing, and bespoke utilities live in `tailwind.config.js` and `src/app/globals.css`. This guide highlights where to tweak visuals and how to keep the Stardew Valley aesthetic intact.

## Design Tokens

`tailwind.config.js` defines custom palettes and font stacks:

```javascript
// tailwind.config.js
extend: {
  colors: {
    'stardew-blue': {
      200: '#8ECAE6',
      400: '#219EBC',
      700: '#0D4F64',
    },
    'stardew-green': {
      500: '#68B684',
      600: '#4F8F6E',
    },
    'stardew-brown': {
      400: '#B08968',
      800: '#5E4126',
    },
  },
  fontFamily: {
    pixel: ['VT323', 'monospace'],
    body: ['Inter', 'system-ui', 'sans-serif'],
  },
}
```

Adjust these tokens to shift the palette or typography globally. After editing the config run `npm run dev` to regenerate styles.

## Global Styles

`src/app/globals.css` declares texture backgrounds, focus outlines, and motion preferences. Key sections:

- Root variables define gradient backdrops.
- `@media (prefers-reduced-motion: reduce)` removes animations for sensitive users.
- Utility classes like `.rounded-stardew-lg` and `.shadow-stardew-xl` provide consistent card styling.

## Component Styling

- `ChatInterface.tsx` assembles layout using Tailwind classes. Customize message container spacing or card borders here.
- Components under `src/components/chat/` encapsulate their own visuals. For example `ChatHeader.tsx` uses a gradient background, while `ChatMessage.tsx` includes the assistant and user bubble themes.

### Message Bubbles

```tsx
// src/components/chat/ChatMessage.tsx
<div
  className={`
    max-w-[80%] sm:max-w-[68%] rounded-stardew-lg px-4 py-3 shadow-stardew-sm
    ${isUser
      ? 'bg-stardew-blue-400 text-white rounded-tr-none'
      : 'bg-menu-paper border border-menu-border rounded-tl-none'}
  `}
>
  {content}
</div>
```

Change the background classes or border radius values to reshape the bubble theme. Add new utility classes in `globals.css` if you want additional drop shadows or border styles.

### Header Banner

```tsx
// src/components/chat/ChatHeader.tsx
<header className={`bg-gradient-to-r from-stardew-green-500 to-stardew-green-600 ...`}>
```

Swap gradient stops or typography to adjust the hero styling. The header also respects the `prefersReducedMotion` flag, so avoid reintroducing non-optional animations.

## Assets

- Icons live under `public/icons/`. Replace `stardew-sage.jpg` or `user-icon.jpg` with your own art and ensure the paths in `ChatHeader.tsx` and `ChatMessage.tsx` match.
- Fonts are loaded via `next/font` in `src/app/layout.tsx`. Update the import there if you introduce custom fonts.

## Branding Tips

- Maintain high color contrast for accessibility. Test updates with tools like the Chrome DevTools contrast checker.
- Keep the pixel font for headings and a readable body font for long answers.
- Preserve consistent spacing with the existing Tailwind utility scale (`px-3`, `py-4`, etc.).

Use this guide when refreshing the Stardew theme or retheming the chat for another franchise. Update `tailwind.config.js` and component classes in tandem for predictable results.