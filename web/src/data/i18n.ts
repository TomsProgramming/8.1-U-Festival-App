export type Lang = 'nl' | 'en';

export interface Translation {
  home: string;
  lineup: string;
  map: string;
  info: string;
  favs: string;
  welcome: string;
  festival: string;
  date: string;
  location: string;
  stagesHeader: string;
  upNext: string;
  favHeader: string;
  noFavs: string;
  saturday: string;
  sunday: string;
  now: string;
  startsIn: string;
  notify: string;
  legend: string;
  entrance: string;
  toilet: string;
  food: string;
  firstaid: string;
  info_pt: string;
  lockers: string;
  water: string;
  smoke: string;
  faq: string;
  contact: string;
  reach: string;
  lockers_h: string;
  golden: string;
  min: string;
  hour: string;
  favAdded: string;
  notifOn: string;
  backToLineup: string;
  readMore: string;
  watchClip: string;
  stage: string;
  genre: string;
  time: string;
  duration: string;
}

export const I18N: Record<Lang, Translation> = {
  nl: {
    home: 'Home', lineup: 'Line-up', map: 'Plattegrond', info: 'Info', favs: 'Favorieten',
    welcome: 'Welkom op',
    festival: '❤️U Festival 2026',
    date: 'za 5 & zo 6 september',
    location: 'Strijkviertel, Utrecht',
    stagesHeader: 'Podia',
    upNext: 'Komt eraan',
    favHeader: 'Jouw favorieten',
    noFavs: 'Nog geen favorieten. Tik op een hart om acts te volgen.',
    saturday: 'Zaterdag', sunday: 'Zondag',
    now: 'Nu',
    startsIn: 'Begint over',
    notify: 'Herinnering aan',
    legend: 'Legenda',
    entrance: 'Entree / Uitgang', toilet: 'Toilet', food: 'Eten & Drinken',
    firstaid: 'EHBO', info_pt: 'Info', lockers: 'Lockers', water: 'Water', smoke: 'Rookzone',
    faq: 'Veelgestelde vragen',
    contact: 'Algemeen & contact',
    reach: 'Bereikbaarheid',
    lockers_h: 'Lockers',
    golden: 'Golden-GLU',
    min: 'min', hour: 'u',
    favAdded: 'Toegevoegd aan favorieten',
    notifOn: 'Meldingen aan: 15, 10 en 5 min voor aanvang',
    backToLineup: 'Terug naar line-up',
    readMore: 'Lees meer',
    watchClip: 'Bekijk clip',
    stage: 'Podium', genre: 'Genre', time: 'Tijd', duration: 'Duur',
  },
  en: {
    home: 'Home', lineup: 'Line-up', map: 'Map', info: 'Info', favs: 'Favorites',
    welcome: 'Welcome to',
    festival: '❤️U Festival 2026',
    date: 'Sat 5 & Sun 6 September',
    location: 'Strijkviertel, Utrecht',
    stagesHeader: 'Stages',
    upNext: 'Up next',
    favHeader: 'Your favorites',
    noFavs: 'No favorites yet. Tap a heart to follow acts.',
    saturday: 'Saturday', sunday: 'Sunday',
    now: 'Now',
    startsIn: 'Starts in',
    notify: 'Reminder for',
    legend: 'Legend',
    entrance: 'Entrance / Exit', toilet: 'Toilet', food: 'Food & Drink',
    firstaid: 'First Aid', info_pt: 'Info', lockers: 'Lockers', water: 'Water', smoke: 'Smoking area',
    faq: 'FAQ',
    contact: 'General & contact',
    reach: 'Getting here',
    lockers_h: 'Lockers',
    golden: 'Golden-GLU',
    min: 'min', hour: 'h',
    favAdded: 'Added to favorites',
    notifOn: 'Notifications on: 15, 10 and 5 min before',
    backToLineup: 'Back to line-up',
    readMore: 'Read more',
    watchClip: 'Watch clip',
    stage: 'Stage', genre: 'Genre', time: 'Time', duration: 'Duration',
  },
};
