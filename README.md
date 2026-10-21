# Leya Nilsson – Personal Brand & Portfolio

Välkommen till den officiella portfolio-webbplatsen för **Leya Nilsson**, Digital Marketing Specialist studerande vid IHM Business School i Göteborg.

## 📌 Om projektet
Webbplatsen är en interaktiv och modern portfolio som presenterar personligt varumärke, specialistkompetenser, erfarenheter och kontaktvägar. Designen följer en redaktionell, stilren estetik i beige och djup mörkblå med fokus på tillgänglighet, responsivitet och typografi.

## 🚀 Nyckelfunktioner
- **Hero & Personligt varumärke:** Tydlig profilering och visuell identitet.
- **Rullande ticker:** Dynamiskt presentationsband med kärnområden.
- **Kompetenser:** Detaljerade block för SEO, Paid Media, AI & Tech, Tracking, Content & Strategi.
- **Om mig & Meriter:** Bakgrund, utbildning och nyckeltal.
- **Erfarenheter & Case:** Praktiska erfarenheter inom marknadsföring, service och ledarskap.
- **Kontaktsektion:** Smidig kontakt med snabbkopiering av e-postadress.

## 🛠️ Teknikstack
- **HTML5** – Semantisk och SEO-optimerad struktur
- **CSS3** – Skräddarsytt designsystem, CSS-variabler, flexbox och CSS grid
- **JavaScript (ES6+)** – Interaktiva funktioner och mikroanimationer

## 🌐 Kontaktformulär
Formuläret skickar meddelanden direkt till `leya@sandtex.se` via en serverfunktion (`/api/contact`) och Resend. Besökaren stannar på sidan. E-postadressen som anges i formuläret ställs in som svaradress.

### Konfiguration för produktion
Projektets `/api`-rutt kräver en Node-serverless driftsättning, till exempel Vercel Functions. Lägg till följande miljövariabler i Vercel:

- `RESEND_API_KEY`: API-nyckel från Resend.
- `CONTACT_FROM_EMAIL`: avsändaradress på en domän som verifierats i Resend.
- `CONTACT_TO_EMAIL`: valfri; standard är `leya@sandtex.se`.

`.env.example` visar variabelnamnen. Lägg aldrig den riktiga API-nyckeln i GitHub eller frontend. Efter konfiguration behöver sajten driftsättas om. Utan nyckel och verifierad avsändardomän svarar API:t med ett tydligt fel och visar alternativ e-postlänk.

