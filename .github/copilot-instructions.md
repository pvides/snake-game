# CrawlingCapys - Copilot Instructions

## Project Overview

CrawlingCapys is a browser-based snake game built with vanilla HTML5 Canvas, CSS, and JavaScript (no build tools, no frameworks, no dependencies). Open `index.html` directly in a browser to run.

## Architecture

All game logic lives in `snake.js` (~2800 lines). The game is structured around **multiple landscapes** (screens) that the player can travel between:

- **Main game** (`currentScreen === 'main'`) — core snake gameplay with enemies, powerups, weather
- **Capy 2** — orange/capybara collection arena with a timer, accessed via Enter key (costs 1 gold capybara)
- **Capy 3** — rainy landscape with rocks and falling raindrops, accessed by entering a rain cloud in main game
- **Capy 4** — forest with frogs and rainstorm portals, accessed from Capy 2's top-right corner (requires green beaver alive or creative mode)
- **Capy 5** — space-themed landscape, accessed via teleporting rainstorms in Capy 4

Each landscape follows the same pattern: `enterCapyN()` sets up state, `stepCapyN()` is the tick function, `drawCapyN()` renders. The main game uses `init()`, `step()`, and `draw()`.

### Screen Management

- `currentScreen` tracks active landscape. The main `step()` returns early if `currentScreen !== 'main'`.
- `mainGameState` preserves main game state when entering landscapes. `returnToMainGame()` restores it.
- **Critical**: Only set `mainGameState` if it's not already set (`if (!mainGameState)`) to avoid overwriting when jumping between sub-landscapes.
- All timed callbacks (setTimeout/setInterval) that call `draw()` must guard with `currentScreen === 'main'` to prevent rendering the wrong screen.
- When timers fire while in another landscape, use a retry pattern (named function + `setTimeout(self, 1000)`) instead of silently failing.

### Key State Variables

- `goldCount` — number of gold capybaras (= score)
- `spikeCount` — number of spiked tail segments (earned by clearing Capy 2)
- `creativeMode` — true when game is named "CapyBopyCIG" (no enemies, no damage, no constant movement, open portals)
- `purpleShieldEnd` — timestamp when purple shield expires (protects from everything except walls)
- `vacuumEnd` — timestamp when vacuum effect expires (sucks in items within 3 tiles)

### Enemy System (Main Game)

Enemies use a shared `enemies` array with `{ x, y, dir, type }`. Types: `'raccoon'` (lose 1 gold) and `'wombat'` (lose 2 gold). New enemies spawn every 15 gold points. Raccoons and wombats alternate (even spawns = wombat).

### Beaver System

Beavers spawn on timers (11 or 13 seconds). Types: `'hostile'` (fires red logs), `'hunter'` (chases enemies), `'gold'` (16%, fires gold logs that kill enemies + hurt player), `'purple'` (8%, fires purple logs that destroy rainclouds and give purple shield).

### Save System

- Games are stored in `localStorage` under key `'crawlingCapysGames'` as an array of game objects.
- Each game has `{ id, name, saves[], created }` with up to `MAX_SAVES` (13) save slots.
- `currentGameId` identifies the active game.
- `getGameState()` serializes snake, dir, food, score, goldCount, enemies, etc.
- Autosave runs every 34 seconds.

## Conventions

