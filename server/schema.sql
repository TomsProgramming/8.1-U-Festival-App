-- ❤U Festival 2026 — MySQL schema
--
-- Ontwerp:
--   • Elke PK is een INT AUTO_INCREMENT — relaties tussen tabellen lopen
--     via deze numerieke ID's.
--   • Voor stages/acts/map_pins blijft er een `slug` veld (VARCHAR UNIQUE)
--     omdat URL's en de mobiele cliënt prettiger zijn met leesbare namen.
--   • Genres zitten in een eigen tabel + many-to-many join — zo zit het
--     genre niet meer hard-coded als string in `acts`.
--   • `ai_blurb_*` velden bevatten door een LLM gegenereerde, langere
--     biografie-tekst die in de Act-detail naast de korte handgeschreven
--     bio wordt getoond.
--
-- Run:  mysql -u root -p < schema.sql

DROP DATABASE IF EXISTS ufestival;
CREATE DATABASE ufestival CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ufestival;

-- =====================================================================
-- Stages
-- =====================================================================
CREATE TABLE stages (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  slug      VARCHAR(32)  NOT NULL UNIQUE,
  name      VARCHAR(64)  NOT NULL,
  short     VARCHAR(8)   NOT NULL,
  img       VARCHAR(255) NOT NULL,
  color     VARCHAR(16)  NOT NULL,
  desc_nl   TEXT         NOT NULL,
  desc_en   TEXT         NOT NULL,
  capacity  INT          NULL,
  sort      INT          NOT NULL DEFAULT 0
);

-- =====================================================================
-- Genres + acts (1-op-veel via primary_genre, veel-op-veel via act_genres)
-- =====================================================================
CREATE TABLE genres (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(48) NOT NULL UNIQUE
);

CREATE TABLE acts (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  slug              VARCHAR(32)  NOT NULL UNIQUE,
  name              VARCHAR(96)  NOT NULL,
  tag               VARCHAR(96)  NOT NULL,
  img               VARCHAR(255) NOT NULL,
  bio_nl            TEXT         NOT NULL,
  bio_en            TEXT         NOT NULL,
  ai_blurb_nl       TEXT         NULL,
  ai_blurb_en       TEXT         NULL,
  youtube_url       VARCHAR(255) NULL,
  primary_genre_id  INT          NULL,
  FOREIGN KEY (primary_genre_id) REFERENCES genres(id) ON DELETE SET NULL
);

