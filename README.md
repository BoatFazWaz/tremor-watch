# Tremor Watch

A real-time earthquake monitoring application that provides earthquake data visualization and analysis.

## Features

- Real-time earthquake data from USGS
- Interactive map visualization
- Location-based earthquake queries
- Historical data analysis
- Responsive design

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
GET /earthquakes/location?latitude=37.7749&longitude=-122.4194&radius=1000
```

## Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Docker (optional)

### Environment Variables

Create a `.env` file in the root directory:

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

## Project Structure

```
tremor-watch/
├── packages/
│   ├── api/           # Express.js backend
│   └── ui/            # React frontend
├── docker-compose.yml
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.