- **Canvas drawing**: All sprites (capybara, raccoon, wombat, beaver, frog) are drawn procedurally with canvas arc/rect calls — no image assets.
- **Brace balance**: After any edit to `snake.js`, verify brace count matches (equal `{` and `}` counts). A mismatch causes the entire game to fail silently with a blank canvas.
- **Timer cleanup**: When entering a new landscape, clear all main game timers (`tickInterval`, `goldOrangeTimer`, `beaverTimer`, `beaverLogInterval`, `stormTimer`, `capy4StormTimer`). When returning, reschedule them.
- **Color palette**: Dark backgrounds (#0a0a1a to #1a1a2e), green accent (#00ff88), gold (#ffd700), purple (#9b59b6). Each landscape has its own tint.
- **Grid system**: 20x20 grid cells on a 400x400 canvas (`GRID=20`, `COLS=20`, `ROWS=20`).

## Game Mechanics — Detailed Rules

### Snake

- Head is a person face. Body segments are capybara faces.
- Gold capybaras glow gold. Counted from the head outward (`i <= goldCount`).
- Spiked segments are counted from the tail inward. Spikes draw on 3 sides (not the connection side). Spikes kill raccoons/wombats on contact with normal respawn timers.
- Score = number of gold capybaras (`goldCount`).
- Wall collision and self collision = death. Purple shield does NOT protect from walls or self-collision.

### Items (Main Game)

- **Orange** 🍊 — always 1 on screen. Eating it turns the next capybara gold (+1 score). Does NOT grow the snake. Respawns immediately. When vacuum is active, new oranges avoid spawning within 3 tiles of the head.
- **Lone capybara** 🐹 — always 1 on screen. Eating it grows the snake (adds a non-gold segment). Respawns after 2.17 seconds. Uses a retry pattern if player is in another landscape.
- **Gold orange** ✨🍊 — appears randomly every 5-12 seconds, stays for 2.9 seconds, then vanishes. Eating it activates bullet shooting for 8.34 seconds. Bullets form a constant beam from head to wall in the current movement direction. Bullets kill enemies.

### Enemies (Main Game)

- **Raccoon** 🦝 — lose all non-gold capybaras (keep 1) + lose 1 gold capybara. If 0 gold = death. Respawns 6.87 seconds after being killed by bullets.
- **Wombat** 🐻 — lose all non-gold capybaras (keep 1) + lose 2 gold capybaras. If ≤1 gold = death. Respawns 4.11 seconds after being killed.
- New enemy spawns every 15 gold points. Odd spawns = raccoon, even spawns = wombat.
- Enemies move randomly, changing direction ~30% of the time per tick. Bounce off walls.
- Purple shield protects from all enemy contact and damage.

### Beaver System (Main Game)

- Spawns every 11 or 13 seconds (random). Stays for 4 seconds.
- **Hostile** (standard) — fires red logs every 0.2s in random directions. Red logs hitting snake: if gold > 0, lose 3 gold; if no gold, lose 6 non-gold capybaras; if < 6 non-gold = death.
- **Hunter** — chases nearest enemy. Catching one = enemy respawns in 7 seconds.
- **Gold** (16% chance) — fires gold logs. Gold logs damage snake same as red logs AND kill enemies on contact.
- **Purple** (8% chance) — fires purple logs. Purple logs destroy rainclouds on contact. Purple logs hitting snake gives purple shield for 6 seconds (protects from everything except walls).

### Rainstorms (Main Game)

- Triggered by eating a regular orange within 5.55 seconds of eating a gold orange. Storm appears 1 second after the regular orange.
- Cloud spawns at top of screen, 2 tiles wide. Rain falls 6 tiles below cloud.
- Anything in the rain dies (snake, enemies, beaver). Storm lasts 3 seconds.
- Entering the cloud itself (not rain) teleports to Capy 3.
- Storms avoid spawning on the snake.

### Vacuum Mechanic

- Earned by killing 4 raccoons/wombats (cumulative across bullets, beaver, and storms).
- Lasts 9 seconds. Every tick, sucks in oranges, gold oranges, and lone capybaras within 3 tiles of the head.
- Kill counter resets after each vacuum activation.

### Capy 2 Rules

- Accessed by pressing Enter (costs 1 gold capybara). Works from any landscape.
- Contains: 41 oranges (turn capybara gold), 32 lone capybaras (grow snake), 11 gold oranges (activate shooting), 6 wombats, 2 raccoons.
- 1 green "good beaver" — chases and kills wombats. Raccoons chase the beaver. Beaver dies if raccoon catches it.
- Raccoons/wombats follow same damage rules as main game.
- **Timer**: 2 minutes 31 seconds. If enemies remain when timer expires → return to main game as you left it. If all enemies cleared before timer → earn 1 spike, game saves, return to main game.
- Gold oranges activate bullet shooting (8.34s beam) that kills capy2 enemies.
- Portal to Capy 4: top-right 2x2 corner while green beaver is alive (or creative mode).

### Capy 3 Rules

- Accessed by entering a rain cloud in the main game.
- 25 randomly scattered 1x1 rocks that act as walls (instant death on collision).
- Raindrops fall from top, stop at bottom or rocks. 30% spawn chance per tick.
- Raindrop hitting snake: 50% chance lose 1 gold capybara, 50% chance lose 1 non-gold capybara.
- If snake is just head with no gold = death.
- ESC returns to main game (restores saved state).

### Capy 4 Rules

- Accessed from Capy 2's top-right 2x2 corner (requires green beaver or creative mode).
- 2 frogs that jump 2-4 tiles randomly. Danger zone = all 8 adjacent tiles (shown with faint red outline).
- Frog landing next to snake: bounce backward 2 tiles, lose 2 non-gold capybaras.
- Rainstorms appear frequently (every 2-5 seconds, last 3 seconds). Three types:
  - **Deadly** (30%) — red-tinted rain, kills on contact.
  - **Capy 3 teleport** (14%) — has rainbow on cloud, teleports to Capy 3.
  - **Capy 5 teleport** (56%) — has rainbow on cloud, teleports to Capy 5.
- Storms avoid spawning on the snake.

### Capy 5 Rules

- Accessed via teleporting rainstorms in Capy 4.
- Deep purple/space-themed with stars. Currently a blank landscape (wall/self collision only).
- ESC returns to main game.

### Creative Mode

- Activated by naming a game exactly "CapyBopyCIG".
- No enemies spawn in main game and no new enemies at score thresholds.
- Snake only moves when a direction key is pressed (no constant movement).
- `die()` is a no-op — no damage from anything (walls still block movement but don't kill).
- Capy 4 portal opens without needing the green beaver.
- Only applies to games with that exact name.

### Key Bindings

- **Arrow keys / WASD** — move snake (all landscapes)
- **Enter** — sacrifice 1 gold capybara to teleport to Capy 2 (works from any landscape)
- **ESC** — return from sub-landscape to main game
- **Tab** — return to main menu
- **=** — manual save (works in all landscapes)
- **-** — open save menu (pauses game, works in all landscapes)
- **Space** — resume from save menu
- **X** (in save menu) — enter delete mode
- **R** — restart after game over
- **1/2** — main menu: new game / play old game
