# Yuka-Clone: Food Scanner Web App

## Project Overview

A Progressive Web App that scans food product barcodes, fetches nutritional data from Open Food Facts, and displays health scores with detailed ingredient analysis. Users can save scan history, create favorites lists, and add personal ratings.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| Auth | Firebase Authentication (Google Sign-In) |
| Hosting | Vercel |
| PWA | next-pwa |
| Barcode Scanner | html5-qrcode |
| API | Open Food Facts (free, no key required) |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  Pages/Routes                                               │
│  ├── / (home - scanner)                                     │
│  ├── /product/[barcode] (product details)                   │
│  ├── /history (scan history)                                │
│  ├── /favorites (saved products)                            │
│  ├── /lists (custom lists)                                  │
│  ├── /profile (user settings)                               │
│  └── /auth (login/signup)                                   │
├─────────────────────────────────────────────────────────────┤
│  Components                                                 │
│  ├── Scanner (camera barcode reader)                        │
│  ├── ProductCard (score + quick info)                       │
│  ├── NutritionPanel (detailed nutrition)                    │
│  ├── IngredientList (with warnings)                         │
│  ├── ScoreGauge (visual 0-100 score)                        │
│  └── Navigation (bottom tab bar)                            │
├─────────────────────────────────────────────────────────────┤
│  Services                                                   │
│  ├── openFoodFacts.ts (API client)                          │
│  ├── healthScore.ts (custom scoring algorithm)              │
│  ├── firebase.ts (Firestore + Auth)                         │
│  └── pwa.ts (install prompt, offline)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
├─────────────────────────────────────────────────────────────┤
│  Open Food Facts API                                        │
│  └── GET https://world.openfoodfacts.org/api/v0/product/    │
│       {barcode}.json                                        │
├─────────────────────────────────────────────────────────────┤
│  Firebase                                                   │
│  ├── Auth (Google Sign-In)                                  │
│  └── Firestore                                              │
│      ├── users/{uid}                                        │
│      ├── users/{uid}/history/{docId}                        │
│      ├── users/{uid}/favorites/{barcode}                    │
│      ├── users/{uid}/lists/{listId}                         │
│      └── users/{uid}/ratings/{barcode}                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Features

### Core Features
- **Barcode Scanner**: Camera-based scanning with manual entry fallback
- **Product Lookup**: Fetch product data from Open Food Facts API
- **Health Scoring**: Display Nutri-Score (A-E) + custom 0-100 score
- **Ingredient Analysis**: Highlight additives with color-coded warnings
- **Nutrition Display**: Detailed nutrition facts table

### User Features
- **Google Sign-In**: One-click authentication
- **Scan History**: Automatically save and view previously scanned products
- **Favorites**: Save products you like
- **Custom Lists**: Create lists (e.g., "Groceries", "Avoid", "Kids Snacks")
- **Personal Ratings**: Add your own notes and ratings to products

### PWA Features
- **Installable**: Add to home screen on mobile
- **Offline Support**: View cached products without internet
- **App-like Experience**: Full-screen, no browser UI
- **Quick Scan Widget**: PWA shortcut to launch directly into scanner mode

### Enhanced Features
- **Better Alternatives**: Suggest healthier products in the same category
- **Additive Explanations**: Plain-language explanations of why each additive is classified as safe, moderate, or high risk

---

## Health Scoring Algorithm

The custom scoring system rates products from 0-100:

### Positive Factors (+points)
| Factor | Max Points |
|--------|------------|
| High fiber content | +10 |
| High protein content | +10 |
| Fruits/vegetables % | +10 |
| Organic certification | +5 |
| Low sodium (<400mg/100g) | +5 |
| Low sugar (<5g/100g) | +10 |

### Negative Factors (-points)
| Factor | Max Penalty |
|--------|-------------|
| Excess sugar (>12.5g/100g) | -15 |
| Excess saturated fat (>5g/100g) | -15 |
| Excess sodium (>600mg/100g) | -10 |
| Ultra-processed indicators | -10 |
| Red-flagged additives | -5 each |
| High calorie density | -10 |

### Additive Classification & Explanations

Each additive includes a plain-language explanation of its risk classification:

