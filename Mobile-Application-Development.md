# Mobile Application Development

**Naam:** Tom Tiedemann
**Datum:** 24-04-2026
**Opdracht:** Mobile Application Development – Onderzoeksvragen

---

## Inleiding

In 2007 bracht Apple de eerste versie van de revolutionaire iPhone op de markt. Drie jaar later volgde de iPad. Vanaf dat moment werden 'smartphones' en 'tablets' onderdeel van ons dagelijks leven.

Deze 'mobile devices' hebben het afgelopen decennium enorm veel invloed gehad op onze samenleving en onze manier van leven. Denk daarbij bijvoorbeeld aan de bijdrage die ze hebben geleverd aan de opkomst van het gebruik van 'social media'.

Op dit moment kunnen Android-gebruikers in de 'Google Play Store' kiezen uit bijna 3 miljoen apps. Apple-gebruikers kunnen in Apple's 'App Store' terecht voor bijna 2 miljoen apps. Mobile Application Development is 'serious business'!

---

## Mobile Devices

### Vraag 1: Welke soorten 'mobile devices' zijn er? Noem er op zijn minst 4.

**Antwoord:**

1. **Smartphone** – Een mobiele telefoon met touchscreen en internetverbinding waarmee je apps kunt draaien (bijv. iPhone, Samsung Galaxy).
2. **Tablet** – Een groter apparaat met touchscreen zonder toetsenbord, bedoeld voor mediaconsumptie, browsen en lichte productiviteitstaken (bijv. iPad, Samsung Galaxy Tab).
3. **Smartwatch** – Een draagbaar horloge met touchscreen dat gekoppeld wordt aan een smartphone en gebruikt wordt voor notificaties, gezondheidsmetingen en apps (bijv. Apple Watch, Garmin).
4. **E-reader** – Een mobiel apparaat specifiek gemaakt voor het lezen van e-books, vaak met een e-ink scherm (bijv. Amazon Kindle, Kobo).
5. **Laptop / 2-in-1 device** – Draagbare computer die steeds mobieler wordt, met soms touchscreen en detachable keyboard (bijv. Microsoft Surface).
6. **Wearables / Fitness trackers** – Kleine draagbare apparaten voor het meten van bewegings- en gezondheidsdata (bijv. Fitbit, Oura Ring).

---

### Vraag 2: Welke verschillende besturingssystemen bestaan er voor mobile devices? Noem er op zijn minst 4 en benoem daarbij ook het marktaandeel.

**Antwoord:**

| Besturingssysteem | Fabrikant | Marktaandeel (wereldwijd, 2025) |
|---|---|---|
| **Android** | Google | ± 71% |
| **iOS** | Apple | ± 28% |
| **HarmonyOS** | Huawei | ± 2% |
| **KaiOS** | KaiOS Technologies | < 1% |
| **Windows (Mobile)** | Microsoft | Verwaarloosbaar (uitgefaseerd) |
| **Wear OS** | Google (voor smartwatches) | n.v.t. (wearables) |

*Bron: StatCounter GlobalStats*

---

### Vraag 3: Wat zijn de meest bekende producenten van mobile devices? Noem er op zijn minst 4 en benoem daarbij ook het marktaandeel.

**Antwoord:**

| Producent | Marktaandeel smartphones (wereldwijd, 2025) |
|---|---|
| **Samsung** | ± 20% |
| **Apple** | ± 18% |
| **Xiaomi** | ± 14% |
| **Oppo** | ± 9% |
| **Vivo** | ± 8% |
| **Huawei** | ± 6% |

*Bron: IDC / Counterpoint Research*

---

### Vraag 4: Wat zijn typische kenmerken van mobile devices? Noem er op zijn minst 6 en benoem daarbij ook gangbare waarden.

**Antwoord:**

