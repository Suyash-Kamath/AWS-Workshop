# Tech Stack

## Runtime & Language
- Vanilla JavaScript (ES Modules, `type: "module"`)
- No build step — runs directly in the browser via `index.html`
- No frameworks or UI libraries

## Testing
- **Vitest** `^2.0.0` — test runner
- **fast-check** `^3.0.0` — property-based testing (PBT)
- **@vitest/coverage-v8** `^2.0.0` — code coverage

## Key Architecture Principle
Game logic is split into two layers:
- `game-logic.js` — pure functions only, no DOM, fully testable
- `index.html` (inline `<script>`) — all DOM, canvas, audio, and game loop code

Pure functions in `game-logic.js` are exported and imported by both the game and the test suite.

## Common Commands

```bash
# Run tests (single pass, no watch)
npm test

# Run tests with coverage
npx vitest --run --coverage
```

> The project has no build or compile step. Open `index.html` directly in a browser to play.