CREATE TABLE act_genres (
  act_id    INT NOT NULL,
  genre_id  INT NOT NULL,
  PRIMARY KEY (act_id, genre_id),
  FOREIGN KEY (act_id)   REFERENCES acts(id)   ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- =====================================================================
-- Programma
-- =====================================================================
CREATE TABLE schedule (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  day       ENUM('saturday','sunday') NOT NULL,
  stage_id  INT          NOT NULL,
  act_id    INT          NOT NULL,
  start_h   DECIMAL(4,2) NOT NULL,
  end_h     DECIMAL(4,2) NOT NULL,
  FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE,
  FOREIGN KEY (act_id)   REFERENCES acts(id)   ON DELETE CASCADE,
  INDEX (day),
  INDEX (stage_id),
  INDEX (act_id)
);

-- =====================================================================
-- Plattegrond
-- =====================================================================
CREATE TABLE map_pins (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  slug      VARCHAR(32)  NOT NULL UNIQUE,
  kind      ENUM('stage','food','toilet','bar','icecream','firstaid','merch','locker','entrance') NOT NULL,
  num       INT          NULL,
  x         INT          NOT NULL,
  y         INT          NOT NULL,
  label     VARCHAR(96)  NOT NULL,
  stage_id  INT          NULL,
  FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE SET NULL
);

-- =====================================================================
-- FAQ + Bereikbaarheid + algemene info
-- =====================================================================
CREATE TABLE faqs (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  lang      ENUM('nl','en') NOT NULL,
  question  VARCHAR(255)  NOT NULL,
  answer    TEXT          NOT NULL,
  sort      INT           NOT NULL DEFAULT 0,
  INDEX (lang)
);

CREATE TABLE reach_items (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  lang   ENUM('nl','en') NOT NULL,
  icon   VARCHAR(48)   NOT NULL,
  title  VARCHAR(96)   NOT NULL,
  descr  TEXT          NOT NULL,
  sort   INT           NOT NULL DEFAULT 0,
  INDEX (lang)
);

CREATE TABLE info_facts (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  fkey  VARCHAR(64)     NOT NULL,
  lang  ENUM('nl','en') NOT NULL,
  value TEXT            NOT NULL,
  UNIQUE KEY uniq_fkey_lang (fkey, lang)
);

-- =====================================================================
-- Devices, favorieten, push
-- =====================================================================
CREATE TABLE devices (
  id           CHAR(36)  PRIMARY KEY,           -- door client gegenereerde UUID
  lang         ENUM('nl','en')     NOT NULL DEFAULT 'nl',
  theme        ENUM('dark','light') NOT NULL DEFAULT 'dark',
  created_at   DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
  device_id  CHAR(36)  NOT NULL,
  act_id     INT       NOT NULL,
  created_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (device_id, act_id),
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  FOREIGN KEY (act_id)    REFERENCES acts(id)    ON DELETE CASCADE
);

CREATE TABLE push_subscriptions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  device_id   CHAR(36)     NOT NULL,
  endpoint    VARCHAR(500) NOT NULL UNIQUE,
  p256dh      VARCHAR(255) NOT NULL,
  auth_key    VARCHAR(255) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  body          TEXT         NOT NULL,
  url           VARCHAR(255) NULL,
  act_id        INT          NULL,
  scheduled_at  DATETIME     NULL,
  sent_at       DATETIME     NULL,
  FOREIGN KEY (act_id) REFERENCES acts(id) ON DELETE SET NULL
);

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- Stages
INSERT INTO stages (slug, name, short, img, color, desc_nl, desc_en, capacity, sort) VALUES
('ponton','Ponton','PON','/assets/ponton.png','#F03228',
  'Het openluchtpodium aan het water. De plek voor grote optredens onder de open hemel.',
  'The open-air waterside stage. Home to the headline performances under the open sky.',
  15000, 1),
('lake','The Lake','LAK','/assets/lake.png','#2B3BE5',
  'Drijvend podium midden op het water. Dans met je voeten in het zand.',
  'Floating stage on the lake. Dance with your feet in the sand.',
  8000, 2),
('club','The Club','CLB','/assets/club.png','#E5A52B',
  'Intiem, warm, elektronisch. Palmen en pulserende beats tot diep in de nacht.',
  'Intimate, warm, electronic. Palms and pulsing beats deep into the night.',
  3500, 3),
('hangar','Hangar','HNG','/assets/hangar.png','#ffffff',
  'Industriële dome met 360° licht en geluid. Pure rave-energie.',
  'Industrial dome with 360° light and sound. Pure rave energy.',
  6000, 4);

-- Genres
INSERT INTO genres (name) VALUES
('Trance'), ('EDM'), ('Rock'), ('Metal'), ('Symphonic metal'),
('Art rock'), ('Pop'), ('Reggae'), ('Hip-hop'), ('Folk'),
('Folk-pop'), ('Indie pop'), ('Singer-songwriter'),
('Electronic'), ('Spoken word');

