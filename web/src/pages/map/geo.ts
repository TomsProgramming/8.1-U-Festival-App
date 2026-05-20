import { MAP_H, MAP_W } from './MapIllustration';

// Approximate geografische begrenzing van het Strijkviertel-terrein.
// Hoek noord-west = SVG (0,0), hoek zuid-oost = SVG (MAP_W, MAP_H).
// Geen rotatie meegerekend; ruim genoeg voor het hele festivalterrein.
export const MAP_GEO_BOUNDS = {
  north: 52.0790,
  south: 52.0720,
  west: 5.0520,
  east: 5.0620,
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
