export type StageId = 'ponton' | 'lake' | 'club' | 'hangar';

export interface Stage {
  id: StageId;
  name: string;
  short: string;
  img: string;
  color: string;
  descNL: string;
  descEN: string;
  capacity?: number;
}

export interface Act {
  id: string;        // slug — stabiele identifier voor URL/localStorage
  name: string;
  tag: string;
  img: string;
  bioNL: string;
  bioEN: string;
  aiBlurbNL?: string;
  aiBlurbEN?: string;
  youtubeUrl?: string;
  genre: string;
  genres?: string[];
}

export interface ScheduleItem {
  stageId: StageId;
  actId: string;
  start: number;
  end: number;
}

export type DayId = 'saturday' | 'sunday';

// Bundled fallback — wordt gebruikt op een koude start zonder netwerk én
// zonder cache. Zodra de API antwoordt vervangen we deze waarden in de context.

export const BUNDLED_STAGES: Stage[] = [
  {
    id: 'ponton',
    name: 'Ponton',
    short: 'PON',
    img: '/assets/ponton.png',
    color: '#F03228',
    descNL: 'Het openluchtpodium aan het water. De plek voor grote optredens onder de open hemel.',
    descEN: 'The open-air waterside stage. Home to the headline performances under the open sky.',
    capacity: 15000,
  },
  {
    id: 'lake',
    name: 'The Lake',
    short: 'LAK',
    img: '/assets/lake.png',
    color: '#2B3BE5',
    descNL: 'Drijvend podium midden op het water. Dans met je voeten in het zand.',
    descEN: 'Floating stage on the lake. Dance with your feet in the sand.',
    capacity: 8000,
  },
  {
    id: 'club',
    name: 'The Club',
    short: 'CLB',
    img: '/assets/club.png',
    color: '#E5A52B',
    descNL: 'Intiem, warm, elektronisch. Palmen en pulserende beats tot diep in de nacht.',
    descEN: 'Intimate, warm, electronic. Palms and pulsing beats deep into the night.',
    capacity: 3500,
  },
  {
    id: 'hangar',
    name: 'Hangar',
    short: 'HNG',
    img: '/assets/hangar.png',
    color: '#ffffff',
    descNL: 'Industriële dome met 360° licht en geluid. Pure rave-energie.',
    descEN: 'Industrial dome with 360° light and sound. Pure rave energy.',
    capacity: 6000,
  },
];

