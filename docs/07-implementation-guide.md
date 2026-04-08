# PRD 07: Implementation Guide

## Overview

This guide provides step-by-step instructions for building the Kickoff Deck mini app from scratch.

---

## Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (for backend)
- Basic knowledge of React, TypeScript, and Tailwind CSS

---

## Phase 1: Project Setup (Day 1)

### 1.1 Create Vite Project

```bash
npm create vite@latest kickoff-deck -- --template react-ts
cd kickoff-deck
npm install
```

### 1.2 Install Dependencies

```bash
# Core UI
npm install @radix-ui/react-dialog @radix-ui/react-scroll-area @radix-ui/react-switch
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react

# Animations
npm install framer-motion

# Data Layer
npm install @tanstack/react-query @supabase/supabase-js

# Drag and Drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Routing
npm install react-router-dom

# Utilities
npm install date-fns
```

### 1.3 Configure Tailwind

```bash
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
npx tailwindcss init -p
```

Copy the tailwind config from **06-design-system.md**.

### 1.4 Setup shadcn/ui

```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog input scroll-area switch badge avatar progress
```

### 1.5 Configure Supabase

```typescript
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Create `.env`:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Phase 2: Database Setup (Day 1-2)

### 2.1 Run Migrations

Execute the SQL from **01-data-architecture.md** in your Supabase SQL editor:

1. Create `decks` table
2. Create all section tables (team_members, goals, metrics, etc.)
3. Enable RLS on all tables
4. Create policies

### 2.2 Verify Schema

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## Phase 3: Data Layer (Day 2-3)

### 3.1 Create Types

```typescript
// src/types/deck.ts
export interface Deck {
  id: string;
  owner_id: string;
  title: string;
  status: "draft" | "published";
  slide_order: string[];
  hidden_slides: string[];
  visible_sections: string[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  deck_id: string;
  name: string;
  title: string | null;
  email: string | null;
  photo_url: string | null;
  team_type: "internal" | "customer";
  display_order: number;
}

// ... define types for all sections
```

### 3.2 Create Data Hooks

Implement `useDeckData` and `useDeckMutations` from **01-data-architecture.md**.

### 3.3 Setup React Query

```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ... */}
    </QueryClientProvider>
  );
}
```

---

## Phase 4: Menu System (Day 3-4)

### 4.1 Create Section Components

For each section, create:
1. Display component (read-only view)
2. Item card component
3. Editor modal

Example structure:
```
src/components/deck/sections/
├── team/
│   ├── TeamSection.tsx
│   ├── TeamMemberCard.tsx
│   └── TeamMemberEditor.tsx
├── goals/
│   ├── GoalsSection.tsx
│   ├── GoalCard.tsx
│   └── GoalEditor.tsx
└── ... (repeat for each section)
```

### 4.2 Create Tab Navigation

Implement `DeckTabs` from **02-menu-system.md**.

### 4.3 Create Main Deck Page

Implement the main page that combines header, tabs, and content.

### 4.4 Add Routing

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DeckList />} />
        <Route path="/deck/:deckId" element={<DeckPage />} />
        <Route path="/deck/:deckId/present" element={<PresentPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Phase 5: Presentation Engine (Day 5-6)

### 5.1 Create Slide Components

Create a slide component for each slide type:

```
src/components/presentation/slides/
├── TitleSlide.tsx
├── AgendaSlide.tsx
├── TeamSlide.tsx
├── GoalsSlide.tsx
└── ... (all slide types)
```

### 5.2 Create Presentation Hook

Implement `usePresentation` from **03-presentation-engine.md**.

### 5.3 Create Slide Renderer

Implement `SlideRenderer` that maps slide types to components.

### 5.4 Add Controls

Implement `PresentationControls` with navigation, timer, and progress.

### 5.5 Add Keyboard Navigation

Implement keyboard shortcuts for navigation.

---

## Phase 6: Slide Management (Day 6-7)

### 6.1 Create Slide Manager Sidebar

Implement the sortable slide list from **04-slide-management.md**.

### 6.2 Add Drag and Drop

Configure dnd-kit for slide reordering.

### 6.3 Add Visibility Toggles

Implement show/hide functionality.

### 6.4 Connect to Database

Wire mutations to persist slide order and hidden slides.

---

## Phase 7: Inline Editing (Day 7-8)

### 7.1 Create Editable Components

Implement `EditableText` and `EditableList` from **05-inline-editing.md**.

### 7.2 Add Edit Mode Toggle

Create the edit mode toggle button and state.

### 7.3 Update Slide Components

Modify each slide to support both view and edit modes.

### 7.4 Add Auto-Save

Implement debounced auto-save for edits.

---

## Phase 8: Polish (Day 8-10)

### 8.1 Add Animations

Apply Framer Motion animations from **06-design-system.md**.

### 8.2 Add Loading States

Create skeleton loaders for all data-fetching states.

### 8.3 Add Error Handling

Implement error boundaries and toast notifications.

### 8.4 Responsive Design

Test and adjust for tablet/mobile viewports.

### 8.5 Accessibility

- Add ARIA labels
- Test keyboard navigation
- Verify focus states

---

## File Structure

```
src/
├── components/
│   ├── deck/
│   │   ├── DeckHeader.tsx
│   │   ├── DeckTabs.tsx
│   │   ├── DeckContent.tsx
│   │   ├── DeckSettingsModal.tsx
│   │   └── sections/
│   │       ├── team/
│   │       ├── goals/
│   │       └── ...
│   ├── presentation/
│   │   ├── SlideRenderer.tsx
│   │   ├── SlideLayout.tsx
│   │   ├── PresentationControls.tsx
│   │   ├── SlideManagerSidebar.tsx
│   │   ├── EditableText.tsx
│   │   ├── EditableList.tsx
│   │   └── slides/
│   │       ├── TitleSlide.tsx
│   │       ├── AgendaSlide.tsx
│   │       └── ...
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── ... (shadcn components)
├── hooks/
│   ├── useDeckData.ts
│   ├── useDeckMutations.ts
│   ├── usePresentation.ts
│   └── usePresentationKeyboard.ts
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   ├── animations.ts
│   └── section-definitions.ts
├── pages/
│   ├── DeckList.tsx
│   ├── Deck.tsx
│   └── Present.tsx
├── types/
│   ├── deck.ts
│   └── slides.ts
└── App.tsx
```

---

## Testing Checklist

### Functionality
- [ ] Create new deck
- [ ] Add/edit/delete items in all sections
- [ ] Reorder items via drag-and-drop
- [ ] Navigate between menu tabs
- [ ] Enter presentation mode
- [ ] Navigate slides with keyboard
- [ ] Show/hide slides
- [ ] Reorder slides
- [ ] Edit content inline
- [ ] Changes sync between menu and presentation

### Edge Cases
- [ ] Empty sections display correctly
- [ ] Long text truncates properly
- [ ] Many items (20+) perform well
- [ ] Network errors show feedback
- [ ] Concurrent edits don't conflict

### Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Focus states are visible
- [ ] Screen reader announces changes
- [ ] Color contrast meets WCAG AA

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

---

## Extending the App

### Adding a New Section

1. Create database table and RLS policies
2. Add type definitions
3. Add to `useDeckData` fetch
4. Add to `useDeckMutations`
5. Create section component
6. Create slide component
7. Add to `SECTIONS` definition
8. Add to `SLIDE_DEFINITIONS`

### Adding a New Slide Type

1. Add to `SlideType` union
2. Add to `SLIDE_DEFINITIONS`
3. Add to `DEFAULT_SLIDE_ORDER`
4. Create slide component
5. Add to `SlideRenderer` mapping
