export const env = {
  MAPBOX_TOKEN: import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN,
  GEOCODE_EARTH_TOKEN: import.meta.env.VITE_PUBLIC_GEOCODE_EARTH_TOKEN,
  APP_TITLE: import.meta.env.VITE_PUBLIC_APP_TITLE || "Placemark Play",
  DEFAULT_DATA_URL: import.meta.env.VITE_PUBLIC_DEFAULT_DATA_URL || "",
};
