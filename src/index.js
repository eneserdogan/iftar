#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';
import ora from 'ora';
import chalk from 'chalk';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

import { cities } from './cities.js';
import { getIftar } from './api.js';

dayjs.extend(duration);
inquirer.registerPrompt('autocomplete', autocomplete);

const CITY_NAMES = Object.keys(cities);
const DISPLAY_COLUMNS = 4;
const COLUMN_WIDTH = 15;

/**
 * Prompts user to select a city with autocomplete
 * @returns {Promise<string>} Selected city name
 */
async function promptCitySelection() {
	const { city } = await inquirer.prompt([
		{
			type: 'autocomplete',
			name: 'city',
			message: 'Select a city:',
			source: (_, input = '') =>
				Promise.resolve(
					CITY_NAMES.filter((name) =>
						name.toLowerCase().includes(input.toLowerCase())
					)
				),
		},
	]);
	return city;
}

/**
 * Resolves city data from user input
 * @param {string} input - City name input
 * @returns {object|null} City object or null if not found
 */
function resolveCity(input) {
	const normalized = input.toLowerCase().trim();
	return cities[normalized] || null;
}

/**
 * Parses duration string to hours and minutes
 * @param {string} durationStr - Duration string (e.g., "15 hours 30 minutes")
 * @returns {{ hours: number, minutes: number }|null}
 */
function parseDuration(durationStr) {
	const match = durationStr.match(/(\d+)\s+hours?\s+(\d+)\s+minutes?/);
	if (!match) return null;

	return {
		hours: parseInt(match[1], 10),
		minutes: parseInt(match[2], 10),
	};
}

/**
 * Calculates time remaining until target time
 * @param {string} timeStr - Target time in HH:mm format
 * @returns {{ hours: number, minutes: number, isPast: boolean }}
 */
function calculateTimeRemaining(timeStr) {
	const [hours, minutes] = timeStr.split(':').map(Number);
	const now = new Date();
	const target = new Date();

	target.setHours(hours, minutes, 0, 0);

	const diff = target - now;
	const isPast = diff <= 0;

	return {
		hours: Math.floor(Math.abs(diff) / (1000 * 60 * 60)),
		minutes: Math.floor((Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60)),
		isPast,
	};
}

/**
 * Formats fasting data for display
 * @param {object} fasting - Fasting data from API
 * @param {object} city - City object
 * @returns {object} Formatted display data
 */
function formatFastingData(fasting, city) {
	const duration = parseDuration(fasting.time.duration);
	const durationDisplay = duration
		? `${duration.hours}h ${duration.minutes}m`
		: fasting.time.duration;

	return {
		city: city.name,
		date: dayjs(fasting.date).format('MMMM D, YYYY (dddd)'),
		hijriDate: fasting.hijri_readable,
		suhoor: fasting.time.sahur,
		iftar: fasting.time.iftar,
		duration: durationDisplay,
	};
}

/**
 * Renders iftar information to console
 * @param {object} data - Formatted fasting data
 */
function renderOutput(data) {
	const { city, date, hijriDate, suhoor, iftar, duration } = data;
	const remaining = calculateTimeRemaining(iftar);

	console.log();
	console.log(chalk.cyan.bold('🌙  IFTAR TIME INFO'));
	console.log();
	console.log(chalk.gray('📍  City:         ') + chalk.white.bold(city));
	console.log(chalk.gray('📅  Date:         ') + chalk.white(date));
	console.log(chalk.gray('🌙  Hijri:        ') + chalk.white(hijriDate));
	console.log();
	console.log(chalk.yellow('🌅  Suhoor:       ') + chalk.white.bold(suhoor));
	console.log(chalk.magenta('🌆  Iftar:        ') + chalk.white.bold(iftar));
	console.log(chalk.gray('⏱️   Duration:     ') + chalk.white(duration));
	console.log();

	if (remaining.isPast) {
		console.log(chalk.green.bold('✅  You made it! Time to eat 🎉'));
	} else {
		console.log(
			chalk.green.bold(`⏳  ${remaining.hours}h ${remaining.minutes}m remaining!`)
		);
	}

	console.log();
}

/**
 * Displays error for unknown city
 * @param {string} input - User's city input
 */
function renderCityNotFound(input) {
	console.log(chalk.red(`City not found: ${input}`));
	console.log();
	console.log(
		chalk.gray('Available cities: ') +
		chalk.white(CITY_NAMES.slice(0, 5).join(', ') + '...')
	);
	console.log();
	console.log(
		chalk.gray('To see all cities: ') + chalk.cyan('iftar list')
	);
}

/**
 * Lists all available cities in columns
 */
function listCities() {
	console.log(chalk.blue.bold('\n📍  Available Cities:\n'));

	for (let i = 0; i < CITY_NAMES.length; i += DISPLAY_COLUMNS) {
		const row = CITY_NAMES.slice(i, i + DISPLAY_COLUMNS);
		const formatted = row.map((name) => chalk.white(name.padEnd(COLUMN_WIDTH)));
		console.log('  ' + formatted.join(''));
	}

	console.log();
}

/**
 * Main execution handler
 * @param {string} [cityInput] - Optional city name argument
 */
async function run(cityInput) {
	const selectedCity = cityInput || (await promptCitySelection());
	const spinner = ora('Fetching data...').start();

	try {
		const city = resolveCity(selectedCity);

		if (!city) {
			spinner.fail();
			renderCityNotFound(selectedCity);
			return;
		}

		const response = await getIftar(city.lat, city.lon);
		const fasting = response?.data?.fasting?.[0];

		if (!fasting) {
			spinner.warn(chalk.yellow('No fasting data available for today'));
			return;
		}

		spinner.stop();

		const displayData = formatFastingData(fasting, city);
		renderOutput(displayData);
	} catch (error) {
		spinner.fail(chalk.red(`Error: ${error.message}`));

		if (process.env.NODE_ENV === 'development') {
			console.error('\nStack trace:', error);
		}
	}
}

// CLI setup
const program = new Command();

program
	.name('iftar')
	.description('CLI tool for iftar times in Turkish cities')
	.version('2.0.0')
	.argument('[city]', 'City name (optional)')
	.action(run);

program
	.command('list')
	.description('List all available cities')
	.action(listCities);

program.parse();