```
🟢 GREEN (safe) - No known health concerns
   E300 (Vitamin C)
   → "Vitamin C is a natural antioxidant. It's the same vitamin found in
      oranges and is safe for daily consumption."

   E330 (Citric acid)
   → "Citric acid occurs naturally in citrus fruits. It's used to add
      tartness and preserve freshness. Safe for most people."

   E322 (Lecithin)
   → "Lecithin is a natural fat found in eggs and soybeans. It helps
      ingredients mix together smoothly. No health concerns."

🟡 YELLOW (moderate risk) - Use caution, limit intake
   E412 (Guar gum)
   → "Guar gum is a plant-based thickener. Generally safe, but may cause
      digestive discomfort in large amounts or for sensitive individuals."

   E471 (Mono/diglycerides)
   → "These are fats used as emulsifiers. While generally safe, they may
      be derived from animal or plant sources and can contain trans fats."

   E415 (Xanthan gum)
   → "A thickener made by bacterial fermentation. Safe for most people,
      but may cause bloating or gas in sensitive individuals."

🔴 RED (avoid) - Health concerns documented
   E250 (Sodium nitrite)
   → "Used to preserve processed meats. Studies link regular consumption
      to increased risk of certain cancers. Best to limit intake."

   E951 (Aspartame)
   → "An artificial sweetener. While approved for use, some studies raise
      concerns about neurological effects. Controversial among researchers."

   E621 (MSG)
   → "A flavor enhancer. May cause headaches, flushing, or 'Chinese
      Restaurant Syndrome' in sensitive individuals."

   E102 (Tartrazine)
   → "A yellow food dye. Linked to hyperactivity in children and allergic
      reactions. Banned in some countries."

   E110 (Sunset Yellow)
   → "An orange food dye. Associated with hyperactivity in children and
      may trigger allergic reactions or asthma symptoms."
```

### Score Interpretation
| Score | Rating | Color |
|-------|--------|-------|
| 80-100 | Excellent | Green |
| 60-79 | Good | Light Green |
| 40-59 | Moderate | Yellow |
| 20-39 | Poor | Orange |
| 0-19 | Bad | Red |

---

## Project Structure

```
yuka/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Scanner home
│   │   ├── product/
│   │   │   └── [barcode]/page.tsx   # Product details
│   │   ├── history/page.tsx
│   │   ├── favorites/page.tsx
│   │   ├── lists/
│   │   │   ├── page.tsx
│   │   │   └── [listId]/page.tsx
│   │   ├── profile/page.tsx
│   │   └── auth/
│   │       ├── login/page.tsx
│   │       └── signup/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                      # Base components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── scanner/
│   │   │   ├── BarcodeScanner.tsx
│   │   │   └── ManualEntry.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ScoreGauge.tsx
│   │   │   ├── NutriScore.tsx
│   │   │   ├── NutritionTable.tsx
│   │   │   ├── IngredientList.tsx
│   │   │   ├── AdditiveCard.tsx          # Additive with explanation modal
│   │   │   └── BetterAlternatives.tsx    # Healthier product suggestions
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── SignupForm.tsx
│   │       └── AuthGuard.tsx
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   └── firestore.ts
│   │   ├── api/
│   │   │   └── openFoodFacts.ts
│   │   ├── scoring/
│   │   │   ├── healthScore.ts
│   │   │   ├── additives.ts              # Additive codes + risk levels
│   │   │   ├── additiveExplanations.ts   # Plain-language explanations
│   │   │   └── nutrientAnalysis.ts
│   │   ├── alternatives/
│   │   │   └── betterAlternatives.ts     # Find healthier products in category
│   │   └── utils/
│   │       ├── formatters.ts
│   │       └── validators.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProduct.ts
│   │   ├── useHistory.ts
│   │   ├── useFavorites.ts
│   │   └── useLists.ts
│   │
│   ├── types/
│   │   ├── product.ts
│   │   ├── user.ts
│   │   └── scoring.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── icons/                       # PWA icons (192x192, 512x512)
│   ├── manifest.json
│   └── sw.js                        # Service worker
│
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── .env.local                       # Firebase config (not committed)
└── .gitignore
```

---

## Implementation Phases

### Phase 1: Project Setup & Core Infrastructure
- [ ] Initialize Next.js 14 with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up Firebase project (Console)
- [ ] Create Firebase configuration files
- [ ] Set up environment variables
- [ ] Create basic layout and navigation

### Phase 2: Barcode Scanner
- [ ] Install and configure html5-qrcode
- [ ] Create BarcodeScanner component
- [ ] Handle camera permissions gracefully
- [ ] Add manual barcode entry fallback
- [ ] Add scanning feedback (sound, vibration)

