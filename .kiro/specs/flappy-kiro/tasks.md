# Tasks

## Task List

- [ ] 1. Project scaffold and asset wiring
  - [~] 1.1 Create `kiro-introduction-starter-kit/index.html` with a full-page canvas element, basic CSS reset, and `<script>` tag placeholder
  - [~] 1.2 Load `ghosty.png`, `jump.wav`, and `game_over.wav` from the `assets/` directory; verify assets load without errors in the browser console

- [ ] 2. Core game constants and state machine
  - [~] 2.1 Define all game constants (`GRAVITY`, `FLAP_STRENGTH`, `PIPE_SPEED`, `PIPE_INTERVAL`, `GAP_HEIGHT`, `PIPE_WIDTH`, `SCORE_BAR_HEIGHT`) as named constants at the top of the script
  - [~] 2.2 Implement the `gameState` variable with values `'START'`, `'PLAYING'`, `'GAME_OVER'` and wire it to the main game loop branching logic

- [ ] 3. Ghosty physics
  - [~] 3.1 Implement `Ghosty` object with `x`, `y`, `vy`, `width`, `height` properties and `update()`, `flap()`, `reset()` methods
  - [~] 3.2 `update()` applies `GRAVITY` to `vy` each frame and adds `vy` to `y`
  - [~] 3.3 `flap()` sets `vy = -FLAP_STRENGTH`
  - [~] 3.4 Derive `rotation` from `vy` for sprite rotation (clamped to a reasonable range)

- [ ] 4. Renderer — background, clouds, and score bar
  - [ ] 4.1 Implement `drawBackground()` filling the canvas with light blue each frame
  - [ ] 4.2 Implement `drawClouds()` rendering a fixed set of white/light-grey rounded rectangles; generate cloud positions once at init and on resize
  - [ ] 4.3 Implement `drawScoreBar(score, highScore)` rendering a dark rectangle at the bottom of the canvas with text `"Score: N | High: N"`

- [ ] 5. Renderer — Ghosty sprite
  - [ ] 5.1 Implement `drawGhosty(ghosty)` using `ctx.drawImage` with the loaded `ghosty.png`, centered on `ghosty.x, ghosty.y`
  - [ ] 5.2 Apply `ghosty.rotation` via `ctx.save()` / `ctx.translate()` / `ctx.rotate()` / `ctx.restore()` so the sprite tilts with velocity

- [ ] 6. Pipe Manager
  - [ ] 6.1 Implement `PipeManager` with `pipes` array, `update()`, and `reset()` methods
  - [ ] 6.2 `update()` scrolls all pipes left by `PIPE_SPEED` each frame, despawns pipes whose right edge is off-screen, and spawns a new pipe every `PIPE_INTERVAL` frames
  - [ ] 6.3 Implement `randomGapCenter(canvasHeight)` returning a gap center within safe bounds (both pipes fully visible, gap clear of score bar)
  - [ ] 6.4 Implement `drawPipes(pipes)` rendering each pipe pair as two green filled rectangles

- [ ] 7. Collision detection
  - [ ] 7.1 Implement `checkCollision(ghosty, pipes, canvasHeight, scoreBarHeight)` using AABB overlap against each pipe's top and bottom rectangles
  - [ ] 7.2 Add boundary collision: detect when Ghosty's bounding box goes above `y=0` or below `canvasHeight - scoreBarHeight`
  - [ ] 7.3 When collision is detected, transition `gameState` to `'GAME_OVER'`, play `game_over.wav`, and call `scoreManager.checkHighScore()`

- [ ] 8. Score Manager
  - [ ] 8.1 Implement `ScoreManager` with `score`, `highScore`, `init()`, `increment()`, `checkHighScore()`, and `reset()` methods
  - [ ] 8.2 `init()` reads `'flappyKiroHighScore'` from `localStorage`; defaults to `0` if absent or on error
  - [ ] 8.3 `checkHighScore()` updates `highScore` if `score > highScore` and writes the new value to `localStorage`; wraps in try/catch for private-browsing safety
  - [ ] 8.4 In `update()`, detect when Ghosty's x passes a pipe's right edge for the first time (`scored === false`) and call `scoreManager.increment()`; set `pipe.scored = true`

- [ ] 9. Audio Player
  - [ ] 9.1 Implement `AudioPlayer` with `playJump()` and `playGameOver()` methods using `HTMLAudioElement`; reset `currentTime` before each play to allow rapid re-triggering

- [ ] 10. Input Handler
  - [ ] 10.1 Attach `keydown` listener for Space key and `pointerdown` listener on the canvas
  - [ ] 10.2 In `'START'` state: transition to `'PLAYING'`
  - [ ] 10.3 In `'PLAYING'` state: call `ghosty.flap()` and `audioPlayer.playJump()`
  - [ ] 10.4 In `'GAME_OVER'` state: call `game.reset()` and transition to `'PLAYING'`

- [ ] 11. Start screen and game-over screen
  - [ ] 11.1 Implement `drawStartScreen()` rendering a semi-transparent overlay with title "Flappy Kiro" and instruction text
  - [ ] 11.2 Implement `drawGameOverScreen(score)` rendering a semi-transparent overlay with the final score and restart instruction

- [ ] 12. Responsive canvas
  - [ ] 12.1 On page load, set `canvas.width = window.innerWidth` and `canvas.height = window.innerHeight`
  - [ ] 12.2 Attach a `resize` event listener that updates canvas dimensions, repositions Ghosty proportionally, and regenerates cloud positions

- [ ] 13. Game loop integration
  - [ ] 13.1 Implement the main `tick(timestamp)` function called via `requestAnimationFrame`; in `'PLAYING'` state it calls `ghosty.update()`, `pipeManager.update()`, `checkCollision()`, score detection, then renders all elements
  - [ ] 13.2 In `'START'` state, render background, clouds, score bar, and start screen (no physics or pipe updates)
  - [ ] 13.3 In `'GAME_OVER'` state, render the static scene plus the game-over overlay

- [ ] 14. Reset flow
  - [ ] 14.1 Implement `game.reset()` calling `ghosty.reset()`, `pipeManager.reset()`, `scoreManager.reset()` to prepare for a new run while preserving `highScore`

- [ ] 15. Property-based tests
  - [ ] 15.1 Set up a test file (e.g., `flappy-kiro.test.js`) with fast-check installed or loaded via CDN/npm
  - [ ] 15.2 Write property test for Property 1: flap always sets vy to -FLAP_STRENGTH regardless of prior velocity
  - [ ] 15.3 Write property test for Property 2: gravity accumulates vy by GRAVITY per frame and y increases monotonically
  - [ ] 15.4 Write property test for Property 3: randomGapCenter always returns a value within safe canvas bounds
  - [ ] 15.5 Write property test for Property 4: score increments exactly once per pipe regardless of how many times the crossing is checked
  - [ ] 15.6 Write property test for Property 5: high score is always the maximum score seen across any sequence of runs
  - [ ] 15.7 Write property test for Property 6: high score localStorage round-trip preserves the integer value
  - [ ] 15.8 Write property test for Property 7: checkCollision result matches independent AABB overlap computation for arbitrary Ghosty and pipe positions
