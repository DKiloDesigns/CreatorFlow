# Troubleshooting Guide

## Tailwind CSS Issues

### Problem: Tailwind styles not being applied

If Tailwind CSS styles are not being applied correctly, try these solutions:

#### Solution 1: Check Tailwind Version Compatibility

We're using Tailwind CSS v3.x which has a different configuration than v4:

1. Make sure you have the correct version installed:
   ```bash
   cd creatorflow-app
   npm uninstall tailwindcss @tailwindcss/postcss
   npm install tailwindcss@3.4.1 postcss autoprefixer --save-dev
   ```

2. Update your `postcss.config.js` to use the standard plugin:
   ```js
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

#### Solution 2: Check imports

Make sure your `globals.css` file is properly imported in your layout file and contains the Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Solution 3: Check for conflicting CSS

Remove any test CSS files or conflicting styles that might be overriding Tailwind.

#### Solution 4: Rebuild the application

Sometimes the development server needs a complete restart:

```bash
# Stop the current server
# Then run:
cd creatorflow-app
npm run clean
npm run dev
```

#### Solution 5: Test with a simple component

Visit the test page at `/tailwind-test` in your browser to verify Tailwind is working properly.

#### Solution 6: Check Tailwind configuration

Make sure your `tailwind.config.js` or `tailwind.config.ts` has the correct content paths:

```js
content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
],
```

## Node.js Version Issues

### Problem: "You are using Node.js 16.17.0. For Next.js, Node.js version ^18.18.0 || ^19.8.0 || >= 20.0.0 is required."

This error occurs when you're trying to run the application with an older version of Node.js that's not compatible with Next.js 15+.

#### Solution 1: Use the provided shell scripts

The easiest solution is to use the shell scripts that automatically set the correct Node.js version:

```bash
# Start the development server on default port
./start-dev.sh

# Start the development server on port 3001
./start-dev-3001.sh
```

#### Solution 2: Manually switch Node.js version

If you prefer to manually switch Node.js versions:

1. Switch to Node.js v20 using nvm:
   ```bash
   nvm use 20
   ```

2. Verify the correct version is active:
   ```bash
   node -v
   # Should output v20.x.x
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

#### Solution 3: Set default Node.js version

To make Node.js v20 your default version:

```bash
nvm alias default 20
```

## Port Already in Use

### Problem: "Port 3000 is already in use"

#### Solution:

The application includes a script to automatically free up the port:

```bash
cd creatorflow-app
npm run free-port
```

Or you can use a different port:

```bash
npm run dev:3001
```

## Missing Dependencies

### Problem: Module not found errors

#### Solution:

Make sure to install dependencies in both the root and app directories:

```bash
# Root dependencies
npm install

# App dependencies
cd creatorflow-app
npm install
```

## Next.js Cache Issues

### Problem: Unexpected behavior after code changes

#### Solution:

Clear the Next.js cache:

```bash
cd creatorflow-app
npm run clean
```

Or perform a clean install:

```bash
cd creatorflow-app
npm run clean-install
```