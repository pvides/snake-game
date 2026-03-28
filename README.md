# CrawlingCapys

A browser-based snake game built with vanilla HTML5 Canvas, CSS, and JavaScript — no frameworks, no build tools, no dependencies.

You play as a person leading a trail of capybaras through multiple interconnected landscapes, collecting oranges, avoiding enemies, and exploring a world of shops, portals, and mini-games.

## How to Play

Open `index.html` in a browser. That's it.

## Controls

| Key | Action |
|-----|--------|
| Arrow keys / WASD | Move |
| Enter | Sacrifice gold capybara → teleport to Capy 2 |
| ESC | Return from landscape |
| Tab | Main menu |
| = | Save game |
| - | Open saves |
| / | Inventory |
| 0 | Deploy happy beaver |
| . | Use owned portal (Sloth landscapes) |
| R | Restart after game over |

## Features

- **8 landscapes** — Main game, Capy 2 (timed arena), Capy 3 (rain & rocks), Capy 4 (frogs & storms), Capy 5 (warrior RPG), Capy 7 (ocean crossing), Sloth 1/2/3 (merchant villages)
- **Enemies** — Raccoons, wombats, armored bosses, frogs, rainstorms
- **Allies** — Hunter beavers, green beavers, happy beavers, purple shield beavers
- **Economy** — Rupees earned from kills, spent at 7 types of sloth merchants
- **Shops** — Regular, discount, blue hour sales, beaver shop, portal shop, gambling, informant, scam artist
- **Items** — Gold oranges, extra lives, spikes, happy beavers, portals
- **Save system** — Multiple games with unlimited saves, autosave every 34 seconds
- **Cutscenes** — Opening story and castle arrival sequences
- **Creative mode** — Name a game "CapyBopyCIG" for invincibility and free exploration

## Tech

- Pure vanilla JavaScript (~5000 lines across 3 files)
- All sprites drawn procedurally with Canvas 2D API
- Game state stored in `localStorage`
- No server required — runs from `file://`

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and instructions sidebar |
| `style.css` | Layout and styling |
| `game.js` | Core variables, helper functions, drawing utilities |
| `game_core.js` | Main game loop (draw/step/die), input handling |
| `game_part2.js` | All landscapes, save system, shops, cutscenes, menus |

See [docs/architecture.md](docs/architecture.md) for detailed architecture.