-- Acts — incl. door AI gegenereerde, langere blurbs (`ai_blurb_*`) en clip-URL.
INSERT INTO acts (slug, name, tag, img, bio_nl, bio_en, ai_blurb_nl, ai_blurb_en, youtube_url, primary_genre_id) VALUES
('armin','Armin van Buuren','Trance legend','/assets/act_armin.png',
  'Vijfvoudig DJ Mag #1 en trance-pionier. Armin brengt zijn A State of Trance-ervaring naar het Ponton met een tweeuurs peak-time set.',
  'Five-time DJ Mag #1 and trance pioneer. Armin brings his A State of Trance experience to the Ponton with a two-hour peak-time set.',
  'Vier en twintig jaar nadat hij A State of Trance lanceerde, blijft Armin het ijkpunt van het genre. Verwacht een set die langzaam opbouwt van warme, dromerige progressives tot peak-time eufoor — met visuals die het Ponton lijken te laten ademen. Zijn samples wisselen klassiekers af met onuitgebrachte ID''s die hij vorige week pas in de studio afmaakte.',
  'Twenty-four years after launching A State of Trance, Armin remains the benchmark for the genre. Expect a set that climbs from warm, dreamy progressives to peak-time euphoria — with visuals that make the Ponton feel like it is breathing. His selection alternates between classics and unreleased IDs he only finished in the studio last week.',
  'https://www.youtube.com/watch?v=TxvpctgU_s8',
  (SELECT id FROM genres WHERE name = 'Trance')),
('martin','Martin Garrix','EDM producer','/assets/act_martin.png',
  'Nederlandse topproducer met wereldhits als Animals en Scared to Be Lonely. Verwacht grote drops en pyro.',
  'Dutch super-producer behind worldwide hits like Animals and Scared to Be Lonely. Expect huge drops and pyro.',
  'Hij was zeventien toen Animals de wereld plat legde — vandaag is Martin een productiemachine die de mainstream EDM-sound op eigen titel definieert. De show op ❤U combineert zijn grootste mainstage-momenten met materiaal van zijn nieuwe alias YTRAM voor de tech-house bezoekers. Pyro, lasers, en het volle gewicht van de Hangar-rig.',
  'He was seventeen when Animals broke the world — today Martin is a production machine defining the mainstream EDM sound on his own terms. His ❤U show fuses his biggest mainstage moments with material from his YTRAM alias for the tech-house heads. Pyro, lasers, and the full weight of the Hangar rig.',
  'https://www.youtube.com/watch?v=Zv1QV6lrc_Y',
  (SELECT id FROM genres WHERE name = 'EDM')),
('kensington','Kensington','Rock anthems','/assets/act_kensington.png',
  'Utrechtse rockband die stadions vol krijgt. Hymnen om je stem kwijt te raken.',
  'Utrecht rock band filling stadiums. Anthems to lose your voice to.',
  'Vier jongens uit Utrecht die altijd te luid klonken voor een café en ten slotte stadions vulden. Hun ❤U-set is een terugkeer naar huis: zelfde stad, zelfde publiek, drie keer zo veel mensen. Eén traan tijdens Streets is gegarandeerd.',
  'Four lads from Utrecht who always sounded too loud for the local pub and eventually filled stadiums. Their ❤U set is a homecoming: same city, same crowd, three times the people. One tear during Streets is guaranteed.',
  'https://www.youtube.com/watch?v=IH77eOyV95o',
  (SELECT id FROM genres WHERE name = 'Rock')),
('within','Within Temptation','Symphonic metal','/assets/act_within.png',
  'Sinds 1996 de belichaming van Nederlandse symfonische metal. Theatraal, episch, meeslepend.',
  'Since 1996 the embodiment of Dutch symphonic metal. Theatrical, epic, enveloping.',
  'Sharon den Adel zingt al bijna dertig jaar over wolven, kastelen en gebroken harten — en doet dat alsof het de eerste keer is. De live-show bevat strijkers, lichtjaren aan rookmachines en koorpartijen die je in je borstkas voelt. Cinematischer wordt rock zelden.',
  'Sharon den Adel has been singing about wolves, castles and broken hearts for nearly thirty years — and still does it like the first time. The live show features strings, light-years of fog and choral parts you feel in your chest. Rock rarely gets more cinematic than this.',
  'https://www.youtube.com/watch?v=iQVei5C2N4E',
  (SELECT id FROM genres WHERE name = 'Symphonic metal')),
