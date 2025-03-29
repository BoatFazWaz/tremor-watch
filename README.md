# Tremor Watch API

A modern Express.js API backend built with TypeScript, Docker, and PNPM that provides earthquake data from the USGS API.

## Prerequisites

- Docker and Docker Compose

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development
USGS_API_URL=https://earthquake.usgs.gov/fdsnws/event/1/query
```

## Getting Started

### Development

1. Start the development server (with hot-reloading):
   ```bash
   pnpm docker:dev
   ```

2. Build the application:
   ```bash
   pnpm docker:build
   ```

3. Start production server:
   ```bash
   pnpm docker:start
   ```

4. Stop all containers:
   ```bash
   pnpm docker:down
   ```

### Testing

All testing commands run inside Docker containers:

```bash
# Run tests in watch mode
pnpm docker:test

# Run tests with coverage
pnpm docker:test:coverage

# Run tests with UI (available at http://localhost:5123)
pnpm docker:test:ui
```

### Linting

Run the linter inside Docker:
```bash
pnpm docker:lint
```

## API Endpoints

- `GET /earthquakes` - Get earthquake data for today and yesterday
- `GET /health` - Health check endpoint

## Project Structure

```
.
├── src/                # Source code
│   ├── controllers/   # Route controllers
│   ├── services/      # Business logic
│   ├── types/         # TypeScript types
│   └── index.ts       # Application entry point
├── dist/              # Compiled JavaScript
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
├── vitest.config.ts   # Vitest configuration
└── .env              # Environment variables
```

## Development

- All development tools run inside Docker containers
- The application uses TypeScript for type safety
- Express.js for the web framework
- PNPM for package management
- Docker for containerization
- ESLint for code linting
- Hot-reloading in development mode
- Multi-stage Docker builds for optimized production images
- Vitest for testing with coverage reporting
- Separate containers for development, testing, and production

## License

ISC