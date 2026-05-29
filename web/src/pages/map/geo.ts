import { MAP_H, MAP_W } from './MapIllustration';

// Approximate geografische begrenzing van het Strijkviertel-terrein.
// Hoek noord-west = SVG (0,0), hoek zuid-oost = SVG (MAP_W, MAP_H).
// De rechthoek is bewust landscape (oost-west ruimer dan noord-zuid) zodat
// hij de verhouding van de plattegrond (2330 × 1353 ≈ 1,72) volgt en de
// GPS-projectie niet uitrekt. Geen rotatie meegerekend.
export const MAP_GEO_BOUNDS = {
  north: 52.0781,
  south: 52.0729,
  west: 5.0497,
  east: 5.0643,
} as const;

export interface SvgPoint {
  x: number;
  y: number;
}

export function latLngToSvg(lat: number, lng: number): SvgPoint {
  const { north, south, west, east } = MAP_GEO_BOUNDS;
  return {
    x: ((lng - west) / (east - west)) * MAP_W,
    y: ((north - lat) / (north - south)) * MAP_H,
  };
}

export function svgToLatLng(x: number, y: number): { lat: number; lng: number } {
  const { north, south, west, east } = MAP_GEO_BOUNDS;
  return {
    lat: north - (y / MAP_H) * (north - south),
    lng: west + (x / MAP_W) * (east - west),
  };
}

export function isInsideMap(p: SvgPoint, margin = 0): boolean {
  return (
    p.x >= -margin &&
    p.x <= MAP_W + margin &&
    p.y >= -margin &&
    p.y <= MAP_H + margin
  );
}
