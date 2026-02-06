# Yuka Clone - Project Guide

A food product scanning app inspired by Yuka, built with Next.js and Firebase. Scan barcodes to get nutritional analysis, health scores, and personalized recommendations.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS
- **Backend**: Firebase (Auth + Firestore)
- **APIs**: Open Food Facts
- **Scanner**: html5-qrcode
- **PWA**: next-pwa

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/               # Login/signup pages
│   ├── beers/              # Beer tracking feature
│   ├── favorites/          # Saved favorites
│   ├── history/            # Scan history
│   ├── lists/              # Custom product lists
│   ├── product/[barcode]/  # Product detail page
│   └── profile/            # User profile
├── components/
│   ├── auth/               # Auth forms, guards
│   ├── beers/              # Beer tracking components
│   ├── layout/             # Header, nav, loading
│   ├── product/            # Product display components
│   ├── pwa/                # PWA install prompt
│   ├── scanner/            # Barcode scanner
│   └── ui/                 # Reusable UI primitives
├── hooks/                  # Custom React hooks
├── lib/
│   ├── api/                # External API clients
│   ├── alternatives/       # Product alternatives logic
│   ├── beers/              # Beer tracking utilities
│   ├── firebase/           # Firebase config & utilities
│   ├── scoring/            # Health score calculations
│   └── utils/              # Formatters, validators
└── types/                  # TypeScript type definitions
```

## Key Patterns

### Path Aliases
Use `@/` for imports from `src/`:
```typescript
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
```

### Firebase Lazy Initialization
Firebase is lazily initialized to support environments without config:
```typescript
import { auth, db } from '@/lib/firebase/config';

// These are getter functions, not direct exports
const firebaseAuth = auth();
const firestore = db();
```

### Barrel Exports
Components and hooks use index.ts barrel files:
```typescript
// Import from barrel
import { Button, Card, Input } from '@/components/ui';
import { useProduct, useHistory } from '@/hooks';
```

### Custom Hooks Pattern
Data fetching hooks follow this pattern:
- `useProduct` - Fetch product by barcode
- `useHistory` - User's scan history
- `useFavorites` - User's favorites
- `useLists` - User's custom lists
- `useBeerLogs` - Beer tracking data

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and fill in Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

## Code Style

### TypeScript
- Strict mode is enabled
- Prefer explicit types over `any`
- Use type imports: `import type { Product } from '@/types'`

### Components
- Functional components with TypeScript
- Props interfaces defined inline or in types/
- Use TailwindCSS for styling (no CSS modules)

### State Management
- React hooks for local state
- Firebase/Firestore for persistent state
- No Redux or external state library

## Features Overview

### Product Scanning
- Barcode scanning via camera (html5-qrcode)
- Manual barcode entry fallback
- Open Food Facts API for product data

### Health Scoring
- NutriScore display
- Custom health score algorithm
- Additive analysis and warnings
- Personalized recommendations based on user profile

### Beer Tracking
- Daily beer consumption logging
- Weekly visualization
- Streak tracking

### User Features
- Firebase Authentication (email + Google)
- Scan history
- Favorites
- Custom product lists

## Firestore Collections

- `users/{uid}` - User profiles and preferences
- `users/{uid}/history` - Scan history
- `users/{uid}/favorites` - Favorite products
- `users/{uid}/lists` - Custom lists
- `users/{uid}/beerLogs` - Beer tracking data

## Testing

No test framework is currently configured. When adding tests:
- Consider Vitest or Jest
- Use React Testing Library for components
- Mock Firebase calls in tests

## Deployment

The project is configured for Vercel deployment. Ensure environment variables are set in the Vercel dashboard.
