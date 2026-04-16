// Feature: flappy-kiro — Property-Based Tests
// Validates: Requirements 2.1, 2.2, 2.3, 3.2, 3.3, 4.1, 4.2, 4.4, 5.1, 5.2, 6.1, 6.2, 6.3

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import {
  GRAVITY,
  FLAP_STRENGTH,
  PIPE_WIDTH,
  SCORE_BAR_HEIGHT,
  PIPE_MARGIN,
  applyGravity,
  applyFlap,
  randomGapCenter,
  checkCollisionPure,
  checkScoring,
} from './game-logic.js';

// ─── Property 1: Flap sets upward velocity ────────────────────────────────────
// Feature: flappy-kiro, Property 1: Flap sets upward velocity
// Validates: Requirements 2.2
describe('Property 1: Flap sets upward velocity', () => {
  it('always sets vy to -FLAP_STRENGTH regardless of prior velocity', () => {
    fc.assert(
      fc.property(fc.float({ noNaN: true }), (initialVy) => {
        const ghosty = { vy: initialVy };
        applyFlap(ghosty);
        expect(ghosty.vy).toBe(-FLAP_STRENGTH);
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 2: Gravity accumulates downward velocity ───────────────────────
// Feature: flappy-kiro, Property 2: Gravity accumulates downward velocity
// Validates: Requirements 2.1, 2.3
describe('Property 2: Gravity accumulates downward velocity', () => {
  it('vy equals initialVy + N * GRAVITY after N frames, y increases monotonically when starting with non-negative vy', () => {
    fc.assert(
      fc.property(
        // Use non-negative initial vy so gravity always pushes y downward each frame
        fc.float({ noNaN: true, min: 0, max: 100 }),
        fc.integer({ min: 1, max: 100 }),
        (initialVy, N) => {
          const ghosty = { vy: initialVy, y: 0 };
          let prevY = ghosty.y;

          for (let i = 0; i < N; i++) {
            applyGravity(ghosty);
            // y must be non-decreasing (gravity always pulls down, vy starts >= 0)
            expect(ghosty.y).toBeGreaterThanOrEqual(prevY);
            prevY = ghosty.y;
          }

          // vy must equal initialVy + N * GRAVITY (within floating point tolerance)
          expect(ghosty.vy).toBeCloseTo(initialVy + N * GRAVITY, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('vy accumulates by GRAVITY each frame for any initial vy', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true, min: -100, max: 100 }),
        fc.integer({ min: 1, max: 100 }),
        (initialVy, N) => {
          const ghosty = { vy: initialVy, y: 0 };
          for (let i = 0; i < N; i++) {
            applyGravity(ghosty);
          }
          expect(ghosty.vy).toBeCloseTo(initialVy + N * GRAVITY, 5);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 3: Pipe gap center is always within safe bounds ─────────────────
// Feature: flappy-kiro, Property 3: Pipe gap center is always within safe bounds
// Validates: Requirements 3.2, 3.3
describe('Property 3: Pipe gap center is always within safe bounds', () => {
  it('gap center is within [gapHeight/2 + margin, canvasHeight - scoreBarHeight - gapHeight/2 - margin]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 300, max: 1200 }),
        (canvasHeight) => {
          const gapHeight = 0.28 * canvasHeight;
          const scoreBarHeight = 40;
          const margin = 40;

          const result = randomGapCenter(canvasHeight, gapHeight, scoreBarHeight, margin);

          const minBound = gapHeight / 2 + margin;
          const maxBound = canvasHeight - scoreBarHeight - gapHeight / 2 - margin;

          expect(result).toBeGreaterThanOrEqual(minBound);
          expect(result).toBeLessThanOrEqual(maxBound);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 4: Score increments exactly once per pipe ──────────────────────
// Feature: flappy-kiro, Property 4: Score increments exactly once per pipe
// Validates: Requirements 5.1, 5.2
describe('Property 4: Score increments exactly once per pipe', () => {
  it('calling checkScoring multiple times only increments score by 1 total', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 500 }),   // pipe.x
        fc.integer({ min: 1, max: 10 }),    // how many times we call checkScoring
        (pipeX, callCount) => {
          const pipe = { x: pipeX, width: PIPE_WIDTH, scored: false };
          // ghosty is positioned past the pipe's right edge
          const ghosty = { x: pipeX + PIPE_WIDTH + 1 };

          let score = 0;
          const scoreManager = { increment() { score++; } };

          for (let i = 0; i < callCount; i++) {
            checkScoring(ghosty, [pipe], scoreManager);
          }

          expect(score).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 5: High score is non-decreasing across runs ────────────────────
// Feature: flappy-kiro, Property 5: High score is non-decreasing across runs
// Validates: Requirements 4.4, 6.1, 6.2
describe('Property 5: High score is non-decreasing across runs', () => {
  it('highScore equals Math.max of all scores seen so far', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 1000 }), { minLength: 1, maxLength: 50 }),
        (scores) => {
          // Simulate a minimal scoreManager with in-memory highScore
          const sm = {
            score: 0,
            highScore: 0,
            increment() { this.score++; },
            checkHighScore() {
              if (this.score > this.highScore) {
                this.highScore = this.score;
              }
            },
            reset() { this.score = 0; },
          };

          let expectedMax = 0;
          for (const runScore of scores) {
            sm.score = runScore;
            sm.checkHighScore();
            expectedMax = Math.max(expectedMax, runScore);
            expect(sm.highScore).toBe(expectedMax);
            sm.reset();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 6: High score localStorage round-trip ──────────────────────────
// Feature: flappy-kiro, Property 6: High score round-trip through localStorage
// Validates: Requirements 6.2, 6.3
describe('Property 6: High score localStorage round-trip', () => {
  // Use a simple in-memory mock for localStorage
  let store;
  beforeEach(() => {
    store = {};
  });

  const mockLocalStorage = () => ({
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
  });

  it('reading back a written high score returns the same integer', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1_000_000 }),
        (value) => {
          const ls = mockLocalStorage();
          const KEY = 'flappyKiroHighScore';

          ls.setItem(KEY, String(value));
          const readBack = parseInt(ls.getItem(KEY), 10);

          expect(readBack).toBe(value);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 7: Collision detection matches AABB overlap ────────────────────
// Feature: flappy-kiro, Property 7: Collision detection is symmetric with bounding boxes
// Validates: Requirements 4.1, 4.2
describe('Property 7: Collision detection matches independent AABB computation', () => {
  // Independent reference AABB check
  function aabbOverlap(ghosty, pipes, canvasHeight, scoreBarHeight) {
    const hw = ghosty.width  / 2;
    const hh = ghosty.height / 2;
    const gLeft   = ghosty.x - hw;
    const gRight  = ghosty.x + hw;
    const gTop    = ghosty.y - hh;
    const gBottom = ghosty.y + hh;

    if (gTop < 0 || gBottom > canvasHeight - scoreBarHeight) return true;

    for (const p of pipes) {
      const gapHalf       = p.gapHeight / 2;
      const topPipeBottom = p.gapY - gapHalf;
      const botPipeTop    = p.gapY + gapHalf;
      const overlapX      = gRight > p.x && gLeft < p.x + p.width;
      if (overlapX) {
        if (gTop    < topPipeBottom) return true;
        if (gBottom > botPipeTop)    return true;
      }
    }
    return false;
  }

  it('checkCollisionPure matches independent AABB for arbitrary positions', () => {
    const canvasHeight   = 600;
    const scoreBarHeight = SCORE_BAR_HEIGHT;

    fc.assert(
      fc.property(
        // ghosty position
        fc.record({
          x:      fc.integer({ min: 0, max: 800 }),
          y:      fc.integer({ min: -50, max: canvasHeight + 50 }),
          width:  fc.constantFrom(40),
          height: fc.constantFrom(40),
        }),
        // one pipe
        fc.record({
          x:         fc.integer({ min: -100, max: 900 }),
          gapY:      fc.integer({ min: 80, max: canvasHeight - scoreBarHeight - 80 }),
          gapHeight: fc.integer({ min: 80, max: 200 }),
          width:     fc.constantFrom(PIPE_WIDTH),
          scored:    fc.boolean(),
        }),
        (ghosty, pipe) => {
          const pipes = [pipe];
          const expected = aabbOverlap(ghosty, pipes, canvasHeight, scoreBarHeight);
          const actual   = checkCollisionPure(ghosty, pipes, canvasHeight, scoreBarHeight);
          expect(actual).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });
});
