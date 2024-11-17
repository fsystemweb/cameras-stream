# CamerasStream

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Libraries

- Angular 18
- Node 20.14.0
- Jest (Test suite)
- Eslint (Code smell checker)
- Prettier (Code formatter)
- Husky (Hook handler)
- Tailwind (Styling utility)

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

For styling the app, we use Tailwind because it speeds up the styling process.

We use this tools to keep the project clean.

### Husky

**Husky** is a tool that helps you run scripts at various stages of the Git workflow, such as pre-commit or pre-push. It ensures that certain tasks like linting and formatting are executed before committing code, helping maintain consistent code quality across your project.

### ESLint

**ESLint** is a static code analysis tool for identifying and fixing problems in JavaScript/TypeScript code. It helps enforce coding standards and best practices, preventing potential errors and improving code quality, you could check the **eslintrc.json** to see all the clean code rules we are using.

### Prettier

**Prettier** is an opinionated code formatter that automatically formats code to ensure consistency in style. It supports a wide range of languages and ensures that the codebase remains clean and readable without manual formatting.

### GitHub Actions

To ensure the quality and stability of our code before merging any changes into the `main` branch, we set up a **GitHub Actions workflow** to run unit tests automatically whenever a pull request (PR) is created or updated. This process is part of the Continuous Integration (CI) pipeline and helps catch issues early by verifying that all tests pass before allowing the merge.

This process ensures that code quality is maintained and reduces the chances of introducing bugs into the main branch.

## Task TODO

- [x] Add Github actions
- [x] Install jest test suite
- [x] Add eslint
- [x] Add prettier
- [x] Add husky
- [x] Add tailwind
- [x] Create Layout
- [x] Create Stream handler
- [x] Add Snapshot feature
- [x] Notification Service
- [x] Handle errors
- [ ] Add spinner
- [ ] Add Edit list
- [ ] Update readme