('destaat','De Staat','Art rock','/assets/act_destaat.png',
  'Onvoorspelbare art-rock uit Nijmegen. Torre Florim en z''n band zoeken de rand op — altijd.',
  'Unpredictable art-rock from Nijmegen. Torre Florim and his band always push the edge.',
  'De Staat klinkt nooit twee shows hetzelfde. Verwacht hoekige gitaarriffs, halve klassieke arrangementen en momenten waarop de hele band tegelijk de hoek opzoekt. Eén nummer zal je doen springen, een ander zal je doen stilstaan. Allebei bedoeld.',
  'De Staat never sounds the same twice. Expect angular guitar riffs, half-classical arrangements and moments where the whole band corners together. One song will make you jump, the next will stop you cold. Both are intentional.',
  'https://www.youtube.com/watch?v=0ttGgIQpAUc',
  (SELECT id FROM genres WHERE name = 'Art rock')),
('chef','Chef''Special','Pop / hip-hop','/assets/act_chef.png',
  'Haarlemse feestmakers. Reggae, pop en hip-hop smelten samen tot zomerhits zoals In Your Arms.',
  'Haarlem party starters. Reggae, pop and hip-hop blend into summer hits like In Your Arms.',
  'Vijf Haarlemmers met een Zuid-Amerikaans hart. De vibe is een eindeloze zomeravond op een dakterras: trompetten over hiphop-beats, reggae-grooves onder een pop-refrein. Tegen het einde van de set zingt het hele Ponton het slotnummer harder dan de PA aankan.',
  'Five guys from Haarlem with a South-American heart. The vibe is an endless summer evening on a rooftop: trumpets over hip-hop beats, reggae grooves under a pop hook. By the end of the set the whole Ponton outsings the PA.',
  'https://www.youtube.com/watch?v=l3jRIr44lss',
  (SELECT id FROM genres WHERE name = 'Pop')),
('navarone','Navarone','Stadion-rock','/assets/act_splash.png',
  'Rockband uit Utrecht — riffs als muren, refreinen om mee te schreeuwen.',
  'Utrecht rock band — wall-of-sound riffs and chant-along choruses.',
  'Navarone speelt rock zoals het in 1975 bedoeld was: vol gas, geen excuses. Met The Lake als zandbak en een rijtje gitaarversterkers dat tot aan de waterlijn doorloopt, is dit hun grootste thuiswedstrijd ooit. Verwacht een eindeloos slot waarbij iedereen even doet alsof Foo Fighters Nederlands sprak.',
  'Navarone plays rock the way 1975 intended it: full throttle, no apologies. With The Lake as their sandbox and a wall of guitar amps reaching to the water, this is their biggest hometown show yet. Expect an endless finale where everyone briefly pretends Foo Fighters spoke Dutch.',
  'https://www.youtube.com/watch?v=EvLpaCSnc4k',
  (SELECT id FROM genres WHERE name = 'Rock')),
('dotan','Dotan','Folk-pop','/assets/act_distan.png',
  'Atmosferische folk-pop met grote koren. Bekend van Home en Numb.',
  'Atmospheric folk-pop with big choirs. Known for Home and Numb.',
  'Dotan brengt z''n nieuwe band mee, vier strijkers en een drummer die meer fluistert dan slaat. Het is folk-pop op kerkhofschaal — refreinen die je bij The Club hardop laten meezingen alsof het een mantra is. Een set voor de vroege avond, voor wanneer de zon over het meer zakt.',
  'Dotan brings his new band — four string players and a drummer who whispers more than he strikes. It is folk-pop on a cathedral scale — choruses that have The Club singing along like a mantra. An early-evening set, for when the sun dips behind the lake.',
  'https://www.youtube.com/watch?v=FZEuqzW16Nw',
  (SELECT id FROM genres WHERE name = 'Folk-pop')),