1. **Schermresolutie** – Gangbaar: 1080 x 2400 px (Full HD+) tot 1440 x 3200 px (QHD+).
2. **Schermgrootte** – Gangbaar: 5.5" – 6.8" voor smartphones, 10" – 13" voor tablets.
3. **Processor (SoC)** – Bijv. Apple A17 Pro, Qualcomm Snapdragon 8 Gen 3, MediaTek Dimensity 9300.
4. **RAM (werkgeheugen)** – Gangbaar: 6 GB – 16 GB.
5. **Opslagcapaciteit** – Gangbaar: 128 GB – 1 TB intern.
6. **Accucapaciteit** – Gangbaar: 3.000 – 5.500 mAh.
7. **Gewicht** – Gangbaar: 150 – 240 gram voor smartphones.
8. **Connectiviteit** – Wifi 6/7, Bluetooth 5.3, 5G, NFC, GPS.
9. **Camera** – Gangbaar: 12 MP – 200 MP hoofdcamera, meerdere lenzen.
10. **Touchscreen-technologie** – Capacitief multi-touch (OLED of LCD).

---

### Vraag 5: Wat zijn typische functies van mobile devices? Noem er op zijn minst 6 en benoem daarbij ook wat dit mogelijk maakt.

**Antwoord:**

1. **Foto's en video's maken** – Mogelijk dankzij ingebouwde camera's en beeldsensoren.
2. **Bellen en videobellen** – Mogelijk dankzij mobiele netwerkverbinding (4G/5G) en camera + microfoon.
3. **Navigatie / locatiebepaling** – Mogelijk dankzij GPS-, GLONASS- en Galileo-ontvangers.
4. **Betalen (contactloos)** – Mogelijk dankzij NFC-chip (bijv. Apple Pay, Google Pay).
5. **Biometrische authenticatie** – Mogelijk dankzij vingerafdruksensor of Face ID (IR-camera).
6. **Bewegingsmeting / fitness tracking** – Mogelijk dankzij accelerometer, gyroscoop en hartslagsensor.
7. **Stembesturing** – Mogelijk dankzij microfoon + AI-assistenten (Siri, Google Assistant).
8. **Schermoriëntatie draaien** – Mogelijk dankzij een gyroscoop en accelerometer.
9. **Draadloos opladen** – Mogelijk dankzij Qi-inductiespoelen.
10. **Augmented Reality (AR)** – Mogelijk dankzij camera + gyroscoop + LiDAR-sensor.

---

## Mobile Apps

### Vraag 1: Welke (drie) verschillende technische types van 'mobile apps' zijn er te onderscheiden?

**Antwoord:**

1. **Native apps** – Apps die specifiek voor één platform (iOS of Android) zijn geschreven in de oorspronkelijke programmeertaal van dat platform (Swift/Objective-C voor iOS, Kotlin/Java voor Android).
2. **Web apps / Progressive Web Apps (PWA)** – Apps die draaien in een browser, gebouwd met webtechnologieën (HTML, CSS, JavaScript). Een PWA kan offline werken en voelt aan als een native app.
3. **Hybrid apps / Cross-platform apps** – Apps die met één codebase voor meerdere platformen worden gebouwd, bijvoorbeeld met frameworks zoals React Native, Flutter, Ionic of Xamarin.

---

### Vraag 2: Wat zijn de voor- en nadelen van deze verschillende types?

#### Native apps

**Voordelen:**
1. Beste prestaties en snelheid omdat de app direct communiceert met de hardware.
2. Volledige toegang tot alle device-functionaliteit (camera, sensoren, bluetooth, etc.).
3. Beste gebruikerservaring (UX) omdat de app de native UI-richtlijnen van het platform volgt.

**Nadelen:**
1. Duurder om te ontwikkelen – aparte codebase per platform nodig.
2. Langere ontwikkeltijd.
3. Onderhoud is complexer omdat er meerdere versies beheerd moeten worden.

#### Web apps / PWA

**Voordelen:**
1. Eén codebase die werkt op alle apparaten met een browser.
2. Geen installatie via een app-store nodig – direct toegankelijk via een URL.
3. Goedkoper en sneller te ontwikkelen.

