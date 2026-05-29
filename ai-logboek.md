# AI-Logboek

## Toelichting

In dit logboek houd ik bij hoe ik AI heb gebruikt als hulpmiddel bij deze opdracht.
Per gebruik noteer ik:

- Welk AI-model en welke tool/plugin/IDE ik gebruik
- De prompt(s) die ik gebruik
- Datum en tijd
- Het **resultaat**: hoe bruikbaar de output was (achteraf ingeschat)

### Resultaat-schaal

| Score | Betekenis |
|-------|-----------|
| ⭐⭐⭐⭐⭐ | Direct bruikbaar, vrijwel niets aan hoeven aanpassen |
| ⭐⭐⭐⭐ | Goed bruikbaar, kleine handmatige correcties nodig |
| ⭐⭐⭐ | Bruikbaar als basis, maar duidelijk bijsturen nodig |
| ⭐⭐ | Deels bruikbaar, veel zelf moeten herwerken |
| ⭐ | Nauwelijks bruikbaar |

---

## Logboek

### 11 mei 2026

#### Entry 1
- **Datum/tijd:** 11 mei 2026, 10:15
- **Tool:** Claude Design
- **Prompt:**
  > Dit zijn screenshots van een Notion-pagina en de afbeeldingen die daar op stonden. Kan je een design maken die perfect voor dit project is en aan alle voorwaarden voldoet?
- **Resultaat:** ⭐⭐⭐⭐ — Sterk eerste design dat de huisstijl goed pakte; basis voor het hele project. Plattegrond en taalswitcher moesten daarna nog flink verbeterd worden (zie volgende entries).

#### Entry 2
- **Datum/tijd:** 11 mei 2026, 10:45
- **Tool:** Claude Design
- **Prompt:**
  > Kan je de plattegrond veel beter maken? Het is een grote map dus zorg dat die mooi erin komt en dat alle markers goed staan. Ik heb de icoontjes hier aan toegevoegd. Zorg ook dat de taalswitcher iets mooier in het design komt.
- **Resultaat:** ⭐⭐⭐⭐ — Plattegrond werd duidelijk mooier en de markers stonden netjes; taalswitcher verbeterde, maar had nog een paar iteraties nodig (entries 3 & 4).

#### Entry 3
- **Datum/tijd:** 11 mei 2026, 10:50
- **Tool:** Claude Design
- **Prompt:**
  > De taalswitcher komt soms nog voor andere knoppen. Zou je dat mooi kunnen oplossen?
- **Resultaat:** ⭐⭐⭐ — Het z-index/overlap-probleem werd opgelost, maar introduceerde meteen een nieuw probleem (uitklappen te kort, zie entry 4).

#### Entry 4
- **Datum/tijd:** 11 mei 2026, 10:55
- **Tool:** Claude Design
- **Prompt:**
  > Dit is heel goed, alleen als je hem uitklapt is het net te kort waardoor je "Engels" niet ziet.
- **Resultaat:** ⭐⭐⭐⭐⭐ — Kleine, gerichte fix die meteen klopte; taalswitcher was hierna helemaal goed.

#### Entry 5
- **Datum/tijd:** 11 mei 2026, 11:00
- **Tool:** Claude Design
- **Prompt:**
  > Kan je nu ook nog een white mode toevoegen, zodat je kan kiezen tussen dark en light mode?
- **Resultaat:** ⭐⭐⭐⭐ — Light mode werd toegevoegd met een werkende thema-switch; alleen waren sommige teksten in light mode nog slecht leesbaar (opgelost in entry 6).

---

### 13 mei 2026

#### Entry 6
- **Datum/tijd:** 13 mei 2026, 11:15
- **Tool:** Claude Design
- **Prompt:**
  > Kan je de tekstjes nog even goed bekijken? Veel dingen zijn in light mode niet te lezen. Ook werkt de switch-animatie van de knop voor het wisselen tussen light en dark mode niet goed.
- **Resultaat:** ⭐⭐⭐⭐ — Contrast in light mode en de switch-animatie werden netjes gefixt; design was hierna af genoeg om naar code te vertalen.

#### Entry 7
- **Datum/tijd:** 13 mei 2026, 11:30
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Ik heb met Claude Design een heel design gemaakt (te zien in claude-design). Ik zou het hele design graag in React willen zetten in de map "web". Heb je een React-project met de structuur zoals ik hem wil hebben? Kan je daar het hele design in zetten?
- **Resultaat:** ⭐⭐⭐⭐⭐ — Hele design werd omgezet naar een nette React + TypeScript + Vite-structuur met losse componenten en pagina's; dit werd het fundament van de hele web-app.

