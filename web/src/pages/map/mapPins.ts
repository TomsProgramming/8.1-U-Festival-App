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

export const MAP_PINS: MapPin[] = [
  { id: 'ponton', kind: 'stage', num: 1, x: 210, y: 295, label: 'Ponton', stageId: 'ponton' },
  { id: 'lake', kind: 'stage', num: 2, x: 455, y: 585, label: 'The Lake', stageId: 'lake' },
  { id: 'club', kind: 'stage', num: 3, x: 625, y: 350, label: 'The Club', stageId: 'club' },
  { id: 'hangar', kind: 'stage', num: 4, x: 145, y: 800, label: 'Hangar', stageId: 'hangar' },

  { id: 'ent1', kind: 'entrance', x: 400, y: 1035, label: 'Hoofdingang' },

  { id: 'f1', kind: 'food', x: 305, y: 225, label: 'Foodcourt Noord' },
  { id: 'f2', kind: 'food', x: 565, y: 440, label: 'Street Food' },
  { id: 'f3', kind: 'food', x: 250, y: 870, label: 'Hangar Bites' },
  { id: 'f4', kind: 'food', x: 525, y: 895, label: 'Foodmarkt Zuid' },

  { id: 'b1', kind: 'bar', x: 180, y: 380, label: 'Ponton Bar' },
  { id: 'b2', kind: 'bar', x: 555, y: 300, label: 'Beach Bar' },
  { id: 'b3', kind: 'bar', x: 405, y: 665, label: 'Lake Lounge' },
  { id: 'b4', kind: 'bar', x: 225, y: 730, label: 'Hangar Bar' },
  { id: 'b5', kind: 'bar', x: 615, y: 920, label: 'Main Bar' },

  { id: 'ic1', kind: 'icecream', x: 380, y: 495, label: 'IJskar' },
  { id: 'ic2', kind: 'icecream', x: 685, y: 780, label: 'IJskar' },

  { id: 't1', kind: 'toilet', x: 115, y: 255, label: 'Toilet' },
  { id: 't2', kind: 'toilet', x: 670, y: 440, label: 'Toilet' },
  { id: 't3', kind: 'toilet', x: 340, y: 760, label: 'Toilet' },
  { id: 't4', kind: 'toilet', x: 600, y: 1000, label: 'Toilet' },
  { id: 't5', kind: 'toilet', x: 65, y: 870, label: 'Toilet' },

  { id: 'fa1', kind: 'firstaid', x: 435, y: 975, label: 'EHBO-post' },
  { id: 'fa2', kind: 'firstaid', x: 495, y: 395, label: 'EHBO-post' },

  { id: 'm1', kind: 'merch', x: 330, y: 970, label: 'Merchandise' },

  { id: 'lk1', kind: 'locker', x: 490, y: 1015, label: 'Lockers' },
];
