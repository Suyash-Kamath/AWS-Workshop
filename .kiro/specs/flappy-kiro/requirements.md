# Requirements Document

## Introduction

Flappy Kiro is a browser-based retro endless scroller game. The player controls a ghost character (Ghosty) through an infinite series of pipe obstacles. Ghosty falls continuously due to gravity; the player taps or clicks to make Ghosty flap upward. The game ends when Ghosty collides with a pipe or the screen boundary. Score is tracked per run and a high score persists across sessions.

## Glossary

- **Game**: The Flappy Kiro browser application.
- **Ghosty**: The player-controlled ghost character sprite rendered using `ghosty.png`.
- **Pipe_Pair**: A pair of vertically-aligned green rectangular obstacles (one top, one bottom) with a fixed gap between them through which Ghosty must pass.
- **Gap**: The vertical opening between the top and bottom pipe of a Pipe_Pair through which Ghosty can safely fly.
- **Score**: The integer count of Pipe_Pairs Ghosty has successfully passed through in the current run.
- **High_Score**: The highest Score achieved across all runs, persisted in browser local storage.
- **Score_Bar**: The dark horizontal bar at the bottom of the canvas displaying the current Score and High_Score.
- **Cloud**: A decorative rounded-rectangle shape rendered on the background to give a sketchy, retro aesthetic.
- **Gravity**: The constant downward acceleration applied to Ghosty each frame.
- **Flap**: The upward velocity impulse applied to Ghosty when the player triggers an input.
- **Collision**: The state where Ghosty's bounding box overlaps a Pipe_Pair or the top/bottom canvas boundary.
- **Game_Over_Screen**: The overlay displayed after a Collision, showing the final Score and a restart prompt.
- **Start_Screen**: The initial overlay shown before the first run, prompting the player to begin.
- **Renderer**: The HTML5 Canvas 2D rendering component responsible for drawing all game elements each frame.
- **Physics_Engine**: The component responsible for applying Gravity and Flap impulses to Ghosty's position each frame.
- **Pipe_Manager**: The component responsible for spawning, scrolling, and despawning Pipe_Pairs.
- **Input_Handler**: The component responsible for capturing keyboard and pointer input events.
- **Score_Manager**: The component responsible for tracking Score and High_Score.
- **Audio_Player**: The component responsible for playing sound effects.

---

## Requirements

### Requirement 1: Game Initialization and Start Screen

**User Story:** As a player, I want to see a start screen when I open the game, so that I know how to begin playing.

#### Acceptance Criteria

1. WHEN the Game page loads, THE Renderer SHALL display the Start_Screen overlaid on the game canvas.
2. THE Start_Screen SHALL display the game title "Flappy Kiro" and an instruction to press Space or tap/click to start.
3. WHEN the player presses the Space key or clicks/taps the canvas while the Start_Screen is visible, THE Game SHALL transition to the active playing state and remove the Start_Screen.
4. THE Renderer SHALL draw the light blue background, Clouds, and Score_Bar during the Start_Screen state.

---

### Requirement 2: Ghosty Physics

**User Story:** As a player, I want Ghosty to fall due to gravity and flap upward when I tap or click, so that I can navigate through the pipes.

#### Acceptance Criteria

1. WHILE the game is in the active playing state, THE Physics_Engine SHALL apply a constant downward Gravity acceleration to Ghosty's vertical velocity each frame.
2. WHEN the player presses the Space key or clicks/taps the canvas during the active playing state, THE Physics_Engine SHALL apply an upward Flap impulse to Ghosty's vertical velocity, replacing any current downward velocity.
3. WHILE the game is in the active playing state, THE Physics_Engine SHALL update Ghosty's vertical position each frame based on Ghosty's current vertical velocity.
4. THE Renderer SHALL rotate Ghosty's sprite to visually reflect the direction and magnitude of Ghosty's vertical velocity (nose-up when ascending, nose-down when descending).
5. THE Audio_Player SHALL play `jump.wav` each time a Flap impulse is applied.

---

### Requirement 3: Pipe Obstacle Generation and Scrolling

**User Story:** As a player, I want pipes to scroll toward me continuously, so that the game presents an endless challenge.

#### Acceptance Criteria

