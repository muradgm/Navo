# Activity image fallback

This is a temporary app-shell guard for missing activity assets.

Some destination packs can reference image paths before final generated assets exist. The fallback handler listens for failed activity-card image loads and replaces broken image elements with the existing visual fallback block.

This keeps destination validation usable while real activity images are produced in a separate asset PR.

Later, move this behavior into the React `ActivityCard` component when `main.jsx` is modularized.
