# Farmers Market Finder 🥕

A full-stack TypeScript application for discovering and tracking farmers markets across the US.

## Features

- 🔍 **Smart Search** - Find markets by ZIP, city/state, or name
- 📍 **Geolocation** - "Near me" results with distance calculation
- ⭐ **Favorites** - Save your preferred markets (requires login)
- 🚶 **Visit Tracking** - Automatic check-in with geofencing
- 🌤️ **Weather** - 5-day forecasts for market locations
- 🗺️ **Nearby Places** - Discover cafés, parks, and attractions
- ✅ **Task Planner** - Create shopping lists and errands
- 🔒 **Social Login** - Google & Apple authentication

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- MySQL + Prisma ORM
- JWT authentication
- OpenWeather API
- Geoapify Places API

### Frontend
- React 18 + TypeScript
- Vite
- React Router v6
- Styled Components + Tailwind CSS
- Axios

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- OpenWeather API key ([Get one](https://openweathermap.org/api))
- Geoapify API key ([Get one](https://www.geoapify.com/))

### Installation

```bash
# Install backend
cd api
npm install

# Install frontend
cd ../web
npm install
```

### Database Setup

```bash
cd api

# Create database
mysql -u root -p
CREATE DATABASE farmers_market;
EXIT;

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run migrations
npm run prisma:migrate
npm run prisma:generate
```

### Sync USDA Data

```bash
# Download CSV from:
# https://catalog.data.gov/dataset/national-farmers-market-directory

# Place at: api/prisma/data/usda_farmers_markets.csv

# Run sync
npm run usda:sync
```

### Start Development

```bash
# Terminal 1: API (port 3001)
cd api
npm run dev

# Terminal 2: Web (port 3000)
cd web
npm run dev
```

Visit **http://localhost:3000**

## Environment Variables

### Backend (`api/.env`)
```env
DATABASE_URL="mysql://root:password@localhost:3306/farmers_market"
JWT_SECRET="your-super-secret-jwt-key"
OPENWEATHER_API_KEY="your-key"
GEOAPIFY_API_KEY="your-key"
PORT=3001
NODE_ENV=development
```

### Frontend (`web/.env`)
```env
VITE_API_URL=http://localhost:3001/api
```

## License

MIT