// BROWSER-ONLY: Uses navigator.geolocation and Intl APIs

/**
 * Gets user's current location using browser geolocation API
 * From lib/weather.ts
 */
export async function getUserLocation() {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error("Geolocation not supported"));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) =>
				resolve({
					lat: position.coords.latitude,
					lon: position.coords.longitude,
				}),
			(error) => reject(error),
		);
	});
}

/**
 * Gets user's timezone using browser Intl API
 * From lib/calendar/create-events.ts
 */
export function getUserTimezone(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