('eefje','Eefje de Visser','Indie-pop','/assets/act_sofia.png',
  'Nederlands eigen dream-pop visitekaartje — fluweelzachte vocalen op verfijnde elektronica.',
  'The Netherlands'' own dream-pop calling card — velvet vocals over refined electronics.',
  'Eefje de Visser bouwt haar nummers op zoals je een Polaroid ziet ontwikkelen — eerst contouren, dan kleur. Op het Ponton begeleidt een trio haar in subtiele synth-arrangementen. Het is geen optreden, het is een uur zachte focus waarin de rest van het terrein even uit zicht verdwijnt.',
  'Eefje de Visser builds her songs the way a Polaroid develops — first contours, then colour. At the Ponton a trio backs her with subtle synth arrangements. It is not a performance, it is an hour of soft focus during which the rest of the site momentarily vanishes.',
  'https://www.youtube.com/watch?v=6IlLJNmLDMg',
  (SELECT id FROM genres WHERE name = 'Indie pop')),
('froukje','Froukje','Indie-pop','/assets/act_nienke.png',
  'Generatie-Z stem met dromerige pop-productie en scherpe teksten.',
  'Generation-Z voice with dreamy pop production and razor-sharp lyrics.',
  'Froukje schrijft over klimaat, ongelijkheid en onzekerheid — maar nooit zonder humor en altijd met een refrein dat blijft hangen. Live is haar set een mini-festival op zichzelf: zacht beginnen, eindigen met een dansvloer. Voor wie denkt dat Nederlandstalige pop verstoft is, is dit dé wake-up call.',
  'Froukje writes about climate, inequality and uncertainty — but never without humour and always with a hook that sticks. Live, her set is a mini-festival of its own: gentle start, dance-floor finale. For anyone who thinks Dutch-language pop is dusty, this is the wake-up call.',
  'https://www.youtube.com/watch?v=g4PlReX9e-E',
  (SELECT id FROM genres WHERE name = 'Indie pop')),
('spinvis','Spinvis','Spoken-word pop','/assets/act_prodeje.png',
  'Erik de Jong''s muzikale schetsboek — half zang, half vertelling, altijd raak.',
  'Erik de Jong''s musical sketchbook — half song, half storytelling, always on point.',
  'Spinvis bestaat al twee decennia, en toch klinkt elk concert als iets dat hij vannacht uitvond. De nummers zijn fragmenten — straten, namen, oude kamers — en toch klinkt het hele oeuvre als één lang verhaal. Een ideaal moment voor wie even wil ophouden te dansen en weer wil léren luisteren.',
  'Spinvis has existed for two decades, yet every concert sounds like something he invented last night. The songs are fragments — streets, names, old rooms — and yet the entire body of work sounds like one long story. The perfect moment to stop dancing and start listening again.',
  'https://www.youtube.com/watch?v=F3ZTrGWSLf4',
  (SELECT id FROM genres WHERE name = 'Spoken word'));

