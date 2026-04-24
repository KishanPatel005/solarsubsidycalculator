# Design Reference (AI)

This project uses **shadcn/ui + Tailwind** with a **solar (amber/orange)** theme.

Optional: You can replace/augment these UI decisions by importing a curated `DESIGN.md`
via the `getdesign` CLI.

## Commands

```bash
# Show available brand templates
npm run design:list

# Install a reference design (writes to ./docs/DESIGN.md)
npm run design:add
```

## Notes

- This file is intentionally minimal and safe to commit.
- If you import a new template, review tokens (colors, radii, typography) and
  map them into Tailwind/shadcn variables (`src/app/globals.css`, `tailwind.config.ts`).

