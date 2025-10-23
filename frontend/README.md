# Frontend Environment Setup (without Docker)

The frontend is a React application bootstrapped with Vite. Follow the steps below to run it directly on your machine without Docker.

## Prerequisites

- [Node.js](https://nodejs.org/) **18.x** or **20.x** (LTS releases are recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

You can verify your versions:

```bash
node --version
npm --version
```

## Install dependencies

From the repository root:

```bash
cd frontend
npm install
```

This command installs all runtime and development dependencies listed in `package.json`.

## Configure environment variables

If the frontend needs to talk to the backend during development, set the `VITE_API_BASE` variable so API requests know where to go. Create a `.env.local` file in the `frontend/` directory and add:

```bash
VITE_API_BASE=http://localhost:8000
```

Adjust the URL to match the address where your backend is running.

## Start the development server

```bash
npm run dev
```

Vite will print a local development URL (defaults to http://localhost:5173). The server features hot module replacement, so UI changes reload automatically.

## Additional scripts

- **Lint the codebase**:
  ```bash
  npm run lint
  ```
- **Create a production build** (outputs to `dist/`):
  ```bash
  npm run build
  ```
- **Preview the production build locally**:
  ```bash
  npm run preview
  ```

When you are finished, stop the dev server with `Ctrl+C`.