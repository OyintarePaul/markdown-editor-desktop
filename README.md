# Markdown Editor & Previewer

A minimalist, high-performance desktop markdown editor featuring side-by-side editing and real-time live preview. The application leverages a **Vite-powered React** frontend bundled inside the ultra-lightweight **Neutralinojs** desktop framework.

---

## Features

| Feature | Description |
| :--- | :--- |
| **Dual-Pane Layout** | Write markdown on the left side and view live rendered HTML on the right side. |
| **Instant Live Preview** | High-performance, real-time rendering of markdown syntax as you type. |
| **Lightweight Native Core** | Built using [Neutralinojs](https://neutralino.js.org "Neutralinojs framework"), resulting in a tiny application footprint and minimal resource usage. |
| **Modern Frontend Stack** | Built with [React](https://react.dev "React documentation") and optimized with [Vite](https://vite.dev "Vite build tool") for instantaneous Hot Module Replacement (HMR) during development. |

---

## Prerequisites

Ensure you have the following installed globally on your machine:
* [Node.js](https://nodejs.org "Node.js download") (v16+ recommended)
* [Neutralinojs CLI](https://neutralino.js.org "Neutralino CLI documentation") (`npm install -g @neutralinojs/neu`)

---

## Getting Started

### 1. Installation
Clone the repository and install the frontend project dependencies:

```bash
git clone https://github.com/OyintarePaul/markdown-editor-desktop
cd markdown-editor-desktop/react-src
npm install
```

### 2. Development
To launch the application in development mode, run:

```bash
cd ..
neu run
```

### 3. Production Build
To compile the frontend and package the application into standalone, cross-platform native binaries (Windows, Mac, and Linux), execute:

```bash
neu build --release
```
The generated standalone executables will be available inside the `dist/` directory.
