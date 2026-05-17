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
  videoOfflineTitle: string;
  videoOfflineText: string;
  videoUnavailable: string;
  videoOpenYouTube: string;
  closeVideo: string;
  pwaTitle: string;
  pwaTagline: string;
  pwaWhyTitle: string;
  pwaWhy1: string;
  pwaWhy2: string;
  pwaWhy3: string;
  pwaInstall: string;
  pwaNotNow: string;
  pwaInstalled: string;
  pwaStepsTitle: string;
  pwaOpenInSafari: string;
  pwaOpenInChrome: string;
  pwaShareSheet: string;
  pwaAddToHome: string;
  pwaTapAdd: string;
  pwaBrowserMenu: string;
  pwaInstallApp: string;
  pwaConfirm: string;
  pwaDesktopHint: string;
  pwaIosStep1: string;
  pwaIosStep2: string;
  pwaIosStep3: string;
  pwaAndroidStep1: string;
  pwaAndroidStep2: string;
  pwaAndroidStep3: string;
  pwaSamsungStep1: string;
  pwaSamsungStep2: string;
  pwaSamsungStep3: string;
  pwaFirefoxStep1: string;
  pwaFirefoxStep2: string;
  pwaFirefoxStep3: string;
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
    videoOfflineTitle: 'Geen internet',
    videoOfflineText: 'Je hebt internet of wifi nodig om de clip te bekijken. Probeer het opnieuw zodra je weer verbinding hebt.',
    videoUnavailable: 'Geen clip beschikbaar voor deze act.',
    videoOpenYouTube: 'Open op YouTube',
    closeVideo: 'Sluit',
    pwaTitle: 'Zet de festival-app op je beginscherm',
    pwaTagline: 'Open ❤U Festival sneller — als een echte app, zonder browserbalk.',
    pwaWhyTitle: 'Waarom installeren?',
    pwaWhy1: 'Eén tik en je bent in de app — geen URL meer onthouden',
    pwaWhy2: 'Werkt ook bij slecht netwerk op het festivalterrein',
    pwaWhy3: 'Volledig scherm: meer ruimte voor line-up en plattegrond',
    pwaInstall: 'Installeer app',
    pwaNotNow: 'Later',
    pwaInstalled: 'Geïnstalleerd!',
    pwaStepsTitle: 'Zo voeg je hem toe',
    pwaOpenInSafari: 'Open eerst deze pagina in Safari — andere browsers op iPhone kunnen geen apps installeren.',
    pwaOpenInChrome: 'Open eerst deze pagina in Chrome of Edge voor de beste installatie.',
    pwaShareSheet: 'Tik onderaan op het deel-icoon',
    pwaAddToHome: 'Kies "Zet op beginscherm"',
    pwaTapAdd: 'Bevestig met "Voeg toe" rechtsboven',
    pwaBrowserMenu: 'Tik rechtsboven op het menu (⋮)',
    pwaInstallApp: 'Kies "App installeren" of "Toevoegen aan beginscherm"',
    pwaConfirm: 'Bevestig met "Installeren"',
    pwaDesktopHint: 'Tip: dit werkt het beste op een telefoon. Op de computer kun je hem ook installeren via het install-icoon in de adresbalk.',
    pwaIosStep1: 'Tik onderaan op het deel-icoon (vierkant met pijl omhoog).',
    pwaIosStep2: 'Scroll en kies "Zet op beginscherm".',
    pwaIosStep3: 'Tik rechtsboven op "Voeg toe" — klaar!',
    pwaAndroidStep1: 'Tik rechtsboven op het menu (drie puntjes ⋮).',
    pwaAndroidStep2: 'Kies "App installeren" of "Toevoegen aan beginscherm".',
    pwaAndroidStep3: 'Tik op "Installeren" om te bevestigen.',
    pwaSamsungStep1: 'Tik onderaan op het menu (drie streepjes ☰).',
    pwaSamsungStep2: 'Kies "Pagina toevoegen aan" → "Startscherm".',
    pwaSamsungStep3: 'Tik op "Toevoegen" om te bevestigen.',
    pwaFirefoxStep1: 'Tik rechtsboven op het menu (drie puntjes ⋮).',
    pwaFirefoxStep2: 'Kies "Installeren" of "Toevoegen aan startscherm".',
    pwaFirefoxStep3: 'Tik op "Toevoegen" om te bevestigen.',
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
    videoOfflineTitle: 'No internet',
    videoOfflineText: "You need internet or Wi-Fi to watch the clip. Try again once you're back online.",
    videoUnavailable: 'No clip available for this act.',
    videoOpenYouTube: 'Open on YouTube',
    closeVideo: 'Close',
    pwaTitle: 'Add the festival app to your home screen',
    pwaTagline: 'Open ❤U Festival faster — like a real app, no browser bar.',
    pwaWhyTitle: 'Why install?',
    pwaWhy1: 'One tap and you\'re in — no URL to remember',
    pwaWhy2: 'Works on a flaky festival network too',
    pwaWhy3: 'Full screen: more room for line-up and map',
    pwaInstall: 'Install app',
    pwaNotNow: 'Later',
    pwaInstalled: 'Installed!',
    pwaStepsTitle: 'How to add it',
    pwaOpenInSafari: 'First open this page in Safari — other iPhone browsers can\'t install apps.',
    pwaOpenInChrome: 'First open this page in Chrome or Edge for the best install experience.',
    pwaShareSheet: 'Tap the share icon at the bottom',
    pwaAddToHome: 'Choose "Add to Home Screen"',
    pwaTapAdd: 'Confirm with "Add" in the top right',
    pwaBrowserMenu: 'Tap the menu (⋮) in the top right',
    pwaInstallApp: 'Choose "Install app" or "Add to Home screen"',
    pwaConfirm: 'Confirm with "Install"',
    pwaDesktopHint: 'Tip: this works best on a phone. On desktop you can also install via the install icon in the address bar.',
    pwaIosStep1: 'Tap the share icon at the bottom (square with arrow up).',
    pwaIosStep2: 'Scroll and choose "Add to Home Screen".',
    pwaIosStep3: 'Tap "Add" in the top right — done!',
    pwaAndroidStep1: 'Tap the menu (three dots ⋮) in the top right.',
    pwaAndroidStep2: 'Choose "Install app" or "Add to Home screen".',
    pwaAndroidStep3: 'Tap "Install" to confirm.',
    pwaSamsungStep1: 'Tap the menu (three lines ☰) at the bottom.',
    pwaSamsungStep2: 'Choose "Add page to" → "Home screen".',
    pwaSamsungStep3: 'Tap "Add" to confirm.',
    pwaFirefoxStep1: 'Tap the menu (three dots ⋮) in the top right.',
    pwaFirefoxStep2: 'Choose "Install" or "Add to Home screen".',
    pwaFirefoxStep3: 'Tap "Add" to confirm.',
  },
};
