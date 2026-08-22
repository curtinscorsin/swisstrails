# Adding Corsin's location photographs

The easiest workflow does not require editing code:

1. Create one folder per destination and name it exactly like the Explore location.
2. Put the original JPEG or HEIC files in that folder. Avoid screenshots and exported thumbnails.
3. Attach the folder in Codex and write: `Add these photos to [location]. Use [filename] as the cover photo.`
4. State that the photographs are yours and that the folder name identifies the photographed destination.

Codex can then convert HEIC files to web-safe JPEG, resize very large files, record the credit as
`Corsin Curtins · Original photography`, add the cover and gallery entries, run the content audit,
and push the update.

## How the code is organised

- Image files: `apps/app/public/images/locations/[location-name]/`
- Cover and gallery order: `apps/app/data/personal-location-images.ts`

The first photograph listed for a location is its Explore-card and detail-page cover. The remaining
photographs appear in its gallery. Never assign a photograph to a location based only on visual
similarity; use Corsin's folder label or another reliable identification.