**Nadelen:**
1. Beperkte toegang tot device-hardware (bijv. Bluetooth, NFC op iOS).
2. Prestaties zijn minder goed dan bij native apps.
3. Afhankelijk van een internetverbinding (hoewel PWA's offline caching ondersteunen).

#### Hybrid / Cross-platform apps

**Voordelen:**
1. Eén codebase voor meerdere platformen (iOS én Android).
2. Sneller en goedkoper ontwikkelen dan native.
3. Toegang tot de meeste native functionaliteit via plugins/bridges.

**Nadelen:**
1. Prestaties zijn meestal iets minder dan native.
2. Afhankelijk van het framework en plugins van derden – updates kunnen vertraging opleveren.
3. UI voelt soms minder 'native' aan voor de gebruiker.

---

### Vraag 3: Geef van elk type een voorbeeld van een bestaande (en bekende) app.

**Antwoord:**

| Type | Voorbeeld |
|---|---|
| **Native** | WhatsApp (iOS-versie in Swift, Android-versie in Java/Kotlin), Apple Maps, Google Pay |
| **Web app / PWA** | Twitter Lite, Starbucks PWA, Spotify Web Player, Pinterest PWA |
| **Hybrid / Cross-platform** | Instagram (React Native), Facebook (React Native), Microsoft Teams, Alibaba (Flutter), Google Ads (Flutter) |

---

## Mobile Application Development

### Vraag 1: Wat is een 'Integrated Development Environment' (IDE)? Omschrijf dit in je eigen woorden.

**Antwoord:**

Een **Integrated Development Environment (IDE)** is een softwareprogramma waarin een ontwikkelaar alle benodigde tools bij elkaar heeft om software te maken. Een IDE combineert meestal:

- Een **code-editor** (met syntax-highlighting en auto-complete)
- Een **compiler** of **interpreter** (om de code uitvoerbaar te maken)
- Een **debugger** (om fouten in de code op te sporen)
- Een **emulator/simulator** (om de app te testen zonder fysiek apparaat)
- **Versiebeheer-integratie** (zoals Git)

Kortom, een IDE is een complete 'werkplaats' voor programmeurs waarmee je efficiënter kunt bouwen, testen en debuggen zonder te hoeven wisselen tussen verschillende losse tools.

---

### Vraag 2: Welke IDE's zijn geschikt voor 'Mobile Application Development'? Noem er op zijn minst 3.

**Antwoord:**

1. **Android Studio** – De officiële IDE van Google voor Android-ontwikkeling. Ondersteunt Kotlin en Java en bevat een Android-emulator.
2. **Xcode** – De officiële IDE van Apple voor iOS-, iPadOS-, watchOS- en macOS-ontwikkeling. Ondersteunt Swift en Objective-C.
3. **Visual Studio Code (VS Code)** – Een lichtgewicht, platformonafhankelijke editor van Microsoft. Met extensies zeer geschikt voor React Native, Flutter, Ionic en PWA-ontwikkeling.
4. **JetBrains IntelliJ IDEA / WebStorm** – Krachtige IDE's van JetBrains voor Java, Kotlin en webtechnologieën.
5. **Visual Studio** – Van Microsoft, met ondersteuning voor .NET MAUI en Xamarin voor cross-platform apps.

---

### Vraag 3: Welke programmeertalen kun je gebruiken om apps te maken? Noem er op zijn minst 3.

**Antwoord:**

1. **Swift** – De moderne taal van Apple voor iOS- en macOS-app-ontwikkeling.
2. **Kotlin** – De officiële taal voor Android-ontwikkeling, aanbevolen door Google.
3. **Java** – Traditioneel gebruikt voor Android-ontwikkeling, nog steeds veelgebruikt.
4. **JavaScript / TypeScript** – Gebruikt voor PWA's en cross-platform apps (React Native, Ionic).
5. **Dart** – De taal die hoort bij Flutter (Google's cross-platform framework).
6. **C#** – Gebruikt bij .NET MAUI en Xamarin voor cross-platform apps.
7. **HTML/CSS** – Samen met JavaScript de basis van web apps en PWA's.
8. **Objective-C** – De oudere taal van Apple, nog steeds gebruikt in legacy iOS-apps.

---

## Bronnen

- StatCounter GlobalStats – <https://gs.statcounter.com/>
- IDC Smartphone Tracker – <https://www.idc.com/>
- Counterpoint Research – <https://www.counterpointresearch.com/>
- Google Developers – <https://developer.android.com/>
- Apple Developer – <https://developer.apple.com/>
- MDN Web Docs (PWA) – <https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps>
- Flutter – <https://flutter.dev/>
- React Native – <https://reactnative.dev/>

---

*Einde document*