#### Entry 8
- **Datum/tijd:** 13 mei 2026, 11:45
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Het hele design staat erin, alleen is het nog niet helemaal responsive. Het moet op elke telefoon goed werken; nu zit het vast op één breedte. Kan je daar nog voor zorgen?
- **Resultaat:** ⭐⭐⭐⭐ — App werd responsive gemaakt en schaalde mee op verschillende schermbreedtes; precieze afstemming op de huisstijl kwam in latere entries.

#### Entry 9
- **Datum/tijd:** 13 mei 2026, 12:00
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Kan je kijken of deze React-website aan de design guidelines voldoet en een volledig overzicht geven van wat niet klopt?
  >
  > Design guidelines:
  > - Lettertype: Sansation (Google Fonts)
  > - Koppen: Bold 700
  > - Leesteksten: Regular 400
  > - Knoppen: Light 300 Italic
  > - Accent: #F03228 (Vermilion) — knoppen/interactie
  > - Base: #FFFFFF (White)
  > - Primary: #000000 (Black)
  > - Secondary: #247BA0 (Cerulean) — kopteksten
  > - Info: #E3B505 (Saffron) — info/waarschuwingen
  > - Icons: Material Symbols
  > - Logo's: zwart + wit versie (staan in Notion)
  > - Animatie: bij schermwisselingen en interactie
- **Resultaat:** ⭐⭐⭐⭐⭐ — Leverde een helder, compleet overzicht van waar de app afweek van de guidelines (kleuren, fonts, font-weights); perfecte checklist om daarna gericht op te lossen.

---

### 17 mei 2026
 
#### Entry 10
- **Datum/tijd:** 17 mei 2026, 13:50
- **Tool:** Claude (claude.ai)
- **Model:** Claude Opus 4.7
- **Prompt:**
  > Bij mijn opdracht staat dat ik al mijn AI-gebruik in een md-bestand moet zetten. Kan je dit AI-logboek voor mij opzetten en invullen met mijn prompts, tijden en datums?
- **Resultaat:** ⭐⭐⭐⭐⭐ — Logboek (dit bestand) werd in één keer netjes opgezet met de juiste structuur; alleen nog aanvullen met nieuwe entries.

#### Entry 11
- **Datum/tijd:** 17 mei 2026, 13:58
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Kan je zorgen dat het design volledig aan de onderstaande guidelines voldoet en het design er ook nog mooi uitziet
  >
  > Design guidelines:
  > - Lettertype: Sansation (Google Fonts)
  > - Koppen: Bold 700
  > - Leesteksten: Regular 400
  > - Knoppen: Light 300 Italic
  > - Accent: #F03228 (Vermilion) — knoppen/interactie
  > - Base: #FFFFFF (White)
  > - Primary: #000000 (Black)
  > - Secondary: #247BA0 (Cerulean) — kopteksten
  > - Info: #E3B505 (Saffron) — info/waarschuwingen
  > - Icons: Material Symbols
  > - Logo's: zwart + wit versie (staan in Notion)
  > - Animatie: bij schermwisselingen en interactie
- **Resultaat:** ⭐⭐⭐⭐ — De meeste guideline-afwijkingen uit entry 9 werden in één keer doorgevoerd (fonts, kleuren, animaties); een paar details (vlaggen, favoriet-knop) bleven over voor entries 12 & 13.

#### Entry 12
- **Datum/tijd:** 17 mei 2026, 14:30
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Kan je fixen dat de talen vlaggen helemaal goed kloppen in het talen switch menu. Zorg ook dat als ik op een artietst heb gedrukt in de lineup en die heb een hart heb gegeven niet de knop volledig rood is maar dat je ziet dat je die followed
- **Resultaat:** ⭐⭐⭐ — De favoriet-knop kreeg een nette "gevolgd"-staat; de vlaggen waren beter maar de Engelse vlag klopte nog niet helemaal (vervolg in entry 13).

#### Entry 13
- **Datum/tijd:** 17 mei 2026, 14:36
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > De engelse vlag vind ik nog niet heel goed fix die helemaal. In light mode is de text van de artiest in de lineup en dan de detail niet heel goed te lezen fix dat ook helemaal
- **Resultaat:** ⭐⭐⭐⭐ — Engelse vlag werd correct, en de leesbaarheid van de lineup/detail-teksten in light mode werd opgelost.

