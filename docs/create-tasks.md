# Kickoff Deck - Implementation Tasks

This document outlines all remaining tasks to complete the Kickoff Deck mini-app based on the PRD documentation.

**Scope:** 7 sections - Executive Summary, Team, Goals & Metrics, Use Cases, Programs, Milestones, Resources

---

## ✅ Completed

- [x] **Database schema** - All tables created with public RLS policies
- [x] **Demo data seeded** - Sample deck with team members, goals, agenda, executive summary
- [x] **Basic data hooks** - `useDeckData` and `useDeckMutations` implemented
- [x] **Basic section components** - ExecutiveSummary, Team, Goals, Metrics, UseCases, Programs, Milestones, Resources
- [x] **Basic slide components** - Title, Agenda, Executive Summary, Team, Goals, Closing slides
- [x] **Presentation mode** - Full-screen view with keyboard navigation (Arrow keys, Space, Enter, Escape)
- [x] **Presentation controls** - Prev/Next buttons, progress bar, exit, edit mode toggle
- [x] **Design system foundation** - Color tokens, typography, custom deck colors in CSS

---

## ✅ Phase 1: Complete Menu System (PRD 02) - DONE

### 1.1 Section Visibility Settings
- [x] Create `DeckSettingsModal` component with section toggles
- [x] Add mutation for `updateVisibleSections` in `useDeckMutations`
- [x] Wire settings button in `DeckHeader` to open modal

### 1.2 Complete Remaining Section Components
- [x] **Use Cases Section** - Display cards with category, description, status
- [x] **Programs Section** - Display with start/end dates, status, description
- [x] **Milestones Section** - Timeline view with dates and status indicators
- [x] **Resources Section** - Link cards with icons and categories
- [x] **Metrics Section** - Metric cards with baseline/target/current values

### 1.3 Menu Edit Mode
- [x] Add edit mode toggle to `DeckHeader`
- [ ] Pass `isEditMode` prop through section components (deferred)
- [ ] Add CRUD modals/forms for each section type (deferred)

### 1.4 Keyboard Shortcuts
- [x] Create `useMenuKeyboardShortcuts` hook
- [x] Arrow Left/Right for section navigation
- [x] Cmd/Ctrl+E for edit mode toggle
- [x] Cmd/Ctrl+, for settings

---

## ✅ Phase 2: Complete Presentation Engine (PRD 03) - DONE

### 2.1 Complete Remaining Slide Components
- [x] **Metrics Slide** - Visual metric cards with status
- [x] **Use Cases Slide** - Use case cards layout
- [x] **Programs Slide** - Program cards with timelines
- [x] **Milestones Slide** - Timeline visualization
- [x] **Resources Slide** - Resource links grid
- [x] **Priorities Slide** - Business outcomes with two-column layout

### 2.2 Slide Layout Component
- [x] Create `SlideLayout` component with background decorations
- [x] Create `TwoColumnLayout` for split slides
- [x] Create `GridLayout` for card-based slides
- [x] Create `SlideHeader` for consistent slide headers

### 2.3 Presentation Timer
- [x] Create `PresentationTimer` component
- [x] Add timer display to controls bar
- [x] Timer start/pause/reset functionality

### 2.4 Empty Section Handling
- [x] Skip slides with no data in presentation mode (via `slideHasContent`)
- [x] Show "Add content" placeholder in edit mode (`EmptySlide` component)

---

## ✅ Phase 3: Slide Management (PRD 04) - DONE

