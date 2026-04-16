# Product: Flappy Kiro

A simple browser-based Flappy Bird-style game. Just open `index.html` and play — no installation, no build step, no complexity.

## Core Gameplay
- Player taps or presses Space to flap and keep Ghosty airborne
- Pipes scroll from right to left; Ghosty must pass through gaps
- Collision with pipes or screen boundaries ends the game
- Score increments each time Ghosty passes a pipe
- High score is persisted across sessions via `localStorage` (key: `flappyKiroHighScore`)

## Game States
- `START` — title screen, waiting for first input
- `PLAYING` — active gameplay loop
- `GAME_OVER` — death screen, shows score, waits for restart input

## Player Character
- Ghosty is rendered as a sprite (`assets/ghosty.png`) with a fallback white rounded rectangle
- Ghosty rotates based on vertical velocity (nose-up on flap, nose-down on fall)

## Assets
- `assets/ghosty.png` — player sprite
- `assets/jump.wav` — flap sound
- `assets/game_over.wav` — game over sound

## Philosophy
Keep it simple. One HTML file. No frameworks. No build tools. Just vanilla JavaScript that runs in any browser.
