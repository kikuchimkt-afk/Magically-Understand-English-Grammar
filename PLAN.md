# Grammar Gravity - HTML Learning App Plan

## 1. Core Concept Pivot
- **Shift**: Move from Physics-based Game -> Direct HTML/DOM Manipulation Learning App.
- **Goal**: "Magic-like" understanding through visual ordering and color-coded grammar structure.

## 2. Updated Architecture
- **Tech Stack**: React + Tailwind CSS (No Matter.js).
- **Interaction**: Click-to-move (Tap word in bank -> Moves to next available slot in sentence line).
- **Visuals**:
  - High-end UI (Glassmorphism, gradients).
  - Explicit color coding for grammar (Noun=Blue, Verb=Red, Adj=Green).

## 3. Components
- [ ] `App.jsx`: Main container.
- [ ] `LearningInterface.jsx`: The primary workspace.
- [ ] `WordTile.jsx`: Individual word component with grammar styling.
- [ ] `SentenceSlot.jsx`: Drop zone/Input area.
- [ ] `Feedback.jsx`: Visual feedback on success/failure.
- [x] Configure Tailwind CSS
- [x] Setup folder structure (`components/`, `data/`, `hooks/`, `utils/`)

## 1.5. Deployment Configuration
- [x] Configure `vite.config.js` with `base: './'` for flexible hosting.
- [x] Create `vercel.json` for SPA routing.

## 4. Logic & State
- [ ] Load levels from `levels.json`.
- [ ] State: `currentLevel`, `placedWords` (array), `availableWords` (array).
- [ ] Check Logic: Compare `placedWords` grammar types against `targetPattern`.

## 5. Implementation Steps
- [ ] Create `LearningInterface`.
- [ ] Implement Word Bank & Sentence Area.
- [ ] Implement "Check Answer" logic.
- [ ] Polish UI (Animations, transitions).