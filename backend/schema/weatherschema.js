const mongoose = require('mongoose');

const TimelyWeatherSchema = new mongoose.Schema({
  time: { type: Date, required: true },  // Timestamp for the weather data
  temperature: { type: Number, required: true }  // Temperature value at that hour
});

const dayWeatherSchema = new mongoose.Schema({
  date: { type: Date, required: true },  // Date of the day
  TimelyData: [TimelyWeatherSchema],  // Array of hourly weather data
  avgTemperature: { type: Number },  // Average temperature for the day
  maxTemperature: { type: Number },  // Maximum temperature for the day
  minTemperature: { type: Number }   // Minimum temperature for the day
});

const cityWeatherSchema = new mongoose.Schema({
  cityName: { type: String, required: true },  // Name of the city
  days: [dayWeatherSchema]  // Array of day weather data
});

const weatherSchema = new mongoose.Schema({
  cities: [cityWeatherSchema]  // Array of city weather data
});

module.exports = mongoose.model('Weather', weatherSchema);