-- Extra genre-tags (many-to-many)
INSERT INTO act_genres (act_id, genre_id) VALUES
  ((SELECT id FROM acts WHERE slug='armin'),     (SELECT id FROM genres WHERE name='Trance')),
  ((SELECT id FROM acts WHERE slug='armin'),     (SELECT id FROM genres WHERE name='Electronic')),
  ((SELECT id FROM acts WHERE slug='martin'),    (SELECT id FROM genres WHERE name='EDM')),
  ((SELECT id FROM acts WHERE slug='martin'),    (SELECT id FROM genres WHERE name='Electronic')),
  ((SELECT id FROM acts WHERE slug='kensington'),(SELECT id FROM genres WHERE name='Rock')),
  ((SELECT id FROM acts WHERE slug='within'),    (SELECT id FROM genres WHERE name='Metal')),
  ((SELECT id FROM acts WHERE slug='within'),    (SELECT id FROM genres WHERE name='Symphonic metal')),
  ((SELECT id FROM acts WHERE slug='destaat'),   (SELECT id FROM genres WHERE name='Art rock')),
  ((SELECT id FROM acts WHERE slug='destaat'),   (SELECT id FROM genres WHERE name='Rock')),
  ((SELECT id FROM acts WHERE slug='chef'),      (SELECT id FROM genres WHERE name='Pop')),
  ((SELECT id FROM acts WHERE slug='chef'),      (SELECT id FROM genres WHERE name='Hip-hop')),
  ((SELECT id FROM acts WHERE slug='chef'),      (SELECT id FROM genres WHERE name='Reggae')),
  ((SELECT id FROM acts WHERE slug='navarone'),  (SELECT id FROM genres WHERE name='Rock')),
  ((SELECT id FROM acts WHERE slug='dotan'),     (SELECT id FROM genres WHERE name='Folk-pop')),
  ((SELECT id FROM acts WHERE slug='dotan'),     (SELECT id FROM genres WHERE name='Folk')),
  ((SELECT id FROM acts WHERE slug='eefje'),     (SELECT id FROM genres WHERE name='Indie pop')),
  ((SELECT id FROM acts WHERE slug='eefje'),     (SELECT id FROM genres WHERE name='Electronic')),
  ((SELECT id FROM acts WHERE slug='froukje'),   (SELECT id FROM genres WHERE name='Indie pop')),
  ((SELECT id FROM acts WHERE slug='froukje'),   (SELECT id FROM genres WHERE name='Pop')),
  ((SELECT id FROM acts WHERE slug='spinvis'),   (SELECT id FROM genres WHERE name='Spoken word')),
  ((SELECT id FROM acts WHERE slug='spinvis'),   (SELECT id FROM genres WHERE name='Indie pop'));

-- Programma (via INT-FKs naar stages en acts)
INSERT INTO schedule (day, stage_id, act_id, start_h, end_h) VALUES
('saturday', (SELECT id FROM stages WHERE slug='ponton'), (SELECT id FROM acts WHERE slug='destaat'),    14,   15),
('saturday', (SELECT id FROM stages WHERE slug='ponton'), (SELECT id FROM acts WHERE slug='kensington'), 16,   17.5),
('saturday', (SELECT id FROM stages WHERE slug='ponton'), (SELECT id FROM acts WHERE slug='chef'),       18.5, 20),
('saturday', (SELECT id FROM stages WHERE slug='ponton'), (SELECT id FROM acts WHERE slug='within'),     21,   22.5),
('saturday', (SELECT id FROM stages WHERE slug='ponton'), (SELECT id FROM acts WHERE slug='armin'),      23,   25),
('saturday', (SELECT id FROM stages WHERE slug='lake'),   (SELECT id FROM acts WHERE slug='froukje'),     13,   14),
('saturday', (SELECT id FROM stages WHERE slug='lake'),   (SELECT id FROM acts WHERE slug='eefje'),      15,   16),
('saturday', (SELECT id FROM stages WHERE slug='lake'),   (SELECT id FROM acts WHERE slug='dotan'),     17,   18),
('saturday', (SELECT id FROM stages WHERE slug='lake'),   (SELECT id FROM acts WHERE slug='navarone'),     19,   20),
('saturday', (SELECT id FROM stages WHERE slug='lake'),   (SELECT id FROM acts WHERE slug='spinvis'),    21,   22),
('saturday', (SELECT id FROM stages WHERE slug='club'),   (SELECT id FROM acts WHERE slug='dotan'),     20,   21.5),
('saturday', (SELECT id FROM stages WHERE slug='club'),   (SELECT id FROM acts WHERE slug='martin'),     22,   24),
('saturday', (SELECT id FROM stages WHERE slug='club'),   (SELECT id FROM acts WHERE slug='armin'),       1,   3),
('saturday', (SELECT id FROM stages WHERE slug='hangar'), (SELECT id FROM acts WHERE slug='spinvis'),    22,   23.5),
('saturday', (SELECT id FROM stages WHERE slug='hangar'), (SELECT id FROM acts WHERE slug='martin'),      0.5, 2.5),
('sunday',   (SELECT id FROM stages WHERE slug='ponton'), (SELECT id FROM acts WHERE slug='froukje'),     13,   14),
('sunday',   (SELECT id FROM stages WHERE slug='ponton'), (SELECT id FROM acts WHERE slug='eefje'),      14.5, 15.5),
('sunday',   (SELECT id FROM stages WHERE slug='ponton'), (SELECT id FROM acts WHERE slug='within'),     17,   18.5),
('sunday',   (SELECT id FROM stages WHERE slug='ponton'), (SELECT id FROM acts WHERE slug='chef'),       20,   21.5),
('sunday',   (SELECT id FROM stages WHERE slug='ponton'), (SELECT id FROM acts WHERE slug='martin'),     22.5, 24),
('sunday',   (SELECT id FROM stages WHERE slug='lake'),   (SELECT id FROM acts WHERE slug='destaat'),    14,   15),
('sunday',   (SELECT id FROM stages WHERE slug='lake'),   (SELECT id FROM acts WHERE slug='kensington'), 16,   17),
('sunday',   (SELECT id FROM stages WHERE slug='lake'),   (SELECT id FROM acts WHERE slug='navarone'),     18,   19),
('sunday',   (SELECT id FROM stages WHERE slug='lake'),   (SELECT id FROM acts WHERE slug='spinvis'),    20,   21),
('sunday',   (SELECT id FROM stages WHERE slug='club'),   (SELECT id FROM acts WHERE slug='dotan'),     19,   20.5),
('sunday',   (SELECT id FROM stages WHERE slug='club'),   (SELECT id FROM acts WHERE slug='armin'),      22,   24),
('sunday',   (SELECT id FROM stages WHERE slug='hangar'), (SELECT id FROM acts WHERE slug='martin'),     20,   22),
('sunday',   (SELECT id FROM stages WHERE slug='hangar'), (SELECT id FROM acts WHERE slug='spinvis'),    23,   25);

