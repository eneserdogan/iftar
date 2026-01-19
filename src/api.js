// src/api.js
import axios from 'axios';

// Don't panic! This is a free public API key from islamicapi.com
// Get your own at https://islamicapi.com if you're feeling fancy ✨
const API_KEY = 'Fpo3vhX8kfcgvntgnkX2jTTirpla8xc7OcYF2k6MTwMSRcxh';
const API_BASE_URL = 'https://islamicapi.com/api/v1/fasting/';
const DEFAULT_METHOD = 13;

/**
 * Fetches iftar/fasting times from Islamic API
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 * @returns {Promise<object>} API response data
 * @throws {Error} When API request fails
 */
export async function getIftar(lat, lon) {
	try {
		const { data } = await axios.get(API_BASE_URL, {
			params: {
				lat,
				lon,
				api_key: API_KEY,
				method: DEFAULT_METHOD,
			},
		});
		return data;
	} catch (error) {
		if (error.response) {
			throw new Error(`API error: ${error.response.status}`);
		}

		if (error.request) {
			throw new Error('No response received from API');
		}

		throw new Error(`Request failed: ${error.message}`);
	}
}