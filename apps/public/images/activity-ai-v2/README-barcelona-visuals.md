# Barcelona visual bridge

This branch adds generated Barcelona activity visuals without third-party photos.

The visuals are created in `apps/public/activity-image-fallback.js` when a Barcelona activity image path is missing.

This is intentional for the current phase:

- avoids broken image icons
- keeps destination-pack filenames unchanged
- avoids unreviewed third-party images
- keeps visuals family-friendly

Later, final optimized `.webp` files can be added under this folder using the same filenames already referenced by the Barcelona pack.
