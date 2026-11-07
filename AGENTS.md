# AGENTS.md

CamerasStream: an Angular 18 app for watching live IPTV/HLS camera streams in the browser and capturing snapshots with the Canvas API. Deployed to GitHub Pages under `/cameras-stream/`.

## Commands
- Install: `npm ci` (CI) or `npm install`
- Dev server: `npm run start` (http://localhost:4200/)
- Build: `npm run build` (sets `--base-href='/cameras-stream/'`, output in `dist/`)
- Test: `npm run test` (Jest via `jest-preset-angular`, `*.spec.ts`)
- Lint: `npm run lint`, auto-fix with `npm run lint:fix`
- Format: `npm run format` (Prettier on `src/**/*.{ts,html,css,scss}`)

## Conventions
- Stack: Angular 18 standalone components, TypeScript 5.4, Tailwind CSS 3, RxJS 7.8, the HLS.js library, `ngx-toastr`. Node 20. npm (`package-lock.json`).
- Structure under `src/app/`: `core/` (layout, header, footer), `features/` (`camera-list`, `edit-camera`, `camera-panel`), `shared/` (components, models, services).
- Feature, shared and core components use `ChangeDetectionStrategy.OnPush` (only `app.component.ts` does not); selectors use the `app` prefix (kebab-case for components, camelCase for directives).
- Use signal inputs (`input()`, `input.required()`) and `inject()` rather than `@Input` and constructor injection.
- ESLint (`.eslintrc.json`) is strict: single quotes, semicolons, explicit return types, no non-null assertions, no `public` modifier, `import/group-exports` and `import/exports-last`. Prettier: single quotes, trailing commas, 2 spaces.
- Husky pre-commit runs `lint-staged` (Prettier then ESLint on staged files).
- Tests sit next to the code as `*.spec.ts`; setup file is `src/test-setup.ts`.
- CI (`.github/workflows/`): `run-tests.yml` runs `npm ci` and `npm run test`; `deploy.yml` builds and deploys.
- No video files are stored; stream URLs come from user-submitted public links.

## Boundaries
- Always: add or update a `*.spec.ts` with every behavior change, then run `npm run lint` and `npm run test`.
- Ask first: adding a dependency, changing `.eslintrc.json` rules or the `--base-href` in the build script.
- Never: commit secrets or read `.env` files.
- Never: add video files to the repo; stream entries are links only.
