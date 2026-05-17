export type StageId = 'ponton' | 'lake' | 'club' | 'hangar';

export interface Stage {
  id: StageId;
  name: string;
  short: string;
  img: string;
  color: string;
  descNL: string;
  descEN: string;
}

export interface Act {
  id: string;
  name: string;
  tag: string;
  img: string;
  bioNL: string;
  bioEN: string;
  genre: string;
}

export interface ScheduleItem {
  stageId: StageId;
  actId: string;
  start: number;
  end: number;
}

export type DayId = 'saturday' | 'sunday';

export const STAGES: Stage[] = [
  {
    id: 'ponton',
    name: 'Ponton',
    short: 'PON',
    img: '/assets/ponton.png',
    color: '#E5352B',
    descNL: 'Het openluchtpodium aan het water. De plek voor grote optredens onder de open hemel.',
    descEN: 'The open-air waterside stage. Home to the headline performances under the open sky.',
  },
  {
    id: 'lake',
    name: 'The Lake',
    short: 'LAK',
    img: '/assets/lake.png',
    color: '#2B3BE5',
    descNL: 'Drijvend podium midden op het water. Dans met je voeten in het zand.',
    descEN: 'Floating stage on the lake. Dance with your feet in the sand.',
  },
  {
    id: 'club',
    name: 'The Club',
    short: 'CLB',
    img: '/assets/club.png',
    color: '#E5A52B',
    descNL: 'Intiem, warm, elektronisch. Palmen en pulserende beats tot diep in de nacht.',
    descEN: 'Intimate, warm, electronic. Palms and pulsing beats deep into the night.',
  },
  {
    id: 'hangar',
    name: 'Hangar',
    short: 'HNG',
    img: '/assets/hangar.png',
    color: '#ffffff',
    descNL: 'Industriële dome met 360° licht en geluid. Pure rave-energie.',
    descEN: 'Industrial dome with 360° light and sound. Pure rave energy.',
  },
];

export const ACTS: Act[] = [
  {
    id: 'armin',
    name: 'Armin van Buuren',
    tag: 'Trance legend',
    img: '/assets/act_armin.png',
    bioNL: 'Vijfvoudig DJ Mag #1 en trance-pionier. Armin brengt zijn A State of Trance-ervaring naar het Ponton met een tweeuurs peak-time set.',
    bioEN: 'Five-time DJ Mag #1 and trance pioneer. Armin brings his A State of Trance experience to the Ponton with a two-hour peak-time set.',
    genre: 'Trance',
  },
  {
    id: 'martin',
    name: 'Martin Garrix',
    tag: 'EDM producer',
    img: '/assets/act_martin.png',
    bioNL: 'Nederlandse topproducer met wereldhits als Animals en Scared to Be Lonely. Verwacht grote drops en pyro.',
    bioEN: 'Dutch super-producer behind worldwide hits like Animals and Scared to Be Lonely. Expect huge drops and pyro.',
    genre: 'EDM',
  },
  {
    id: 'kensington',
    name: 'Kensington',
    tag: 'Rock anthems',
    img: '/assets/act_kensington.png',
    bioNL: 'Utrechtse rockband die stadions vol krijgt. Hymnen om je stem kwijt te raken.',
    bioEN: 'Utrecht rock band filling stadiums. Anthems to lose your voice to.',
    genre: 'Rock',
  },
  {
    id: 'within',
    name: 'Within Temptation',
    tag: 'Symphonic metal',
    img: '/assets/act_within.png',
    bioNL: 'Sinds 1996 de belichaming van Nederlandse symfonische metal. Theatraal, episch, meeslepend.',
    bioEN: 'Since 1996 the embodiment of Dutch symphonic metal. Theatrical, epic, enveloping.',
    genre: 'Metal',
  },
  {
    id: 'destaat',
    name: 'De Staat',
    tag: 'Art rock',
    img: '/assets/act_destaat.png',
    bioNL: "Onvoorspelbare art-rock uit Nijmegen. Torre Florim en z'n band zoeken de rand op — altijd.",
    bioEN: 'Unpredictable art-rock from Nijmegen. Torre Florim and his band always push the edge.',
    genre: 'Art rock',
  },
  {
    id: 'chef',
    name: "Chef'Special",
    tag: 'Pop / hip-hop',
    img: '/assets/act_chef.png',
    bioNL: 'Haarlemse feestmakers. Reggae, pop en hip-hop smelten samen tot zomerhits zoals In Your Arms.',
    bioEN: 'Haarlem party starters. Reggae, pop and hip-hop blend into summer hits like In Your Arms.',
    genre: 'Pop',
  },
  {
    id: 'nienke',
    name: 'Nienke',
    tag: 'Indie folk',
    img: '/assets/act_nienke.png',
    bioNL: 'Fluisterzachte indie folk. Akoestische gitaar, eerlijke teksten en kippenvelmomenten.',
    bioEN: 'Whisper-soft indie folk. Acoustic guitar, honest lyrics and goosebump moments.',
    genre: 'Folk',
  },
  {
    id: 'distan',
    name: 'Distan',
    tag: 'Alt pop',
    img: '/assets/act_distan.png',
    bioNL: 'Dromerige alt-pop met donkere synths en een onverwachte stem.',
    bioEN: 'Dreamy alt-pop with dark synths and an unexpected voice.',
    genre: 'Alt pop',
  },
  {
    id: 'sofia',
    name: 'Sofia de Visser',
    tag: 'Singer-songwriter',
    img: '/assets/act_sofia.png',
    bioNL: 'Intieme nummers over verlies en hoop. Een stem die je stil maakt.',
    bioEN: 'Intimate songs about loss and hope. A voice that silences the room.',
    genre: 'Singer-songwriter',
  },
  {
    id: 'prodeje',
    name: 'Prodeje',
    tag: 'Hip-hop',
    img: '/assets/act_prodeje.png',
    bioNL: 'Scherpe flows en zware beats. Een van de meest opwindende nieuwe stemmen uit de scene.',
    bioEN: 'Sharp flows and heavy beats. One of the most exciting new voices on the scene.',
    genre: 'Hip-hop',
  },
  {
    id: 'splash',
    name: 'Splash',
    tag: 'Performance',
    img: '/assets/act_splash.png',
    bioNL: 'Vijf performers, oneindige energie. Een visuele show op het raakvlak van dans, theater en muziek.',
    bioEN: 'Five performers, endless energy. A visual show at the intersection of dance, theatre and music.',
    genre: 'Performance',
  },
];

