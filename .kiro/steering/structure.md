# Project Structure

```
kiro-introduction-starter-kit/
├── index.html              # Entry point — game UI, canvas, audio, game loop (inline <script>)
├── game-logic.js           # Pure game logic — exported functions and constants, no DOM
├── flappy-kiro.test.js     # Property-based tests (Vitest + fast-check)
├── package.json            # Project config and dev dependencies
├── assets/
│   ├── ghosty.png          # Player sprite
│   ├── jump.wav            # Flap sound effect
│   └── game_over.wav       # Game over sound effect
└── img/
    └── example-ui.png      # Reference screenshot
```

## Conventions

- **Pure logic goes in `game-logic.js`** — any function that can be tested without a browser must live here and be exported
- **DOM/canvas/audio stays in `index.html`** — nothing in `game-logic.js` should reference `window`, `document`, or `canvas`
- **Tests import only from `game-logic.js`** — the test file never touches the DOM
- **ES Module syntax throughout** — use `import`/`export`, no CommonJS
- **No external runtime dependencies** — devDependencies only (Vitest, fast-check)
- **Constants are exported from `game-logic.js`** — shared values like `GRAVITY`, `PIPE_WIDTH`, `SCORE_BAR_HEIGHT` are defined once and imported where needed