### Phase 3: Open Food Facts Integration
- [ ] Create API client with TypeScript types
- [ ] Implement product fetching by barcode
- [ ] Handle API errors (product not found, network issues)
- [ ] Add product caching in localStorage

### Phase 4: Health Scoring System
- [ ] Create additive database with classifications
- [ ] Implement nutrient analysis functions
- [ ] Build custom 0-100 scoring algorithm
- [ ] Test with various products

### Phase 5: Product Display UI
- [ ] Design mobile-first product page
- [ ] Create ScoreGauge component (circular/arc)
- [ ] Build NutriScore badge (A-E letters)
- [ ] Create NutritionTable component
- [ ] Build IngredientList with color-coded warnings
- [ ] Add ProductCard for list views

### Phase 6: User Authentication
- [ ] Configure Firebase Auth with Google provider
- [ ] Create AuthContext and useAuth hook
- [ ] Build login page with Google Sign-In button
- [ ] Implement AuthGuard for protected routes
- [ ] Add user profile page

### Phase 7: User Data Features
- [ ] Implement scan history (auto-save after scan)
- [ ] Build history page with search/filter
- [ ] Create favorites functionality (heart icon)
- [ ] Build favorites page
- [ ] Implement custom lists (create, rename, delete)
- [ ] Add personal ratings/notes to products

### Phase 8: PWA & Polish
- [ ] Configure next-pwa plugin
- [ ] Create manifest.json with app metadata
- [ ] Generate app icons (all required sizes)
- [ ] Implement service worker for offline
- [ ] Add install prompt banner
- [ ] Polish responsive design
- [ ] Add loading states and skeleton screens
- [ ] Implement animations/transitions

### Phase 9: Additive Explanations
- [x] Create comprehensive additive database with explanations
- [x] Build AdditiveCard component with tap-to-expand details
- [x] Include risk level, what it does, why it's classified that way
- [x] Add source citations for health claims
- [x] Create modal/drawer for full explanation view
- [x] Add "Learn More" links to reputable sources

### Phase 10: Better Alternatives
- [x] Research Open Food Facts category/search API endpoints
- [x] Build betterAlternatives.ts service
- [x] Query products in same category with higher health scores
- [x] Filter by availability (same country/region) - Canada prioritized
- [x] Create BetterAlternatives component (carousel/list)
- [x] Add "Why it's better" comparison (score diff, less sugar, etc.)
- [x] Cache alternative results to reduce API calls (4-hour cache)
- [x] Handle edge cases (no alternatives found, high score product)

### Phase 11: Quick Scan Widget/Shortcut ✅
- [x] Add PWA shortcuts to manifest.json for direct scanner access
- [x] Configure shortcut icons (scan, history, favorites)
- [x] Test shortcut on Android (home screen long-press)
- [x] Test shortcut on iOS (limited support - documented in InstallPrompt)
- [x] Add "Add to Home Screen" prompt with shortcut explanation

### Phase 12: Testing & Deployment
- [ ] Test barcode scanning on multiple devices
- [ ] Test offline functionality
- [ ] Set up Vercel project
- [ ] Configure environment variables on Vercel
- [ ] Deploy and test production build
- [ ] Configure Firebase security rules (production)
- [ ] Performance audit (Lighthouse)

---

## Firebase Setup Instructions

Before starting development:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** → Name it (e.g., "yuka-clone")
3. Enable Google Analytics (optional)
4. Once created, click the **gear icon** → **Project settings**
5. Scroll to **"Your apps"** → Click the web icon **(`</>`)**
6. Register your app (nickname: "yuka-web")
7. Copy the config object

### Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Click **Google** → **Enable**
3. Add your email as the support email
4. Save

