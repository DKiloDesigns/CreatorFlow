# CreatorFlow

A Next.js social media management platform with content scheduling, OAuth integration, and Stripe billing functionality.

## Project Structure

This is a monorepo setup with the main application located in the `creatorflow-app` directory.

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm v10 or higher

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install app dependencies
cd creatorflow-app
npm install
```

### Development

You can run the development server from the root directory using one of these methods:

#### Method 1: Using npm scripts (requires Node.js v20)

```bash
# Start the development server on default port
npm run dev

# Start the development server on port 3001
npm run dev:3001
```

#### Method 2: Using shell scripts (recommended)

These scripts will automatically use the correct Node.js version via nvm:

```bash
# Start the development server on default port
./start-dev.sh

# Start the development server on port 3001
./start-dev-3001.sh
```

These commands will automatically:
1. Free up the required port if it's in use
2. Clean Next.js cache
3. Start the Next.js development server

### Environment Variables

Make sure to set up your environment variables in the `.env` file. See `.env.example` for required variables.

### Building for Production

```bash
npm run build
```

### Starting Production Server

```bash
npm run start
```

## Features

- Social media account connections
- Content scheduling and publishing
- OAuth authentication
- Stripe billing integration
- Responsive dashboard

## License

This project is proprietary and confidential.