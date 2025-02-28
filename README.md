# CamerasStream

Live Demo: https://fsystemweb.github.io/cameras-stream/

This project leverages the latest Angular features to enhance application performance, including:

- **Input Signals**: Efficiently manage reactive data flows.
- **Dependency Injection with `Inject`**: Modern and flexible service injection.
- **Optimized Change Detection**: All components utilize `changeDetection: ChangeDetectionStrategy.OnPush` to prevent performance leaks.
- **Standalone Components**: Streamlined architecture for better modularity.

## Snapshot Solution

For capturing snapshots, we use **plain TypeScript** along with the **Canvas API**, ensuring compatibility with all modern browsers.

## Stream Handling

To handle video streams, the solution integrates:

- **IPTV**: Free access to stream URLs is sourced from the IPTV repository. [IPTV Org](https://github.com/iptv-org/iptv)
- **HLS (HTTP Live Streaming)**: Enables smooth video playback on various devices and browsers.

## Libraries

- Angular 18
- Node 20.14.0
- Jest (Test suite)
- Eslint (Code smell checker)
- Prettier (Code formatter)
- Husky (Hook handler)
- Tailwind (Styling utility)
- HLS
- Toast Notification

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

# Getting Started

To set up the project for the first time:

1. **Prerequisites**: Ensure you have **Node.js (v20)** installed.

2. **Install Dependencies and Start Dev serve**:  
   Run the following command to install the required packages and start the dev serve, execute this command only one time. After installs the packages you can use `npm run start`:  
   ```bash
   npm run dummy-start

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests.

## Running lint

- Run `npm run lint` to execute eslint, to analyze your code and find code smells.
- Run `npm run lint:fix` to execute eslint and fix common issues.

## Running prettier

- Run `npm run format` to execute prettier, and format your code.

## Architecture

*For styling the app, we use Tailwind because it speeds up the styling process.

*We use these tools to keep the project clean.

### Husky

**Husky** is a tool that helps you run scripts at various stages of the Git workflow, such as pre-commit or pre-push. It ensures that certain tasks like linting and formatting are executed before committing code, helping maintain consistent code quality across your project.

### ESLint

**ESLint** is a static code analysis tool for identifying and fixing problems in JavaScript/TypeScript code. It helps enforce coding standards and best practices, preventing potential errors and improving code quality, you could check the **eslintrc.json** to see all the clean code rules we are using.

### Prettier

**Prettier** is an opinionated code formatter that automatically formats code to ensure consistency in style. It supports a wide range of languages and ensures that the codebase remains clean and readable without manual formatting.

### GitHub Actions

To ensure the quality and stability of our code before merging any changes into the `main` branch, we set up a **GitHub Actions workflow** to run unit tests automatically whenever a pull request (PR) is created or updated. This process is part of the Continuous Integration (CI) pipeline and helps catch issues early by verifying that all tests pass before allowing the merge.

This process ensures that code quality is maintained and reduces the chances of introducing bugs into the main branch.

## Legal
No video files are stored in this repository. The repository simply contains user-submitted links to publicly available video stream URLs, which to the best of our knowledge have been intentionally made publicly by the copyright holders. If any links in these playlists infringe on your rights as a copyright holder, they may be removed by sending a pull request or opening an issue. However, note that we have no control over the destination of the link, and just removing the link from the playlist will not remove its contents from the web. Note that linking does not directly infringe copyright because no copy is made on the site providing the link, and thus this is not a valid reason to send a DMCA notice to GitHub. To remove this content from the web, you should contact the web host that's actually hosting the content (not GitHub, nor the maintainers of this repository).
