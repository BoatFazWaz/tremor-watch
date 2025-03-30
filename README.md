# Tremor Watch 🌍

A real-time earthquake monitoring application that provides earthquake data visualization and analysis using USGS data.

## Features

- 🌐 Real-time earthquake data from USGS
- 🗺️ Interactive map visualization with custom markers
- 📍 Location-based earthquake queries
- 📊 Historical data analysis with customizable time ranges
- 📱 Responsive design for all devices
- 🔄 Real-time data refresh
- 📈 Statistical analysis of earthquake data

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **UI Components**: Tremor + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Containerization**: Docker
- **Package Manager**: pnpm
- **Build Tool**: Turborepo
- **Deployment**: Vercel

## Project Structure

```
tremor-watch/
├── apps/
│   ├── api/           # Express.js backend
│   └── web/          # React frontend
├── packages/
│   └── shared/       # Shared utilities and types
├── .env.dev          # Development environment variables
├── .env.prod         # Production environment variables
├── .env.test         # Test environment variables
├── docker-compose.yml
├── Dockerfile
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── vercel.json
```

## API Endpoints

### Earthquakes

#### Get Recent Earthquakes
```http
GET /earthquakes
```

Returns earthquake data for the last 24 hours.

#### Get Earthquakes by Location
```http
GET /earthquakes/location
```

Query Parameters:
- `latitude` (required): Latitude coordinate (-90 to 90)
- `longitude` (required): Longitude coordinate (-180 to 180)
- `radius` (optional): Search radius in kilometers (default: 2000)
- `starttime` (optional): Start date in YYYY-MM-DD format
- `endtime` (optional): End date in YYYY-MM-DD format

Example:
```http
GET /earthquakes/location?latitude=13.7454881&longitude=100.5622455&radius=1000
```

## Development

### Prerequisites

- Node.js (v20 or higher)
- pnpm (v10.7.0 or higher)
- Docker (optional)

### Environment Setup

The project uses different environment files for different deployment scenarios:
- `.env.dev` - Development environment configuration
- `.env.prod` - Production environment configuration
- `.env.test` - Test environment configuration

Base environment variables:

```env
PORT=3000
NODE_ENV=development
USGS_API_URL=https://earthquake.usgs.gov/fdsnws/event/1/query
```

### Running Locally

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development servers:
   ```bash
   pnpm dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - API: http://localhost:3000

### Running with Docker

1. Build and start containers:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:5173
   - API: http://localhost:3000

## Testing

Run tests:
```bash
pnpm test
```

Run tests with coverage:
```bash
pnpm test:coverage
```

Run tests with UI:
```bash
pnpm test:ui
```

## Deployment

The application is configured for deployment on Vercel using the `vercel.json` configuration file. The deployment process is automated through GitHub Actions workflows.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following the [Conventional Commits](https://www.conventionalcommits.org/) specification
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/) for providing the earthquake data
- [Tremor](https://www.tremor.so/) for the beautiful UI components
- [OpenStreetMap](https://www.openstreetmap.org/) for the map data