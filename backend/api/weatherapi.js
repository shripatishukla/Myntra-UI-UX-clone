
// POST weather data to the database
const express = require('express');
const router = express.Router();
const Weather = require('../schema/weatherschema');// Assuming Weather is your Mongoose model

router.post('/', async (req, res) => {
    try {
        const { city, day, hourlyTime, temperature } = req.body;

        // Log received payload for debugging
        console.log('Received payload:', req.body);

        // Find if the city already exists
        let weatherData = await Weather.findOne({ 'cities.cityName': city });

        if (!weatherData) {
            // If the city does not exist, create a new record
            weatherData = new Weather({
                cities: [
                    {
                        cityName: city,
                        days: [
                            {
                                date: day,
                                TimelyData: [
                                    { time: hourlyTime, temperature }
                                ],
                                avgTemperature: temperature,
                                maxTemperature: temperature,
                                minTemperature: temperature
                            }
                        ]
                    }
                ]
            });
        } else {
            // City exists, now check if the day exists for that city
            const cityData = weatherData.cities.find(c => c.cityName === city);
            let dayData = cityData.days.find(d => d.date.toISOString().split('T')[0] === day);

            if (!dayData) {
                // If the day does not exist, add the new day with the temperature data
                dayData = {
                    date: day,
                    TimelyData: [
                        { time: hourlyTime, temperature }
                    ],
                    avgTemperature: temperature,
                    maxTemperature: temperature,
                    minTemperature: temperature
                };
                cityData.days.push(dayData);
            } else {
                // If the day exists, update the hourly data and recalculate temperatures
                dayData.TimelyData.push({ time: hourlyTime, temperature });

                // Recalculate the avgTemperature, maxTemperature, minTemperature
                const totalTemp = dayData.TimelyData.reduce((sum, entry) => sum + entry.temperature, 0);
                const count = dayData.TimelyData.length;
                dayData.avgTemperature = totalTemp / count;

                dayData.maxTemperature = Math.max(...dayData.TimelyData.map(entry => entry.temperature));
                dayData.minTemperature = Math.min(...dayData.TimelyData.map(entry => entry.temperature));
            }
        }

        // Save the updated weather data
        await weatherData.save();
        res.status(201).json({
          message: 'Weather data successfully saved',
          avgTemperature: weatherData.cities.find(c => c.cityName === city)
              .days.find(d => d.date.toISOString().split('T')[0] === day)
              .avgTemperature,
          minTemperature: weatherData.cities.find(c => c.cityName === city)
              .days.find(d => d.date.toISOString().split('T')[0] === day)
              .minTemperature,
          maxTemperature: weatherData.cities.find(c => c.cityName === city)
              .days.find(d => d.date.toISOString().split('T')[0] === day)
              .maxTemperature
      });
    } catch (err) {
        console.error('Error in POST /weather:', err); // Log the full error object
        res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
});

module.exports = router;