#### Entry 14
- **Datum/tijd:** 17 mei 2026, 15:00
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Ik wil er een PWA van maken kan je zorgen dat als de app op een telefoon word geopend dat er word gekeken ofdat het via een pwa is zo niet laat je precies voor dat apparaat zien hoe de pwa geinstalleerd moet worden zorg dat het volledig in de style van de hele website is. Kan je ook een manifast.json maken en die toevoegen met een app icoon zodat ik hem kan toevoegen aan mijn telefoon
- **Resultaat:** ⭐⭐⭐⭐⭐ — Complete PWA-opzet: manifest, app-icoon, detectie of de app al als PWA draait én een install-uitleg per apparaat (iOS/Android), volledig in de huisstijl.

#### Entry 15
- **Datum/tijd:** 17 mei 2026, 21:47
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Ik wil graag dat de data nu uit de database komt dus kan je een volledige mysql database maken voor alle data. Ik heb al een node js server aangemaakt. Dan wil ik nog dat de eisen hier onder verwerkt worden
  > 
  > De app wordt een week voor aanvang van het festival gelanceerd en kan worden geopend door een QR-code te scannen. Daarna kan de app worden geïnstalleerd.
  > In je eindproduct houdt je rekening met de mogelijkheden van een PWA zoals:
  > 
  > - Installeren op het startscherm
  > - Push-meldingen
  > - Offline werken (caching)
- **Resultaat:** ⭐⭐⭐⭐ — Volledige MySQL-database + Node/Express-API werd opgezet en de app haalde data uit de database. Een paar PWA-details (push-permissie, offline icons, fav-sync) waren nog niet perfect (opgelost in entry 16).

#### Entry 16
- **Datum/tijd:** 17 mei 2026, 22:01
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Oke ik heb een paar problemen Hij vraagd volgens mij nergens om push notificaties permissions dus kan die ze niet versutren. Als ik offline ga worden de icoontjes in de nav enzo niet meer ingeladen kan je dat ook fixen. En als ik offline ga en ik like iets word dat dan later gesynct naar de server? Ook in de data is er geen ai gebruikt en geen relaties tussen tables zorg dat de ids altijd nummers zijn met ai
- **Resultaat:** ⭐⭐⭐⭐ — Push-permissie, offline caching van icons en favorieten-sync werden geregeld, en het databaseschema werd herzien met auto-increment integer-id's en relaties. Veel verschillende problemen in één keer goed aangepakt.

#### Entry 17
- **Datum/tijd:** 17 mei 2026, 22:10
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Perfect kan je nog zorgen dat er standaard geen artietsen in favorieten staan nu staan er standaard 2 in
- **Resultaat:** ⭐⭐⭐⭐⭐ — Kleine, exacte fix: favorieten beginnen nu leeg.

#### Entry 18
- **Datum/tijd:** 17 mei 2026, 22:17
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Perfect bij elke act kan je een clip kijken zorg dat dat werkt met de data hier onder. Als de gebruiker offline is geef dan een nette melding dat de video niet zonder internet/wifi bekeken kan worden
  > 
  > **Armin van Buuren**
  > https://www.youtube.com/watch?v=TxvpctgU_s8
  > 
  > **Martin Garrix**
  > https://www.youtube.com/watch?v=Zv1QV6lrc_Y
  > 
  > **Kensington**
  > https://www.youtube.com/watch?v=IH77eOyV95o
  > 
  > **Within Temptation**
  > https://www.youtube.com/watch?v=iQVei5C2N4E
  > 
  > **De Staat**
  > https://www.youtube.com/watch?v=0ttGgIQpAUc
  > 
  > **Chef’Special**
  > https://www.youtube.com/watch?v=l3jRIr44lss
  > 
  > **Navarone**
  > https://www.youtube.com/watch?v=EvLpaCSnc4k
  > 
  > **Dotan**
  > https://www.youtube.com/watch?v=FZEuqzW16Nw
  > 
  > **Eefje de Visser**
  > https://www.youtube.com/watch?v=6IlLJNmLDMg
  > 
  > **Froukje**
  > https://www.youtube.com/watch?v=g4PlReX9e-E
  > 
  > **Spinvis**
  > https://www.youtube.com/watch?v=F3ZTrGWSLf4
- **Resultaat:** ⭐⭐⭐⭐⭐ — Per act werd een werkende clip-knop met video gekoppeld aan de data, inclusief een nette melding wanneer de gebruiker offline is.

---

### 20 mei 2026

#### Entry 19
- **Datum/tijd:** 20 mei 2026, 9:25
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Ik wil nu graag de map werkend maken alleen ben ik niet op de locatie maar wil ik het wel goed testen zonder op die locatie te zijn kan je dat helemaal goed maken
- **Resultaat:** ⭐⭐⭐⭐ — Er kwam een testmodus om de gebruikerslocatie op de kaart te simuleren zonder fysiek op locatie te zijn; goede basis die in de volgende entries realistischer werd gemaakt.

