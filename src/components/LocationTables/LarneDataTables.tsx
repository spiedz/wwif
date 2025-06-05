import React from 'react';
import { FilmographyTable, TechnicalTable, BudgetTable, WeatherTable } from '../LocationTable';

// Sample data for Larne
const larneFilmographyData = [
  { year: '2024', production: 'Game of Thrones (S8 reshoot)', location: 'Magheramorne Quarry' },
  { year: '2017', production: 'The Foreigner (Film)', location: 'Harbour & Town Centre' },
  { year: '2016', production: 'Morgan (Film)', location: 'Cairndhu House' },
  { year: '2016', production: 'The Journey (Film)', location: 'A2 Coastal Route' },
  { year: '2009', production: 'Five Minutes of Heaven (TV/Film)', location: 'Harbour streets' },
  { year: '2007', production: 'WΔZ (Film)', location: 'Quarry & woodlands' }
];

const larneTechnicalData = [
  {
    zone: 'Harbour',
    power: 'Shore power hookups',
    connectivity: 'Excellent EE/Vodafone',
    parking: '20+ truck bays'
  },
  {
    zone: 'Magheramorne',
    power: 'Generator required',
    connectivity: 'Variable/boosters needed',
    parking: 'Quarry floor + roadside'
  },
  {
    zone: 'Cairndhu',
    power: 'Period property/limited',
    connectivity: 'Good',
    parking: 'Estate grounds only'
  },
  {
    zone: 'A2 Route',
    power: 'Lay-by dependent',
    connectivity: 'Strong signal',
    parking: 'Pull-ins marked'
  }
];

const larneWeatherData = [
  { month: 'May', rainDays: '12', goldenHour: '05:30-06:30', sunrise: '05:45', sunset: '20:15' },
  { month: 'Jun', rainDays: '11', goldenHour: '05:00-06:00', sunrise: '05:15', sunset: '21:00' },
  { month: 'Jul', rainDays: '13', goldenHour: '05:15-06:15', sunrise: '05:30', sunset: '20:45' },
  { month: 'Aug', rainDays: '14', goldenHour: '06:00-07:00', sunrise: '06:15', sunset: '20:00' }
];

const larneBudgetData = [
  { service: 'Location Fee', rate: '£0-500', notes: 'Varies by complexity' },
  { service: 'Traffic Management', rate: '£300-800', notes: 'Council requirement' },
  { service: 'Security', rate: '£200-400', notes: '12hr shifts' },
  { service: 'Drone Operator', rate: '£350-600', notes: 'CAA certified + kit' },
  { service: 'Local Fixer', rate: '£150-250', notes: 'Essential for permissions' }
];

// Individual table components for easy use
export const LarneFilmographyTable = () => (
  <FilmographyTable
    title="Quick-Fire Filmography"
    subtitle="Tap any title to open the full production page"
    data={larneFilmographyData}
  />
);

export const LarneTechnicalTable = () => (
  <TechnicalTable
    title="Power & Connectivity"
    subtitle="Essential technical specifications for each filming zone"
    data={larneTechnicalData}
  />
);

export const LarneWeatherTable = () => (
  <WeatherTable
    title="Weather Windows"
    subtitle="Optimal shooting conditions throughout the season"
    data={larneWeatherData}
  />
);

export const LarneBudgetTable = () => (
  <BudgetTable
    title="Budget Estimator"
    subtitle="Prices exclude VAT. Contact FilmAntrim for package quotes."
    data={larneBudgetData}
  />
);

// Main component that renders all tables
export default function LarneDataTables() {
  return (
    <div className="space-y-8">
      {/* Featured Filmography Table */}
      <LarneFilmographyTable />
      
      {/* Technical specifications in a grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LarneTechnicalTable />
        <LarneWeatherTable />
      </div>
      
      {/* Budget table */}
      <LarneBudgetTable />
    </div>
  );
} 