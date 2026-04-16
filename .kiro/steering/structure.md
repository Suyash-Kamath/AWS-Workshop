# Project Structure

```
kiro-introduction-starter-kit/
├── index.html              # Single-file game — all HTML, CSS, JS inline
├── assets/
│   ├── ghosty.png          # Player sprite
│   ├── jump.wav            # Flap sound effect
│   └── game_over.wav       # Game over sound effect
├── game-logic.js           # (Optional) Pure functions for testing only
├── flappy-kiro.test.js     # (Optional) Property-based tests
└── package.json            # (Optional) Test dependencies only
```

## Core Principle: Single HTML File

**The game is entirely self-contained in `index.html`:**
- All HTML markup
- All CSS in `<style>` tags
- All JavaScript in `<script>` tags
- No external JS files required to play
- No build step, no npm install needed to run the game

## Optional Testing Setup

The project includes optional test files for learning purposes:
- `game-logic.js` — extracted pure functions for testability
- `flappy-kiro.test.js` — property-based tests using Vitest + fast-check
- These are NOT required to play the game

## Conventions

- **Keep everything in `index.html`** — the game should work by just opening this file
- **Inline all code** — no external JS dependencies
- **Simple vanilla JavaScript** — no frameworks, no build tools
- **Assets are external** — images and audio files are OK to reference
- **localStorage for persistence** — use `localStorage.setItem/getItem` for high scores