### 3.1 Install Dependencies
- [x] Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`

### 3.2 Slide Manager Sidebar
- [x] Create `SlideManagerSidebar` component
- [x] Add slide list with drag handles
- [x] Add visibility toggle (eye icon) per slide
- [x] Add current slide highlighting
- [x] Animate sidebar open/close with Framer Motion

### 3.3 Drag-and-Drop Reordering
- [x] Implement sortable slide items with `@dnd-kit`
- [x] Use `arrayMove` utility from `@dnd-kit/sortable`
- [x] Wire `updateSlideOrder` mutation on drag end
- [x] Add visual feedback during drag

### 3.4 Visibility Toggles
- [x] Toggle slide visibility with eye/eye-off icons
- [x] Wire `updateHiddenSlides` mutation
- [x] Dim hidden slides in sidebar list (opacity + strikethrough)

### 3.5 Slide Overview Grid (Optional)
- [ ] Create `SlideOverviewGrid` modal (deferred)
- [ ] Show thumbnail grid of all slides (deferred)
- [ ] Click to navigate to slide (deferred)
- [ ] Keyboard shortcut `G` to open (deferred)

### 3.6 Slide Management Keyboard Shortcuts
- [x] `S` to toggle sidebar
- [x] `H` to hide/show current slide
- [x] Keyboard hints displayed in controls bar

---

## ✅ Phase 4: Inline Editing (PRD 05) - DONE

### 4.1 Editable Components
- [x] Create `EditableText` component with inline editing
- [x] Create `EditableList` component with drag-and-drop
- [x] Add hover states and edit indicators
- [x] Handle keyboard shortcuts (Enter to save, Escape to cancel)

### 4.2 Edit Mode Toggle
- [x] Create `EditModeToggle` button component
- [x] Position in top-right of presentation
- [x] `E` keyboard shortcut to toggle edit mode
- [x] Create `SavingIndicator` component

### 4.3 Update Slide Components for Editing
- [x] **Agenda Slide** - Editable items
- [x] **Executive Summary Slide** - Editable text fields
- [ ] **Team Slide** - Editable member cards (deferred)
- [ ] **Goals Slide** - Editable goal items (deferred)
- [x] **Closing Slide** - Editable next steps list with drag-and-drop
- [ ] Apply edit patterns to remaining slides (deferred)

### 4.4 Auto-Save with Debounce
- [x] Install `use-debounce` package
- [x] Create `useAutoSave` hook with 500ms debounce
- [x] Show saving indicator in presentation mode

### 4.5 Optimistic Updates
- [x] Mutations use TanStack Query's built-in optimistic update patterns
- [x] Show error toast on failure via `useToast`

---

## 📋 Phase 5: Design System Polish (PRD 06)

### 5.1 Animation Library
- [ ] Create `src/lib/animations.ts` with motion variants
- [ ] `fadeIn`, `slideInFromRight`, `slideInFromBottom`
- [ ] `staggerContainer`, `staggerItem` for lists
- [ ] `slideTransition` for slide changes

### 5.2 Presentation Backgrounds
- [ ] Create `SlideBackground` component with gradient decorations
- [ ] Add subtle patterns or noise texture
- [ ] Ensure proper contrast in light/dark modes

### 5.3 Status Badges
- [ ] Create `StatusBadge` component with variants
- [ ] Completed (green), Active (primary), Pending, Draft states
- [ ] Apply across goal, milestone, program displays

### 5.4 Loading States
- [ ] Add skeleton loaders for sections
- [ ] Add skeleton loaders for slides
- [ ] Smooth transitions on data load

### 5.5 Error States
- [ ] Add error boundary for presentation mode
- [ ] Show friendly error messages
- [ ] Add retry functionality

### 5.6 Responsive Design
- [ ] Ensure slides work on tablet viewport (768px+)
- [ ] Adjust typography scale for smaller screens
- [ ] Test touch navigation on tablet

---

## 📋 Phase 6: Data Completeness

### 6.1 Fetch All Section Data
- [x] Ensure `useDeckData` fetches all section types
- [x] Add `metrics` data fetch

### 6.2 Complete Mutations
- [ ] Add mutations for all section CRUD operations
- [ ] Add mutations for all section types in `useDeckMutations`
- [ ] Test create, update, delete for each section

### 6.3 Seed Additional Demo Data
- [x] Add demo use cases
- [x] Add demo programs
- [x] Add demo milestones
- [x] Add demo resources
- [x] Add demo metrics

---

## 📋 Phase 7: Polish & Accessibility

### 7.1 Accessibility
- [ ] Add ARIA labels to controls
- [ ] Ensure keyboard focus indicators
- [ ] Test with screen reader
- [ ] Add focus trap in modals

### 7.2 Performance
- [ ] Lazy load slide components
- [ ] Optimize re-renders with memo
- [ ] Prefetch next slide data

### 7.3 Final Testing
- [ ] Test full presentation flow
- [ ] Test all keyboard shortcuts
- [ ] Test edit mode functionality
- [ ] Test on different viewport sizes
- [ ] Test slide reordering persistence
- [ ] Test visibility toggle persistence

---

## Priority Order

1. **Phase 3: Slide Management** - Core feature for presentation control
2. **Phase 4: Inline Editing** - Enables content updates
3. **Phase 5: Design Polish** - Visual refinement
4. **Phase 7: Accessibility** - Final polish

---

## Estimated Effort

| Phase | Effort | Priority |
|-------|--------|----------|
| Phase 1: Menu System | ✅ Done | - |
| Phase 2: Presentation Engine | ✅ Done | - |
| Phase 3: Slide Management | High | P1 |
| Phase 4: Inline Editing | High | P1 |
| Phase 5: Design Polish | Low | P3 |
| Phase 6: Data Completeness | ✅ Done | - |
| Phase 7: Accessibility | Low | P3 |
