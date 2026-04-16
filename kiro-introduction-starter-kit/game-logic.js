// ─── Shared Game Logic (pure functions, no DOM) ───────────────────────────────
// This module exports pure logic functions used by both index.html and tests.

export const GRAVITY         = 0.5;
export const FLAP_STRENGTH   = 9;
export const PIPE_WIDTH      = 60;
export const SCORE_BAR_HEIGHT = 40;
export const PIPE_MARGIN     = 40;

/**
 * Applies gravity to ghosty for one frame.
 * Mutates ghosty.vy and ghosty.y.
 * @param {{ vy: number, y: number }} ghosty
 */
export function applyGravity(ghosty) {
  ghosty.vy += GRAVITY;
  ghosty.y  += ghosty.vy;
}

/**
 * Applies a flap impulse to ghosty.
 * Mutates ghosty.vy.
 * @param {{ vy: number }} ghosty
 */
export function applyFlap(ghosty) {
  ghosty.vy = -FLAP_STRENGTH;
}

/**
 * Returns a random gap center Y within safe canvas bounds.
 * @param {number} canvasHeight
 * @param {number} gapHeight
 * @param {number} scoreBarHeight
 * @param {number} margin
 * @returns {number}
 */
export function randomGapCenter(canvasHeight, gapHeight, scoreBarHeight, margin) {
  const minY = gapHeight / 2 + margin;
  const maxY = canvasHeight - scoreBarHeight - gapHeight / 2 - margin;
  return minY + Math.random() * (maxY - minY);
}

/**
 * Pure AABB collision check.
 * @param {{ x: number, y: number, width: number, height: number }} ghosty
 * @param {Array<{ x: number, gapY: number, gapHeight: number, width: number }>} pipes
 * @param {number} canvasHeight
 * @param {number} scoreBarHeight
 * @returns {boolean}
 */
export function checkCollisionPure(ghosty, pipes, canvasHeight, scoreBarHeight) {
  const hw = ghosty.width  / 2;
  const hh = ghosty.height / 2;
  const gLeft   = ghosty.x - hw;
  const gRight  = ghosty.x + hw;
  const gTop    = ghosty.y - hh;
  const gBottom = ghosty.y + hh;

  // Boundary collision
  if (gTop < 0 || gBottom > canvasHeight - scoreBarHeight) {
    return true;
  }

  // Pipe collision (AABB)
  for (const p of pipes) {
    const gapHalf     = p.gapHeight / 2;
    const topPipeBottom = p.gapY - gapHalf;
    const botPipeTop    = p.gapY + gapHalf;

    const overlapX = gRight > p.x && gLeft < p.x + p.width;
    if (overlapX) {
      if (gTop    < topPipeBottom) return true;
      if (gBottom > botPipeTop)    return true;
    }
  }
  return false;
}

/**
 * Checks if ghosty has passed any unscored pipes and increments score.
 * Mutates pipe.scored and calls scoreManager.increment().
 * @param {{ x: number }} ghosty
 * @param {Array<{ x: number, width: number, scored: boolean }>} pipes
 * @param {{ increment: () => void }} scoreManager
 */
export function checkScoring(ghosty, pipes, scoreManager) {
  for (const p of pipes) {
    if (!p.scored && ghosty.x > p.x + p.width) {
      p.scored = true;
      scoreManager.increment();
    }
  }
}
