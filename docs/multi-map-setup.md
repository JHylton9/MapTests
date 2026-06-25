# Multi-Map Setup Guide

## What this project is today

This repository is a Vite + React browser application based on the open-source Placemark editor. In its current form it:

- starts as a client-side app with no backend requirement for normal local use
- stores most editing state in memory, plus a small amount of browser UI preference state
- imports map data from files, pasted text, URLs, or example datasets
- renders against Mapbox basemaps using `VITE_PUBLIC_MAPBOX_TOKEN`

It is not currently organized as a "one folder per published map" system out of the box. The app code is shared, and the map content is imported into the running app.

## Important findings from this assessment

- The app entry point is [pages/index.tsx](C:\Users\JaydonPC\Documents\GitHub\MapTests\pages\index.tsx).
- The main editing surface is [app/components/placemark_play.tsx](C:\Users\JaydonPC\Documents\GitHub\MapTests\app\components\placemark_play.tsx).
- Persistence is in-memory through [app/lib/persistence/memory.ts](C:\Users\JaydonPC\Documents\GitHub\MapTests\app\lib\persistence\memory.ts), so the app does not maintain named projects on disk by itself.
- Background basemap defaults come from [app/lib/default_layers.ts](C:\Users\JaydonPC\Documents\GitHub\MapTests\app\lib\default_layers.ts).
- Several docs and metadata files are inherited from upstream Placemark and are partially stale for this fork:
  - [docs/architecture.md](C:\Users\JaydonPC\Documents\GitHub\MapTests\docs\architecture.md)
  - [docs/docker.md](C:\Users\JaydonPC\Documents\GitHub\MapTests\docs\docker.md)
  - [public/manifest.json](C:\Users\JaydonPC\Documents\GitHub\MapTests\public\manifest.json)

## Recommended approach

Use one code repository and many map presets.

This is the cleanest option if:

- the editor behavior stays the same
- only the loaded dataset, title, branding, or token values change by occasion
- you want easier maintenance and fewer duplicated fixes

Create separate repos only if the published maps will diverge in code, dependencies, access control, or deployment ownership.

## New supported pattern

This repo now supports:

- preloading data from a repo-hosted file, like `/maps/event-a.geojson`
- setting a custom app title with environment variables
- switching variants by Vite mode

That means you can keep different occasion-specific files in `public/maps/` and launch different versions of the app with different `.env.<mode>` files.

## Suggested file layout

```text
public/
  maps/
    event-a.geojson
    event-b.geojson
    districts/
      kingston.geojson
      montego-bay.geojson
```

You can store:

- `.geojson` for the simplest workflow
- `.kml`, `.gpx`, `.csv`, `.xlsx`, and other supported formats if needed

For published presets, `GeoJSON` is the best default because it is the most predictable for browser loading.

## Environment setup

Copy `.env.example` into one file per map variant. For example:

```text
.env.local
.env.event-a
.env.event-b
```

Example `\.env.event-a`:

```env
VITE_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
VITE_PUBLIC_GEOCODE_EARTH_TOKEN=your_geocode_earth_token
VITE_PUBLIC_APP_TITLE=Event A Map
VITE_PUBLIC_DEFAULT_DATA_URL=/maps/event-a.geojson
```

Example `\.env.event-b`:

```env
VITE_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
VITE_PUBLIC_GEOCODE_EARTH_TOKEN=your_geocode_earth_token
VITE_PUBLIC_APP_TITLE=Event B Map
VITE_PUBLIC_DEFAULT_DATA_URL=/maps/event-b.geojson
```

## How to run the app

### First-time setup

1. Install Node 22.19+ or Node 24.x.
2. Install `pnpm`.
3. Install dependencies:

```powershell
pnpm install
```

### Run the default local app

```powershell
pnpm dev
```

Then open the local address Vite prints, which is usually `http://localhost:5173`.

### Run a specific map variant

```powershell
pnpm dev -- --mode event-a
```

or

```powershell
pnpm dev -- --mode event-b
```

Vite will load `.env.event-a` or `.env.event-b`, and the app will start with that map file and title.

## How to build separate publishable outputs

Build each occasion separately:

```powershell
pnpm build -- --mode event-a
```

```powershell
pnpm build -- --mode event-b
```

Each build creates a `dist/` folder for that variant. Publish one build at a time to its own hosting target.

If you want truly separate deploy artifacts at the same time, build and copy the output after each run, for example:

```text
dist-event-a/
dist-event-b/
```

## How to add a new map occasion

1. Add the new source file under `public/maps/`.
2. Create a matching `.env.<mode>` file.
3. Set `VITE_PUBLIC_DEFAULT_DATA_URL` to that file path.
4. Start the app with `pnpm dev -- --mode <mode>`.
5. Build with `pnpm build -- --mode <mode>` when ready to publish.

## Optional URL-based loading

You can also override the default dataset in the browser using `?load=`.

Examples:

- `http://localhost:5173/?load=/maps/event-a.geojson`
- `http://localhost:5173/?load=https://example.com/data/map.geojson`

Query-string loading takes priority over the environment default.

## Recommendation on repos

Do not split into separate repos yet.

Use a single repo unless one of these becomes true:

- each map needs different code
- different teams own different maps
- deployment pipelines must be isolated
- secrets or permissions differ by map

If all you need is "same app, different map files for different occasions," a single repo with per-occasion env files is the best fit.
