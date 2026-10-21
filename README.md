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
Kontaktformuläret öppnar besökarens e-postprogram med ett färdigifyllt utkast till `leya@sandtex.se`. Besökaren skickar meddelandet från sin e-postapp. Ingen server eller extern formulärtjänst behövs.
# Kontaktformulär till HubSpot

Kontaktformuläret skickar till `/api/contact`, som i sin tur använder HubSpots EU Forms API. Inga privata API-nycklar eller access tokens används i webbplatsen.

API-routen använder portal-ID `149565964` och formulär-ID `e374a30c-7c1c-4e9d-9a41-73f79d2c1574`. Innan driftsättning måste du lägga till följande miljövariabler i Vercel, med fältens **interna namn** från just detta HubSpot-formulär:

- `HUBSPOT_FIELD_FIRSTNAME`
- `HUBSPOT_FIELD_LASTNAME`
- `HUBSPOT_FIELD_EMAIL`
- `HUBSPOT_FIELD_COMPANY`
- `HUBSPOT_FIELD_MESSAGE`

`.env.example` listar nycklarna. Fältkopplingarna, eventuellt samtycke och spam-/CAPTCHA-krav måste verifieras i HubSpot. API:t lägger inte till eller kringgår samtycke; om HubSpot kräver ett samtyckesfält behöver integrationen utökas med formulärets faktiska inställningar.