-- Map-pins (stage_id via INT-FK)
INSERT INTO map_pins (slug, kind, num, x, y, label, stage_id) VALUES
('ponton','stage',1,210,295,'Ponton',  (SELECT id FROM stages WHERE slug='ponton')),
('lake',  'stage',2,455,585,'The Lake',(SELECT id FROM stages WHERE slug='lake')),
('club',  'stage',3,625,350,'The Club',(SELECT id FROM stages WHERE slug='club')),
('hangar','stage',4,145,800,'Hangar',  (SELECT id FROM stages WHERE slug='hangar')),
('ent1', 'entrance',NULL,400,1035,'Hoofdingang',NULL),
('f1',   'food',NULL,305,225,'Foodcourt Noord',NULL),
('f2',   'food',NULL,565,440,'Street Food',NULL),
('f3',   'food',NULL,250,870,'Hangar Bites',NULL),
('f4',   'food',NULL,525,895,'Foodmarkt Zuid',NULL),
('b1',   'bar',NULL,180,380,'Ponton Bar',NULL),
('b2',   'bar',NULL,555,300,'Beach Bar',NULL),
('b3',   'bar',NULL,405,665,'Lake Lounge',NULL),
('b4',   'bar',NULL,225,730,'Hangar Bar',NULL),
('b5',   'bar',NULL,615,920,'Main Bar',NULL),
('ic1',  'icecream',NULL,380,495,'IJskar',NULL),
('ic2',  'icecream',NULL,685,780,'IJskar',NULL),
('t1',   'toilet',NULL,115,255,'Toilet',NULL),
('t2',   'toilet',NULL,670,440,'Toilet',NULL),
('t3',   'toilet',NULL,340,760,'Toilet',NULL),
('t4',   'toilet',NULL,600,1000,'Toilet',NULL),
('t5',   'toilet',NULL,65,870,'Toilet',NULL),
('fa1',  'firstaid',NULL,435,975,'EHBO-post',NULL),
('fa2',  'firstaid',NULL,495,395,'EHBO-post',NULL),
('m1',   'merch',NULL,330,970,'Merchandise',NULL),
('lk1',  'locker',NULL,490,1015,'Lockers',NULL);

