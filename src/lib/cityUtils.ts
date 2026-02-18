/**
 * Strip prefix "KABUPATEN" atau "KOTA" dari nama kota
 * 
 * @param cityName - Nama kota dari API (misal: "KABUPATEN MADIUN", "KOTA MADIUN")
 * @returns Nama kota tanpa prefix (misal: "MADIUN")
 * 
 * @example
 * stripCityPrefix("KABUPATEN MADIUN") // "MADIUN"
 * stripCityPrefix("KOTA MADIUN") // "MADIUN"
 * stripCityPrefix("MADIUN") // "MADIUN"
 * stripCityPrefix("BANDUNG BARAT") // "BANDUNG BARAT"
 */
export function stripCityPrefix(cityName: string): string {
  if (!cityName) return '';
  
  // Trim whitespace
  const trimmed = cityName.trim();
  
  // List of prefixes to remove
  const prefixes = ['KABUPATEN ', 'KOTA ', 'KAB. ', 'KAB ', 'Kabupaten ', 'Kota '];
  
  // Check each prefix and remove if found at start
  for (const prefix of prefixes) {
    if (trimmed.toUpperCase().startsWith(prefix.toUpperCase())) {
      return trimmed.substring(prefix.length).trim();
    }
  }
  
  // No prefix found, return as is
  return trimmed;
}

/**
 * Normalize city name (uppercase without prefix)
 * 
 * @param cityName - Nama kota
 * @returns Nama kota uppercase tanpa prefix
 * 
 * @example
 * normalizeCityName("kabupaten madiun") // "MADIUN"
 * normalizeCityName("Kota Bandung") // "BANDUNG"
 */
export function normalizeCityName(cityName: string): string {
  return stripCityPrefix(cityName).toUpperCase();
}