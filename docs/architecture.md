# CrawlingCapys Architecture

## Overview

CrawlingCapys is a single-page browser game. All logic runs client-side with no server. The game is split across three JavaScript files loaded in order by `index.html`.

```
index.html
├── style.css
├── game.js          (loaded first)
├── game_core.js     (loaded second)
└── game_part2.js    (loaded third)
```

## File Responsibilities

### game.js — Foundation
- Global state variables (`snake`, `dir`, `score`, `goldCount`, `enemies`, `rupees`, etc.)
- `init()` — resets all state for a new game
- Item placement functions (`placeFood`, `placeWanderer`, `scheduleGoldOrange`)
- Enemy system (`spawnEnemy`, `moveEnemies`, `drawRaccoon`, `drawWombat`)
- Beaver system (`scheduleBeaver`, `moveBeaver`, `checkBeaverLogHits`)
- Storm system (`spawnStorm`, `applyStormDamage`, `getStormZones`)
- Vacuum mechanic (`vacuumSuck`, `applyVacuum`)
- Bullet system (`fireBullets`, `moveBullets`)
- Drawing helpers (`drawSpikes`, `drawBullet`, `drawBeaver`, `drawBeaverLog`, `drawStorms`)
- Utility (`awardRupees`)

### game_core.js — Game Loop & Input
- `draw()` — renders the main game screen (grid, items, enemies, snake, HUD)
- `step()` — main game tick (movement, collision, damage, pickups)
- `die()` — handles death with extra life choice prompt
- `KEY_MAP` — direction key mappings
- Primary `keydown` event listener — routes input based on current state:
  - Cutscene, death choice, sloth shop, portal shop, inventory, gamble, save menu
  - Per-landscape controls (Capy 2-5, Capy 7, Sloth 1-3)
  - Main game controls
- `resumeCurrentScreen()` — resumes the correct landscape after menu/shop
- `restartTimer()` — starts main game interval
- Canvas click handler for save menu
- Happy beaver movement and drawing (`moveHappyBeavers`, `drawHappyBeavers`)

### game_part2.js — Landscapes & Systems
- **Capy 2** — Timed arena (2:31), 41 oranges, 32 capybaras, 11 gold oranges, enemies, green beaver ally, spike reward
- **Capy 3** — Rocks, falling raindrops (blue=damage, pink=reward), sloth shop
- **Capy 4** — Frogs (jump + damage), rainstorms (deadly/teleporting with rainbow), sloth shop
- **Capy 5** — Warrior capybara RPG (5 HP, shield/sword/super sword, armored boss, victory portals, present)
- **Sloth 1/2/3** — Person character, merchant villages with 7+ sloth types per landscape
- **Capy 7** — Ocean crossing (Crossy Road style with floating logs), castle cutscene → Sloth 2
- **Save system** — `getAllGames`, `saveGame`, `loadGame`, `getGameState`, `showSaveMenu`
- **Cutscene system** — 7-scene opening story, shared castle cutscene
- **Menu system** — Main menu, game select, naming, renaming, deletion
- **Sloth merchant system** — All shop types, drawing functions, buy logic
- **Portal system** — Buy/own/use portals between landscapes
- **Gambling** — 4 mystery boxes, daily limit (localStorage), informant hint, scam sloth
- **Inventory** — Shows all owned items

## Screen Management

```
currentScreen values:
  'main'   → Main snake game
  'capy2'  → Timed arena
  'capy3'  → Rain & rocks
  'capy4'  → Frogs & storms
  'capy5'  → Warrior RPG
  'capy6'  → Sloth 1 (person)
  'capy7'  → Ocean crossing
  'capy8'  → Sloth 3 (person)
  'sloth2' → Sloth 2 (person)
```

### Landscape Transitions
- `mainGameState` preserves main game state when entering any landscape
- Only set if `!mainGameState` to prevent overwriting when jumping between sub-landscapes
- `returnToMainGame()` restores the saved state
- Each landscape has `enterCapyN()` → `stepCapyN()` → `drawCapyN()` pattern

### Timer Safety
All `setTimeout`/`setInterval` callbacks that call `draw()` must check `currentScreen === 'main'` before drawing. Wanderer and enemy respawn timers use a named function retry pattern:
```js
setTimeout(function retry() {
  if (currentScreen !== 'main') { setTimeout(retry, 1000); return; }
  placeWanderer(); draw();
}, 2170);
```

## Input Architecture

Two `keydown` listeners run for every key press:

1. **game_core.js handler** (registered first) — handles gameplay, shops, menus
2. **game_part2.js menu handler** — handles main menu, game select, naming, save browsing

Priority chain in the main handler:
```
cutscene → death choice → sloth shop → portal shop → portal use →
inventory → gamble → info/scam shop → save menu →
(menuActive check) → landscape-specific → main game
```

## Data Storage

All persistent data uses `localStorage`:

| Key | Contents |
|-----|----------|
| `crawlingCapysGames` | Array of game objects `{id, name, saves[], created}` |
| `crawlingCapysGamble` | Daily gamble count `{day, count}` |

Game state serialized by `getGameState()`:
```
snake, dir, nextDir, food, score, goldCount, wanderer, enemies,
lastEnemyThreshold, running, killCount, spikeCount, rupees,
extraLives, ownedPortals, happyBeaverCount, currentScreen, timestamp
```

## Economy

| Source | Rupees |
|--------|--------|
| Kill raccoon | +1 |
| Kill wombat | +2 |
| Kill armored raccoon (Capy 5) | +3 |
| Capy 5 victory present | +2 |

| Item | Regular | Discount (green) | Blue hour | Beaver shop |
|------|---------|-------------------|-----------|-------------|
| Gold Orange | 3R | 1R | — | — |
| Extra Life | 7R | 5R | 4R | — |
| Spike | 12R | 10R | 9R | — |
| Happy Beaver | — | — | 18R | 21R |
| Portal (11 or 13R) | — | — | — | — |
| Gamble | 3R | — | — | — |
| Gamble info | 9R | — | — | — |

## Sloth Types

| Color | Label | Function |
|-------|-------|----------|
| Brown | SHOP | Regular item shop |
| Green | -2 SALE | 2 rupee discount (Sloth 2 only) |
| Blue | -3 SALE | 3 rupee discount (time-based: 1-6:29am, 3:51-5:09pm) |
| Purple | BEAVER | Sells happy beavers |
| Yellow | GAMBLE | Mystery box game (3/day) |
| Orange | INFO | Sells gambling hint for 9R |
| Orange | INTEL | Scam — takes 5R and runs away |
| Red | PORTAL | Sells teleport portals between landscapes |

## Security

- **Gitleaks** pre-commit and pre-push hooks scan for secrets
- No API keys, tokens, or credentials in codebase
- All data is client-side localStorage only
