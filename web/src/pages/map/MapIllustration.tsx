// Afmetingen komen 1-op-1 overeen met de viewBox van de festivalplattegrond
// (public/assets/map_base.svg). Alle pin-coördinaten, GPS-projectie en
// sim-presets rekenen in deze ruimte, dus laat ze gelijk lopen met de SVG.
export const MAP_W = 2330.58;
export const MAP_H = 1353.19;

// De echte, door de ontwerper gemaakte kaart wordt als afbeelding geladen.
// We tekenen de markers (Pin-componenten) er los overheen in MapScrollArea,
// zodat de basiskaart precies het illustratiewerk blijft zonder markers.
export function MapIllustration() {
  return (
    <img
      src="/assets/map_base.svg"
      alt=""
      draggable={false}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  );
}