### Enable Firestore
1. Go to **Firestore Database** → **Create database**
2. Select **"Start in test mode"** (we'll add rules later)
3. Choose a region close to your users

### Environment Variables
Create `.env.local` in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /history/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /favorites/{barcode} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /lists/{listId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /ratings/{barcode} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## API Reference

### Open Food Facts API

**Get Product by Barcode:**
```
GET https://world.openfoodfacts.org/api/v0/product/{barcode}.json
```

**Example Response (simplified):**
```json
{
  "status": 1,
  "product": {
    "product_name": "Nutella",
    "brands": "Ferrero",
    "image_url": "https://...",
    "nutriscore_grade": "e",
    "nutriments": {
      "energy-kcal_100g": 539,
      "fat_100g": 30.9,
      "saturated-fat_100g": 10.6,
      "carbohydrates_100g": 57.5,
      "sugars_100g": 56.3,
      "fiber_100g": 0,
      "proteins_100g": 6.3,
      "salt_100g": 0.107,
      "sodium_100g": 0.0428
    },
    "ingredients_text": "Sugar, palm oil, hazelnuts 13%, ...",
    "additives_tags": ["en:e322", "en:e476"]
  }
}
```

---

## UI Design Guidelines

### Color Palette
```
Primary:      #4CAF50 (Green - good scores)
Warning:      #FFC107 (Yellow - moderate)
Danger:       #F44336 (Red - bad scores)
Background:   #FAFAFA (Light gray)
Card:         #FFFFFF (White)
Text Primary: #212121 (Dark gray)
Text Secondary: #757575 (Medium gray)
```

### Typography
- **Headings**: Inter or system font, bold
- **Body**: Inter or system font, regular
- **Scores**: Bold, large (32-48px)

### Mobile-First Breakpoints
```css
/* Mobile (default): 0-639px */
/* Tablet: 640px+ */
/* Desktop: 1024px+ */
```

---

## Testing Checklist

### Scanner Tests
- [ ] Scan works on iOS Safari
- [ ] Scan works on Android Chrome
- [ ] Manual entry accepts valid barcodes
- [ ] Camera permission denial handled gracefully

### API Tests
- [ ] Known product returns data (barcode: 3017620422003)
- [ ] Unknown product shows "not found" message
- [ ] Network error shows retry option

### Scoring Tests
- [ ] Healthy product scores 70+
- [ ] Unhealthy product scores <40
- [ ] Additives flagged correctly

### Auth Tests
- [ ] Google Sign-In works
- [ ] Sign out clears session
- [ ] Protected routes redirect to login

### Data Tests
- [ ] Scanned product appears in history
- [ ] Favorites can be added/removed
- [ ] Lists can be created/renamed/deleted
- [ ] Personal ratings save correctly

### PWA Tests
- [ ] App installs on mobile
- [ ] Cached products viewable offline
- [ ] App icon appears correctly
- [ ] Quick Scan shortcut appears on Android (long-press icon)
- [ ] Quick Scan shortcut launches directly to scanner

### Additive Explanation Tests
- [ ] Tapping additive opens explanation modal
- [ ] Explanation shows risk level, function, and reasoning
- [ ] All three risk levels display correctly (safe/moderate/high)
- [ ] Source links open in new tab
- [ ] Modal closes properly on backdrop tap or X button

### Better Alternatives Tests
- [ ] Alternatives load for low-scoring products
- [ ] Alternatives show higher health scores than current product
- [ ] "Why it's better" text displays meaningful comparisons
- [ ] High-scoring products show "Great choice!" message
- [ ] Products with no category gracefully hide alternatives section
- [ ] Tapping alternative navigates to that product's detail page

---

## Sample Test Barcodes

| Barcode | Product | Expected Score |
|---------|---------|----------------|
| 3017620422003 | Nutella | Low (high sugar) |
| 5000112546415 | Coca-Cola | Low (sugary drink) |
| 3033710065967 | Evian Water | High (plain water) |
| 5060292302201 | Kind Bar | Moderate |
| 0070847811169 | Organic Carrots | High |

---

## Estimated Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "firebase": "^10.7.0",
    "html5-qrcode": "^2.3.8",
    "next-pwa": "^5.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## New Feature Specifications

### Feature: Additive Explanations

**Purpose**: Help users understand *why* an additive is classified as safe, moderate, or high risk in plain, non-scientific language.

**User Experience**:
1. User views product with additives listed
2. Each additive shows colored badge (green/yellow/red) + name
3. User taps an additive → modal/drawer slides up with:
   - **Name**: E621 (Monosodium Glutamate / MSG)
   - **Risk Level**: 🔴 High Risk
   - **What it does**: "A flavor enhancer that makes food taste more savory"
   - **Why this rating**: "May cause headaches, flushing, and tingling in sensitive individuals. Some studies suggest links to obesity and metabolic issues when consumed in large amounts."
   - **Found in**: "Chips, instant noodles, processed soups, fast food"
   - **Sources**: Links to WHO, FDA, or peer-reviewed studies

**Data Structure**:
```typescript
interface AdditiveInfo {
  code: string;           // "E621"
  name: string;           // "Monosodium Glutamate"
  commonName: string;     // "MSG"
  riskLevel: 'safe' | 'moderate' | 'high';
  function: string;       // What it does in food
  explanation: string;    // Why it has this risk level
  commonProducts: string[];
  sources: { name: string; url: string }[];
}
```

**Complexity**: 5/10

---

### Feature: Better Alternatives

**Purpose**: When viewing an unhealthy product, suggest healthier alternatives in the same category, prioritizing products available in Canada.

**User Experience**:
1. User scans product (e.g., Nutella, score: 25)
2. Below the product details, section appears: "Better Alternatives"
3. Carousel/list shows 3-5 products with:
   - Product image + name
   - Health score (higher than current)
   - Key improvement: "40% less sugar" or "No artificial additives"
   - Availability badge: "Available in Canada" (when applicable)
4. User can tap to view full product details

**Open Food Facts API Usage**:
```
# Search by category with better nutrition + country filter
GET https://world.openfoodfacts.org/cgi/search.pl?
  action=process
  &tagtype_0=categories
  &tag_contains_0=contains
  &tag_0=chocolate-spreads        # Same category as scanned product
  &tagtype_1=countries
  &tag_contains_1=contains
  &tag_1=canada                   # Filter for Canadian availability
  &sort_by=nutriscore_score       # Sort by nutrition score
  &page_size=20
  &json=true

# Fallback: If <3 Canadian results, also search without country filter
GET https://world.openfoodfacts.org/cgi/search.pl?
  action=process
  &tagtype_0=categories
  &tag_contains_0=contains
  &tag_0=chocolate-spreads
  &sort_by=nutriscore_score
  &page_size=10
  &json=true
```

**Logic**:
1. Get scanned product's category from Open Food Facts
2. **First pass**: Search for products in same category **available in Canada**
3. Filter to products with higher health score
4. Sort by: (1) Available in Canada, (2) Health score (highest first)
5. If fewer than 3 Canadian alternatives found:
   - **Second pass**: Search without country filter
   - Merge results, keeping Canadian products at top
6. Calculate "why it's better" (compare sugar, additives, etc.)
7. Return top 3-5 alternatives

**Data Structure**:
```typescript
interface Alternative {
  barcode: string;
  name: string;
  brand: string;
  imageUrl: string;
  healthScore: number;
  scoreDifference: number;  // +15 points
  improvements: string[];   // ["40% less sugar", "No red additives"]
  availableInCanada: boolean;
  countries: string[];      // ["Canada", "United States", "France"]
}
```

**Open Food Facts Country Data**:
- Products have `countries_tags` field: `["en:canada", "en:united-states"]`
- Filter using `tagtype_1=countries` and `tag_1=canada`
- Display availability badge based on `countries_tags` in response

**Sorting Priority**:
1. Available in Canada + Higher score (top of list)
2. Available in Canada + Lower score (still better than current)
3. Not in Canada + Higher score (fallback options)

**Edge Cases**:
- No alternatives found → "This is one of the best in its category!"
- Product already high score → "Great choice! This product scores well."
- Category not found → Don't show alternatives section
- No Canadian alternatives → Show international options with note: "These alternatives may not be available locally"

**Complexity**: 6/10

---

### Feature: Quick Scan Widget/Shortcut

**Purpose**: Let users launch directly into scanner mode from their home screen without opening the full app first.

**Implementation** (PWA Shortcuts):

**manifest.json**:
```json
{
  "name": "Yuka Food Scanner",
  "short_name": "Yuka",
  "shortcuts": [
    {
      "name": "Quick Scan",
      "short_name": "Scan",
      "description": "Scan a product barcode",
      "url": "/?mode=scan&source=shortcut",
      "icons": [
        {
          "src": "/icons/scan-shortcut-96.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    }
  ]
}
```

**App Behavior**:
- When `?mode=scan&source=shortcut` is detected:
  - Skip splash/home screen
  - Immediately request camera permission
  - Launch scanner in full-screen mode
  - After scan, show product details

**Platform Support**:
| Platform | Support |
|----------|---------|
| Android Chrome | Full support (long-press app icon) |
| iOS Safari | Limited (no shortcut menu, but can create separate home screen bookmark) |
| Desktop Chrome | Supported |

**Complexity**: 3/10

---

## Next Steps

1. **You**: Create Firebase project following the setup instructions above
2. **Me**: Initialize Next.js project and configure the tech stack
3. **Me**: Implement features phase by phase

Ready to start when you've set up Firebase!