export const BUNDLED_ACTS: Act[] = [
  { id: 'armin', name: 'Armin van Buuren', tag: 'Trance legend', img: '/assets/act_armin.png',
    bioNL: 'Vijfvoudig DJ Mag #1 en trance-pionier. Armin brengt zijn A State of Trance-ervaring naar het Ponton met een tweeuurs peak-time set.',
    bioEN: 'Five-time DJ Mag #1 and trance pioneer. Armin brings his A State of Trance experience to the Ponton with a two-hour peak-time set.',
    aiBlurbNL: "Vier en twintig jaar nadat hij A State of Trance lanceerde, blijft Armin het ijkpunt van het genre. Verwacht een set die langzaam opbouwt van warme, dromerige progressives tot peak-time eufoor — met visuals die het Ponton lijken te laten ademen. Zijn samples wisselen klassiekers af met onuitgebrachte ID's die hij vorige week pas in de studio afmaakte.",
    aiBlurbEN: "Twenty-four years after launching A State of Trance, Armin remains the benchmark for the genre. Expect a set that climbs from warm, dreamy progressives to peak-time euphoria — with visuals that make the Ponton feel like it is breathing. His selection alternates between classics and unreleased IDs he only finished in the studio last week.",
    youtubeUrl: 'https://www.youtube.com/watch?v=TxvpctgU_s8',
    genre: 'Trance' },
  { id: 'martin', name: 'Martin Garrix', tag: 'EDM producer', img: '/assets/act_martin.png',
    bioNL: 'Nederlandse topproducer met wereldhits als Animals en Scared to Be Lonely. Verwacht grote drops en pyro.',
    bioEN: 'Dutch super-producer behind worldwide hits like Animals and Scared to Be Lonely. Expect huge drops and pyro.',
    aiBlurbNL: 'Hij was zeventien toen Animals de wereld plat legde — vandaag is Martin een productiemachine die de mainstream EDM-sound op eigen titel definieert. De show op ❤U combineert zijn grootste mainstage-momenten met materiaal van zijn nieuwe alias YTRAM voor de tech-house bezoekers. Pyro, lasers, en het volle gewicht van de Hangar-rig.',
    aiBlurbEN: 'He was seventeen when Animals broke the world — today Martin is a production machine defining the mainstream EDM sound on his own terms. His ❤U show fuses his biggest mainstage moments with material from his YTRAM alias for the tech-house heads. Pyro, lasers, and the full weight of the Hangar rig.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Zv1QV6lrc_Y',
    genre: 'EDM' },
  { id: 'kensington', name: 'Kensington', tag: 'Rock anthems', img: '/assets/act_kensington.png',
    bioNL: 'Utrechtse rockband die stadions vol krijgt. Hymnen om je stem kwijt te raken.',
    bioEN: 'Utrecht rock band filling stadiums. Anthems to lose your voice to.',
    aiBlurbNL: 'Vier jongens uit Utrecht die altijd te luid klonken voor een café en ten slotte stadions vulden. Hun ❤U-set is een terugkeer naar huis: zelfde stad, zelfde publiek, drie keer zo veel mensen. Eén traan tijdens Streets is gegarandeerd.',
    aiBlurbEN: 'Four lads from Utrecht who always sounded too loud for the local pub and eventually filled stadiums. Their ❤U set is a homecoming: same city, same crowd, three times the people. One tear during Streets is guaranteed.',
    youtubeUrl: 'https://www.youtube.com/watch?v=IH77eOyV95o',
    genre: 'Rock' },
  { id: 'within', name: 'Within Temptation', tag: 'Symphonic metal', img: '/assets/act_within.png',
    bioNL: 'Sinds 1996 de belichaming van Nederlandse symfonische metal. Theatraal, episch, meeslepend.',
    bioEN: 'Since 1996 the embodiment of Dutch symphonic metal. Theatrical, epic, enveloping.',
    aiBlurbNL: 'Sharon den Adel zingt al bijna dertig jaar over wolven, kastelen en gebroken harten — en doet dat alsof het de eerste keer is. De live-show bevat strijkers, lichtjaren aan rookmachines en koorpartijen die je in je borstkas voelt. Cinematischer wordt rock zelden.',
    aiBlurbEN: 'Sharon den Adel has been singing about wolves, castles and broken hearts for nearly thirty years — and still does it like the first time. The live show features strings, light-years of fog and choral parts you feel in your chest. Rock rarely gets more cinematic than this.',
    youtubeUrl: 'https://www.youtube.com/watch?v=iQVei5C2N4E',
    genre: 'Metal' },
  { id: 'destaat', name: 'De Staat', tag: 'Art rock', img: '/assets/act_destaat.png',
    bioNL: "Onvoorspelbare art-rock uit Nijmegen. Torre Florim en z'n band zoeken de rand op — altijd.",
    bioEN: 'Unpredictable art-rock from Nijmegen. Torre Florim and his band always push the edge.',
    aiBlurbNL: 'De Staat klinkt nooit twee shows hetzelfde. Verwacht hoekige gitaarriffs, halve klassieke arrangementen en momenten waarop de hele band tegelijk de hoek opzoekt. Eén nummer zal je doen springen, een ander zal je doen stilstaan. Allebei bedoeld.',
    aiBlurbEN: 'De Staat never sounds the same twice. Expect angular guitar riffs, half-classical arrangements and moments where the whole band corners together. One song will make you jump, the next will stop you cold. Both are intentional.',
    youtubeUrl: 'https://www.youtube.com/watch?v=0ttGgIQpAUc',
    genre: 'Art rock' },
  { id: 'chef', name: "Chef'Special", tag: 'Pop / hip-hop', img: '/assets/act_chef.png',
    bioNL: 'Haarlemse feestmakers. Reggae, pop en hip-hop smelten samen tot zomerhits zoals In Your Arms.',
    bioEN: 'Haarlem party starters. Reggae, pop and hip-hop blend into summer hits like In Your Arms.',
    aiBlurbNL: 'Vijf Haarlemmers met een Zuid-Amerikaans hart. De vibe is een eindeloze zomeravond op een dakterras: trompetten over hiphop-beats, reggae-grooves onder een pop-refrein. Tegen het einde van de set zingt het hele Ponton het slotnummer harder dan de PA aankan.',
    aiBlurbEN: 'Five guys from Haarlem with a South-American heart. The vibe is an endless summer evening on a rooftop: trumpets over hip-hop beats, reggae grooves under a pop hook. By the end of the set the whole Ponton outsings the PA.',
    youtubeUrl: 'https://www.youtube.com/watch?v=l3jRIr44lss',
    genre: 'Pop' },
  { id: 'navarone', name: 'Navarone', tag: 'Stadion-rock', img: '/assets/act_splash.png',
    bioNL: 'Rockband uit Utrecht — riffs als muren, refreinen om mee te schreeuwen.',
    bioEN: 'Utrecht rock band — wall-of-sound riffs and chant-along choruses.',
    aiBlurbNL: 'Navarone speelt rock zoals het in 1975 bedoeld was: vol gas, geen excuses. Met The Lake als zandbak en een rijtje gitaarversterkers dat tot aan de waterlijn doorloopt, is dit hun grootste thuiswedstrijd ooit. Verwacht een eindeloos slot waarbij iedereen even doet alsof Foo Fighters Nederlands sprak.',
    aiBlurbEN: 'Navarone plays rock the way 1975 intended it: full throttle, no apologies. With The Lake as their sandbox and a wall of guitar amps reaching to the water, this is their biggest hometown show yet. Expect an endless finale where everyone briefly pretends Foo Fighters spoke Dutch.',
    youtubeUrl: 'https://www.youtube.com/watch?v=EvLpaCSnc4k',
    genre: 'Rock' },
  { id: 'dotan', name: 'Dotan', tag: 'Folk-pop', img: '/assets/act_distan.png',
    bioNL: 'Atmosferische folk-pop met grote koren. Bekend van Home en Numb.',
    bioEN: 'Atmospheric folk-pop with big choirs. Known for Home and Numb.',
    aiBlurbNL: "Dotan brengt z'n nieuwe band mee, vier strijkers en een drummer die meer fluistert dan slaat. Het is folk-pop op kerkhofschaal — refreinen die je bij The Club hardop laten meezingen alsof het een mantra is. Een set voor de vroege avond, voor wanneer de zon over het meer zakt.",
    aiBlurbEN: 'Dotan brings his new band — four string players and a drummer who whispers more than he strikes. It is folk-pop on a cathedral scale — choruses that have The Club singing along like a mantra. An early-evening set, for when the sun dips behind the lake.',
    youtubeUrl: 'https://www.youtube.com/watch?v=FZEuqzW16Nw',
    genre: 'Folk-pop' },
  { id: 'eefje', name: 'Eefje de Visser', tag: 'Indie-pop', img: '/assets/act_sofia.png',
    bioNL: 'Nederlands eigen dream-pop visitekaartje — fluweelzachte vocalen op verfijnde elektronica.',
    bioEN: "The Netherlands' own dream-pop calling card — velvet vocals over refined electronics.",
    aiBlurbNL: 'Eefje de Visser bouwt haar nummers op zoals je een Polaroid ziet ontwikkelen — eerst contouren, dan kleur. Op het Ponton begeleidt een trio haar in subtiele synth-arrangementen. Het is geen optreden, het is een uur zachte focus waarin de rest van het terrein even uit zicht verdwijnt.',
    aiBlurbEN: 'Eefje de Visser builds her songs the way a Polaroid develops — first contours, then colour. At the Ponton a trio backs her with subtle synth arrangements. It is not a performance, it is an hour of soft focus during which the rest of the site momentarily vanishes.',
    youtubeUrl: 'https://www.youtube.com/watch?v=6IlLJNmLDMg',
    genre: 'Indie-pop' },
  { id: 'froukje', name: 'Froukje', tag: 'Indie-pop', img: '/assets/act_nienke.png',
    bioNL: 'Generatie-Z stem met dromerige pop-productie en scherpe teksten.',
    bioEN: 'Generation-Z voice with dreamy pop production and razor-sharp lyrics.',
    aiBlurbNL: 'Froukje schrijft over klimaat, ongelijkheid en onzekerheid — maar nooit zonder humor en altijd met een refrein dat blijft hangen. Live is haar set een mini-festival op zichzelf: zacht beginnen, eindigen met een dansvloer. Voor wie denkt dat Nederlandstalige pop verstoft is, is dit dé wake-up call.',
    aiBlurbEN: 'Froukje writes about climate, inequality and uncertainty — but never without humour and always with a hook that sticks. Live, her set is a mini-festival of its own: gentle start, dance-floor finale. For anyone who thinks Dutch-language pop is dusty, this is the wake-up call.',
    youtubeUrl: 'https://www.youtube.com/watch?v=g4PlReX9e-E',
    genre: 'Indie-pop' },
  { id: 'spinvis', name: 'Spinvis', tag: 'Spoken-word pop', img: '/assets/act_prodeje.png',
    bioNL: "Erik de Jong's muzikale schetsboek — half zang, half vertelling, altijd raak.",
    bioEN: "Erik de Jong's musical sketchbook — half song, half storytelling, always on point.",
    aiBlurbNL: 'Spinvis bestaat al twee decennia, en toch klinkt elk concert als iets dat hij vannacht uitvond. De nummers zijn fragmenten — straten, namen, oude kamers — en toch klinkt het hele oeuvre als één lang verhaal. Een ideaal moment voor wie even wil ophouden te dansen en weer wil léren luisteren.',
    aiBlurbEN: 'Spinvis has existed for two decades, yet every concert sounds like something he invented last night. The songs are fragments — streets, names, old rooms — and yet the entire body of work sounds like one long story. The perfect moment to stop dancing and start listening again.',
    youtubeUrl: 'https://www.youtube.com/watch?v=F3ZTrGWSLf4',
    genre: 'Spoken word' },
];