-- FAQ
INSERT INTO faqs (lang, question, answer, sort) VALUES
('nl','Ik gebruik medicatie. Wat nu?',
  'Neem je medicatie mee in de originele verpakking en zorg dat er niet meer dan nodig voor 1 dag op het terrein is. Bij twijfel: vraag onze EHBO-post om mee te helpen.',1),
('nl','Mag ik het festivalterrein tussentijds verlaten?',
  'Helaas niet. Om de veiligheid te waarborgen kun je alleen met een vip-pas heen en weer. We zorgen voor genoeg toiletten, eten en drinken binnen.',2),
('nl','Zijn er lockers?',
  'Ja, bij de ingang vind je kleine, middel en grote lockers. Je kunt ze de hele dag openen en sluiten met je wristband.',3),
('nl','Kan ik pinnen aan de bar?',
  'Zeker. Het hele terrein is cashless — wij accepteren alleen pin en contactless.',4),
('nl','Hoe laat begint het festival?',
  'Zaterdag 5 september om 12:00 uur. Programma loopt tot 03:00 uur.',5),
('en','I need to take medication. What now?',
  'Bring it in its original packaging and keep no more than one day''s supply on site. If in doubt, speak to our first-aid team.',1),
('en','Can I leave the festival grounds mid-day?',
  'Unfortunately not. For safety reasons only VIP passes allow re-entry. We''ll make sure there''s plenty of toilets, food and drinks inside.',2),
('en','Are there lockers?',
  'Yes — small, medium and large lockers are available at the entrance. Open & close them all day with your wristband.',3),
('en','Can I pay with card?',
  'Absolutely. The entire site is cashless — card and contactless only.',4),
('en','What time does it start?',
  'Saturday 5 September at 12:00. Programme runs until 03:00.',5);

-- Bereikbaarheid
INSERT INTO reach_items (lang, icon, title, descr, sort) VALUES
('nl','directions_bike','Fiets','Er is een grote gratis fietsenstalling waar je je fiets de hele dag kunt stallen.',1),
('nl','directions_car','Auto','In kaart zijn parkeerplekken aangeduid. Parkeren kan op P+R Papendorp, volg vanaf daar de borden.',2),
('nl','train','OV','Kom je met het openbaar vervoer naar Utrecht? Plan dan je trip via 9292.',3),
('nl','directions_bus','Shuttlebus','Vanaf Utrecht Centraal kun je een gratis shuttlebus nemen richting het festivalterrein.',4),
('nl','local_taxi','Taxi + Kiss & Ride','Navigeer naar Strijkviertel en volg de borden "Kiss & Ride" of de Taxi-borden.',5),
('en','directions_bike','Bike','Big free bike parking where you can leave your bike all day.',1),
('en','directions_car','Car','Parking is marked on the map. Park at P+R Papendorp and follow the signs.',2),
('en','train','Public transport','Coming by train? Plan your journey with 9292.',3),
('en','directions_bus','Shuttle bus','Free shuttle bus from Utrecht Central to the festival site.',4),
('en','local_taxi','Taxi + Kiss & Ride','Navigate to Strijkviertel and follow the Kiss & Ride or Taxi signs.',5);

-- Algemene info
INSERT INTO info_facts (fkey, lang, value) VALUES
('address','nl','Strijkviertelweg, Utrecht'),
('address','en','Strijkviertelweg, Utrecht'),
('date','nl','5–6 september 2026'),
('date','en','5–6 September 2026'),
('time','nl','12:00 – 03:00'),
('time','en','12:00 – 03:00'),
('lockers','nl','Op het festivalterrein zijn lockers aanwezig waar je je spullen veilig kunt opbergen. Klein €4 · Middel €6 · Groot €8.'),
('lockers','en','Lockers are available on site to safely store your belongings. Small €4 · Medium €6 · Large €8.');
