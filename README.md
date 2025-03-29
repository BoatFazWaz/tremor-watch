# Tremor Watch

A real-time earthquake monitoring application that displays earthquake data from the USGS API on an interactive map.

## Project Structure

This is a monorepo using Turborepo with the following packages:

- `packages/api`: Express.js backend service that interfaces with the USGS API
- `packages/ui`: React frontend application with interactive map visualization

## Prerequisites

- Node.js 18 or later
- pnpm 8 or later
- Docker (optional, for containerized development)

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   - Copy `.env.dev` to `.env.local` for development
   - Copy `.env.prod` to `.env.local` for production

3. Start the development servers:
   ```bash
   pnpm dev
   ```
   This will start both the API server (port 3000) and the UI development server (port 5173).

## Development

### Available Scripts

- `pnpm dev`: Start all development servers
- `pnpm build`: Build all packages
- `pnpm test`: Run tests across all packages
- `pnpm lint`: Run linting across all packages
- `pnpm clean`: Clean build artifacts

### Package-specific Scripts

#### API Package
- `pnpm --filter @tremor-watch/api dev`: Start the API server
- `pnpm --filter @tremor-watch/api test`: Run API tests
- `pnpm --filter @tremor-watch/api build`: Build the API

#### UI Package
- `pnpm --filter @tremor-watch/ui dev`: Start the UI development server
- `pnpm --filter @tremor-watch/ui build`: Build the UI
- `pnpm --filter @tremor-watch/ui preview`: Preview the built UI

## Docker Development

To run the application using Docker:

1. Build the development container:
   ```bash
   docker-compose build
   ```

2. Start the development environment:
   ```bash
   docker-compose up
   ```

## Testing

- Run all tests: `pnpm test`
- Run tests with coverage: `pnpm test:coverage`
- Run tests with UI: `pnpm test:ui`

## API Endpoints

- `GET /earthquakes`: Get recent earthquakes
- `GET /earthquakes/location`: Get earthquakes near a specific location
  - Query parameters:
    - `latitude`: Required, latitude of the location
    - `longitude`: Required, longitude of the location
    - `radius`: Optional, search radius in kilometers (default: 2000)
    - `starttime`: Optional, start time for the search
    - `endtime`: Optional, end time for the search

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

ISC