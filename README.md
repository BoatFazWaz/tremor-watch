# Tremor Watch

A modern web application for real-time earthquake monitoring and visualization.

## Live Demo

Visit the live application at [https://tremor-watch.vercel.app/](https://tremor-watch.vercel.app/)

## Features

- **Real-time Earthquake Data**: Track recent seismic activity worldwide
- **Interactive Map**: Visual representation of earthquake locations with customizable radius
- **Advanced Filtering**:
  - Filter by magnitude (≥3.0, ≥4.0, ≥5.0, ≥6.0)
  - Search by location
  - Date range selection
- **Detailed Information**: Access comprehensive earthquake details including:
  - Magnitude and depth
  - Location coordinates
  - Distance from selected point
  - Timestamp
- **Responsive Design**: Seamless experience across desktop and mobile devices

## Technology Stack

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - Leaflet for map visualization
  - React DatePicker for date selection
  - Shadcn UI components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tremor-watch.git
cd tremor-watch
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Map Navigation**:
   - Pan and zoom the map to explore different regions
   - Click on earthquake markers for detailed information

2. **Filtering**:
   - Use magnitude buttons to filter earthquakes by strength
   - Enter location names in the search box
   - Select a date range to view historical data

3. **Radius Selection**:
   - Adjust the radius slider to define your area of interest
   - View earthquakes within the specified distance from the center point

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- USGS for providing earthquake data
- OpenStreetMap for map tiles
- All contributors who have helped shape this project

---

Made with ❤️ by [Your Name/Team]