# Vercel Hosting

## Recommended setup

Use one Vercel project per published map, all from this same repository.

That gives you:

- one shared codebase
- separate domains and deployments
- separate environment variables per map
- no need to duplicate repos just to change the dataset

## Repo config

This repository includes [vercel.json](C:\Users\JaydonPC\Documents\GitHub\MapTests\vercel.json) with:

- `framework: "vite"`
- `buildCommand: "pnpm build"`
- `outputDirectory: "dist"`
- an SPA rewrite to `index.html` so routes like `/converter` work on refresh

## Create the Vercel project

1. Import this Git repository into Vercel.
2. Let Vercel detect it as a Vite project.
3. Keep the root directory as the repository root.
4. Leave the build command as `pnpm build` unless you want a project-specific override.

## Environment variables for the rivers deployment

Add these in the Vercel project settings:

```env
VITE_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
VITE_PUBLIC_GEOCODE_EARTH_TOKEN=your_geocode_earth_token
VITE_PUBLIC_APP_TITLE=Rivers Map
VITE_PUBLIC_DEFAULT_DATA_URL=/maps/rivers/rivers.shp
```

## Why this works

- The river shapefile bundle is committed under [public/maps/rivers](C:\Users\JaydonPC\Documents\GitHub\MapTests\public\maps\rivers).
- The app can now preload hosted `.shp` bundles plus companion files like `.shx`, `.dbf`, and `.prj`.
- Vercel serves everything inside `public/` as static files, so the preload URL stays stable after deploy.

## Publishing more maps later

For the next map, create another Vercel project from the same repo and only change:

- `VITE_PUBLIC_APP_TITLE`
- `VITE_PUBLIC_DEFAULT_DATA_URL`
- optionally the custom domain

Example:

```env
VITE_PUBLIC_APP_TITLE=Roads Map
VITE_PUBLIC_DEFAULT_DATA_URL=/maps/roads/roads.shp
```

## Notes

- If you refresh a deep route, the rewrite in `vercel.json` sends the request back to `index.html`, which is required for this SPA.
- Do not commit real tokens into `.env` files. Keep them in Vercel project settings.