export const SCHEDULE: Record<DayId, ScheduleItem[]> = {
  saturday: [
    { stageId: 'ponton', actId: 'destaat', start: 14, end: 15 },
    { stageId: 'ponton', actId: 'kensington', start: 16, end: 17.5 },
    { stageId: 'ponton', actId: 'chef', start: 18.5, end: 20 },
    { stageId: 'ponton', actId: 'within', start: 21, end: 22.5 },
    { stageId: 'ponton', actId: 'armin', start: 23, end: 25 },
    { stageId: 'lake', actId: 'nienke', start: 13, end: 14 },
    { stageId: 'lake', actId: 'sofia', start: 15, end: 16 },
    { stageId: 'lake', actId: 'distan', start: 17, end: 18 },
    { stageId: 'lake', actId: 'splash', start: 19, end: 20 },
    { stageId: 'lake', actId: 'prodeje', start: 21, end: 22 },
    { stageId: 'club', actId: 'distan', start: 20, end: 21.5 },
    { stageId: 'club', actId: 'martin', start: 22, end: 24 },
    { stageId: 'club', actId: 'armin', start: 1, end: 3 },
    { stageId: 'hangar', actId: 'prodeje', start: 22, end: 23.5 },
    { stageId: 'hangar', actId: 'martin', start: 0.5, end: 2.5 },
  ],
  sunday: [
    { stageId: 'ponton', actId: 'nienke', start: 13, end: 14 },
    { stageId: 'ponton', actId: 'sofia', start: 14.5, end: 15.5 },
    { stageId: 'ponton', actId: 'within', start: 17, end: 18.5 },
    { stageId: 'ponton', actId: 'chef', start: 20, end: 21.5 },
    { stageId: 'ponton', actId: 'martin', start: 22.5, end: 24 },
    { stageId: 'lake', actId: 'destaat', start: 14, end: 15 },
    { stageId: 'lake', actId: 'kensington', start: 16, end: 17 },
    { stageId: 'lake', actId: 'splash', start: 18, end: 19 },
    { stageId: 'lake', actId: 'prodeje', start: 20, end: 21 },
    { stageId: 'club', actId: 'distan', start: 19, end: 20.5 },
    { stageId: 'club', actId: 'armin', start: 22, end: 24 },
    { stageId: 'hangar', actId: 'martin', start: 20, end: 22 },
    { stageId: 'hangar', actId: 'prodeje', start: 23, end: 25 },
  ],
};

export const formatHour = (h: number): string => {
  const hh = ((Math.floor(h)) % 24 + 24) % 24;
  const mm = (h % 1) * 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};
