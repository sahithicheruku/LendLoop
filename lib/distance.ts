const EARTH_RADIUS_MILES = 3958.8;

export function approximateCoordinate(value: number | null) {
  return value === null ? null : Math.round(value * 100) / 100;
}

export function distanceInMiles(
  viewerLatitude: number,
  viewerLongitude: number,
  itemLatitude: number,
  itemLongitude: number,
) {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const latitudeDelta = toRadians(itemLatitude - viewerLatitude);
  const longitudeDelta = toRadians(itemLongitude - viewerLongitude);
  const viewerLatitudeRadians = toRadians(viewerLatitude);
  const itemLatitudeRadians = toRadians(itemLatitude);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(viewerLatitudeRadians) * Math.cos(itemLatitudeRadians) * Math.sin(longitudeDelta / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(miles: number) {
  return `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} miles away`;
}
