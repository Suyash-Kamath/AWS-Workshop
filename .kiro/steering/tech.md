# Tech Stack

## Runtime & Language
- Vanilla JavaScript (inline in HTML)
- Single `index.html` file — no external JS files, no build step
- No frameworks, no libraries, no dependencies

## Key Architecture Principle
**Keep it simple:**
- Everything lives in one HTML file
- All JavaScript is inline in a `<script>` tag
- All CSS is inline in a `<style>` tag
- No external dependencies or imports
- Just open `index.html` in a browser to play

## Testing (Optional)
The project includes optional tests for learning purposes:
- **Vitest** `^2.0.0` — test runner
- **fast-check** `^3.0.0` — property-based testing
- Tests use `game-logic.js` (a separate file for testability only)

```bash
# Run tests (if needed)
npm test
```

> **Core principle:** The game should work by simply opening `index.html` — no npm, no build, no complexity.
