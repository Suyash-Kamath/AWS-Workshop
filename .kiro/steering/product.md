# Product: Flappy Kiro

A browser-based Flappy Bird-style game where the player controls "Ghosty" — a ghost character — navigating through pipe obstacles.

## Core Gameplay
- Player taps/presses Space to flap and keep Ghosty airborne
- Pipes scroll from right to left; Ghosty must pass through gaps
- Collision with pipes or boundaries ends the game
- Score increments each time Ghosty passes a pipe
- High score is persisted across sessions via localStorage

## Game States
- `START` — title screen, waiting for first input
- `PLAYING` — active gameplay loop
- `GAME_OVER` — death screen, shows score, waits for restart input