#### Entry 20
- **Datum/tijd:** 20 mei 2026, 9:40
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Kan je nu met de echte locatie doen dus dan denk ik rond een loop dat de locatie echt beweegt bedenk daar een goeie manier voor om dat de simuleren
- **Resultaat:** ⭐⭐⭐⭐ — Locatiesimulatie liep nu langs een route/loop zodat de pin echt over de kaart beweegt; mooie, realistische testmanier.

#### Entry 21
- **Datum/tijd:** 20 mei 2026, 10:20
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Kan je ook nog een test toevoegen voor de gps van mijn mobile als ik de webapp geinstalleerd heb zodat ik dan ook op dee kaart kan zien als ik zelf echt rond loop bijvoorbeeld buiten dat ik over de map van het festival beweeg
- **Resultaat:** ⭐⭐⭐⭐⭐ — Echte GPS-testmodus toegevoegd: door buiten te lopen schuift je pin echt over de festivalkaart. Werkte goed en was leuk om te testen.

#### Entry 21
- **Datum/tijd:** 20 mei 2026, 10:52
- **Tool:** Claude Code
- **Model:** Opus 4.7
- **Prompt:**
  > Perfect kan je ook zorgen dat de map volledig mobile friendly is dus met vingers inzoomen enzovoort
- **Resultaat:** ⭐⭐⭐⭐ — Pinch-to-zoom en pannen op touch werden toegevoegd; kaart voelde hierna echt mobiel aan.

---

### 29 mei 2026

#### Entry 22
- **Datum/tijd:** 29 mei 2026, ~10:00
- **Tool:** Claude Code
- **Model:** Claude Sonnet 4.5
- **Prompt:**
  > kan je een heel cms achter deze website maken waar je alles aan kan passen
- **Resultaat:** ⭐⭐⭐⭐ — Leverde een doordacht plan voor een compleet CMS (auth + CRUD voor alle content); goede aanpak die na goedkeuring volledig werd gebouwd.

#### Entry 23
- **Datum/tijd:** 29 mei 2026, ~10:05
- **Tool:** Claude Code
- **Model:** Claude Sonnet 4.5
- **Prompt:**
  > *(goedkeuring van het implementatieplan voor het CMS)*
  >
  > Het plan omvatte: een aparte React admin-app op poort 5174, JWT-authenticatie met bcryptjs, CRUD-routes voor alle content types (podia, artiesten, programma, genres, kaartpunten, FAQ's, vervoer, festivalinfo) en een push-broadcast paneel.
- **Resultaat:** ⭐⭐⭐⭐⭐ — Het volledige CMS werd in één keer gebouwd volgens plan: login, alle CRUD-pagina's en het push-paneel werkten. Veel werk in korte tijd.

#### Entry 24
- **Datum/tijd:** 29 mei 2026, ~10:30
- **Tool:** Claude Code
- **Model:** Claude Sonnet 4.5
- **Prompt:**
  > Huh waarom heb je een apart mapje voor admin gemaakt?
- **Resultaat:** ⭐⭐⭐⭐⭐ — Heldere uitleg over waarom het CMS een aparte app/poort is (eigen build, eigen toegang, los van de publieke app); goede verantwoording van de keuze.

#### Entry 25
- **Datum/tijd:** 29 mei 2026, ~10:35
- **Tool:** Claude Code
- **Model:** Claude Sonnet 4.5
- **Prompt:**
  > kan je de ai-logboek.md en setup.md helemaal update
- **Resultaat:** ⭐⭐⭐⭐⭐ — Beide bestanden werden volledig bijgewerkt met de nieuwste CMS-stappen; netjes en compleet.

#### Entry 26
- **Datum/tijd:** 29 mei 2026, ~11:00
- **Tool:** Claude Code
- **Model:** Claude Opus 4.8
- **Prompt:**
  > kan je bij de ai-logboek.md bij elke prompt het resultaat zetten hoe handig die was. Ik weet het niet meer dus schat het in. Kan je ook zorgen in de SETUP.md dat er een perfecte uitleg is dus dat iemand anders van een clone het helemaal kan opzetten dus van 0 tot het volle project. En maak een nette read me met alle linkjes die online staan enzovoort
- **Resultaat:** ⭐⭐⭐⭐⭐ — Per logboek-entry een ingeschatte resultaatscore toegevoegd, SETUP.md herschreven tot een complete van-nul-handleiding, en een nette `README.md` met alle online links gemaakt.

---