1. WHILE the game is in the active playing state, THE Pipe_Manager SHALL spawn a new Pipe_Pair at the right edge of the canvas at a fixed horizontal interval.
2. THE Pipe_Manager SHALL randomize the vertical center position of each Pipe_Pair's Gap within a range that keeps both pipes fully visible on the canvas.
3. THE Gap height SHALL be a fixed value sufficient for Ghosty to pass through with skill.
4. WHILE the game is in the active playing state, THE Pipe_Manager SHALL scroll all active Pipe_Pairs from right to left at a constant speed each frame.
5. WHEN a Pipe_Pair has scrolled entirely off the left edge of the canvas, THE Pipe_Manager SHALL remove that Pipe_Pair from the active set.
6. THE Renderer SHALL draw each Pipe_Pair as a pair of green filled rectangles (top pipe extending downward from the top of the canvas, bottom pipe extending upward from the bottom of the canvas) with the Gap between them.

---

### Requirement 4: Collision Detection and Game Over

**User Story:** As a player, I want the game to end when Ghosty hits a pipe or boundary, so that the game has meaningful stakes.

#### Acceptance Criteria

1. WHEN Ghosty's bounding box overlaps any Pipe_Pair's top or bottom rectangle, THE Game SHALL transition to the game-over state.
2. WHEN Ghosty's vertical position causes Ghosty's bounding box to extend above the top canvas boundary or below the Score_Bar, THE Game SHALL transition to the game-over state.
3. WHEN the game transitions to the game-over state, THE Audio_Player SHALL play `game_over.wav`.
4. WHEN the game transitions to the game-over state, THE Score_Manager SHALL compare the current Score to the High_Score and update the High_Score if the current Score is greater.
5. WHEN the game transitions to the game-over state, THE Renderer SHALL display the Game_Over_Screen showing the final Score and an instruction to press Space or tap/click to restart.

---

### Requirement 5: Scoring

**User Story:** As a player, I want my score to increment each time I pass through a pipe gap, so that I can measure my progress.

#### Acceptance Criteria

1. WHEN Ghosty's horizontal position passes the right edge of a Pipe_Pair's Gap for the first time, THE Score_Manager SHALL increment the Score by 1.
2. THE Score_Manager SHALL ensure each Pipe_Pair contributes to the Score at most once per run.
3. WHILE the game is in the active playing state or the game-over state, THE Renderer SHALL display the current Score and High_Score in the Score_Bar.
4. THE Score_Bar SHALL display the text in the format "Score: [N] | High: [N]" where [N] is the respective integer value.

---

### Requirement 6: High Score Persistence

**User Story:** As a player, I want my high score to persist between sessions, so that I can track my best performance over time.

#### Acceptance Criteria

1. WHEN the Game page loads, THE Score_Manager SHALL read the stored High_Score from browser local storage and initialize the High_Score to that value, or 0 if no stored value exists.
2. WHEN the High_Score is updated, THE Score_Manager SHALL write the new High_Score value to browser local storage.
3. THE Score_Manager SHALL store the High_Score under a consistent local storage key so that the value survives page reloads.

---

### Requirement 7: Retro Visual Style

**User Story:** As a player, I want the game to have a retro sketchy visual style, so that it feels charming and cohesive.

#### Acceptance Criteria

1. THE Renderer SHALL fill the canvas background with a solid light blue color each frame before drawing other elements.
2. THE Renderer SHALL draw a fixed number of Cloud shapes as white or light-grey filled rounded rectangles positioned at varying horizontal and vertical positions across the background.
3. THE Renderer SHALL draw the Score_Bar as a dark filled rectangle spanning the full width of the canvas at the bottom.
4. THE Renderer SHALL render Ghosty using the `ghosty.png` sprite image centered on Ghosty's position.
5. THE Renderer SHALL draw Pipe_Pairs using a solid green fill with no additional texture or gradient.

---

### Requirement 8: Restart

**User Story:** As a player, I want to restart the game after a game over, so that I can try to beat my high score.

#### Acceptance Criteria

1. WHEN the player presses the Space key or clicks/taps the canvas while the Game_Over_Screen is visible, THE Game SHALL reset the Score to 0, remove all active Pipe_Pairs, return Ghosty to the starting position, and transition to the active playing state.
2. WHEN the game restarts, THE Score_Manager SHALL retain the current High_Score value without resetting it.
3. WHEN the game restarts, THE Pipe_Manager SHALL begin spawning new Pipe_Pairs from the right edge of the canvas as in a fresh run.

---

### Requirement 9: Responsive Canvas

**User Story:** As a player, I want the game canvas to fit my browser window, so that I can play comfortably on different screen sizes.

#### Acceptance Criteria

1. THE Game SHALL render on an HTML5 Canvas element embedded in a browser page with no external framework dependencies.
2. WHEN the browser window is resized, THE Renderer SHALL adjust the canvas dimensions to match the new window size and reposition game elements proportionally.
3. THE Game SHALL be playable on both desktop browsers (keyboard + mouse) and mobile browsers (touch input) without requiring installation.