export const BUNDLED_SCHEDULE: Record<DayId, ScheduleItem[]> = {
  saturday: [
    { stageId: 'ponton', actId: 'destaat', start: 14, end: 15 },
    { stageId: 'ponton', actId: 'kensington', start: 16, end: 17.5 },
    { stageId: 'ponton', actId: 'chef', start: 18.5, end: 20 },
    { stageId: 'ponton', actId: 'within', start: 21, end: 22.5 },
    { stageId: 'ponton', actId: 'armin', start: 23, end: 25 },
    { stageId: 'lake', actId: 'froukje', start: 13, end: 14 },
    { stageId: 'lake', actId: 'eefje', start: 15, end: 16 },
    { stageId: 'lake', actId: 'dotan', start: 17, end: 18 },
    { stageId: 'lake', actId: 'navarone', start: 19, end: 20 },
    { stageId: 'lake', actId: 'spinvis', start: 21, end: 22 },
    { stageId: 'club', actId: 'dotan', start: 20, end: 21.5 },
    { stageId: 'club', actId: 'martin', start: 22, end: 24 },
    { stageId: 'club', actId: 'armin', start: 1, end: 3 },
    { stageId: 'hangar', actId: 'spinvis', start: 22, end: 23.5 },
    { stageId: 'hangar', actId: 'martin', start: 0.5, end: 2.5 },
  ],
  sunday: [
    { stageId: 'ponton', actId: 'froukje', start: 13, end: 14 },
    { stageId: 'ponton', actId: 'eefje', start: 14.5, end: 15.5 },
    { stageId: 'ponton', actId: 'within', start: 17, end: 18.5 },
    { stageId: 'ponton', actId: 'chef', start: 20, end: 21.5 },
    { stageId: 'ponton', actId: 'martin', start: 22.5, end: 24 },
    { stageId: 'lake', actId: 'destaat', start: 14, end: 15 },
    { stageId: 'lake', actId: 'kensington', start: 16, end: 17 },
    { stageId: 'lake', actId: 'navarone', start: 18, end: 19 },
    { stageId: 'lake', actId: 'spinvis', start: 20, end: 21 },
    { stageId: 'club', actId: 'dotan', start: 19, end: 20.5 },
    { stageId: 'club', actId: 'armin', start: 22, end: 24 },
    { stageId: 'hangar', actId: 'martin', start: 20, end: 22 },
    { stageId: 'hangar', actId: 'spinvis', start: 23, end: 25 },
  ],
};

export const formatHour = (h: number): string => {
  const hh = ((Math.floor(h)) % 24 + 24) % 24;
  const mm = (h % 1) * 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};
