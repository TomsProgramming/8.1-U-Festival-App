import type { PinKind } from '../../components/pin/Pin';
import type { StageId } from '../../data/festival';

export interface MapPin {
  id: string;
  kind: PinKind;
  num?: number;
  x: number;
  y: number;
  label: string;
  stageId?: StageId;
}

// Coördinaten komen exact overeen met de markers op de originele plattegrond
// (kaart_festival_markers.svg) in de MAP_W×MAP_H-ruimte (2330.58 × 1353.19).
// De basiskaart (map_base.svg) bevat zelf geen markers; deze pins tekenen we
// er op precies dezelfde plek overheen.
export const MAP_PINS: MapPin[] = [
  // Podia (genummerd 1–4)
  { id: 'ponton', kind: 'stage', num: 1, x: 497, y: 849, label: 'Ponton', stageId: 'ponton' },
  { id: 'lake', kind: 'stage', num: 2, x: 1257, y: 615, label: 'The Lake', stageId: 'lake' },
  { id: 'club', kind: 'stage', num: 3, x: 1614, y: 529, label: 'The Club', stageId: 'club' },
  { id: 'hangar', kind: 'stage', num: 4, x: 2102, y: 231, label: 'Hangar', stageId: 'hangar' },

  // In- en uitgang
  { id: 'ent1', kind: 'entrance', x: 1607, y: 1149, label: 'Hoofdingang' },

  // Eten
  { id: 'f1', kind: 'food', x: 283, y: 849, label: 'Ponton Food' },
  { id: 'f2', kind: 'food', x: 822, y: 596, label: 'Street Food' },

  // Bars
  { id: 'b1', kind: 'bar', x: 274, y: 998, label: 'Ponton Bar' },
  { id: 'b2', kind: 'bar', x: 1197, y: 551, label: 'Lake Bar' },
  { id: 'b3', kind: 'bar', x: 1678, y: 390, label: 'Club Bar' },
  { id: 'b4', kind: 'bar', x: 1888, y: 379, label: 'Beach Bar' },

  // IJskarren
  { id: 'ic1', kind: 'icecream', x: 615, y: 908, label: 'IJskar' },
  { id: 'ic2', kind: 'icecream', x: 913, y: 567, label: 'IJskar' },
  { id: 'ic3', kind: 'icecream', x: 1458, y: 448, label: 'IJskar' },
  { id: 'ic4', kind: 'icecream', x: 1937, y: 244, label: 'IJskar' },

  // Toiletten
  { id: 't1', kind: 'toilet', x: 182, y: 1063, label: 'Toilet' },
  { id: 't2', kind: 'toilet', x: 1140, y: 384, label: 'Toilet' },
  { id: 't3', kind: 'toilet', x: 2169, y: 336, label: 'Toilet' },

  // EHBO
  { id: 'fa1', kind: 'firstaid', x: 424, y: 414, label: 'EHBO-post' },

  // Merchandise
  { id: 'm1', kind: 'merch', x: 407, y: 1064, label: 'Merchandise' },
  { id: 'm2', kind: 'merch', x: 739, y: 540, label: 'Merchandise' },
  { id: 'm3', kind: 'merch', x: 1525, y: 536, label: 'Merchandise' },

  // Lockers
  { id: 'lk1', kind: 'locker', x: 559, y: 1121, label: 'Lockers' },
  { id: 'lk2', kind: 'locker', x: 708, y: 1105, label: 'Lockers' },
];
