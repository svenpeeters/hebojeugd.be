# Season Intent Systeem

Dit document beschrijft hoe het huidige `season-intent` systeem werkt in deze repo, en hoe we het veilig stap voor stap kunnen testen.

## Status

- Er is momenteel niets verstuurd.
- `dry-run` verstuurt niets.
- `test` en `send` zijn operationeel.
- Verzending kan per ploeg gefilterd worden via `filter.teams`.
- Persistente opslag loopt nu via Convex, niet meer via lokale JSON-bestanden.

## Doel

Het systeem dient om ouders van leden een email te sturen met de vraag of hun kind volgend seizoen:

- blijft
- stopt
- eerst nog wil overleggen

Elke ouder-kind combinatie krijgt een aparte email.

## Brondata

De season-intent flow leest zijn ledenbasis nu uit Convex.

De CSV blijft alleen nog de importbron voor snapshots.

Bronbestand voor import:

- `data/members.csv`

Importscript:

- `scripts/import-members-to-convex.ts`

Deze CSV wordt lokaal vanaf je machine in Convex geimporteerd. De Vercel runtime hoeft de CSV daarna niet meer te lezen.

## Hoe recipients worden opgebouwd

De parser zit in:

- `src/lib/members.ts`

Convex wordt gebruikt als persistente snapshot-opslag van leden. Voor season-intent wordt daaruit een verzendbare lijst opgebouwd met exact 1 record per ouder-kind combinatie.

Per record wordt een `uuid v4` gegenereerd.

Voorbeeld van een recipient:

```json
{
  "id": "6df1a9d6-5f1d-4f53-a8e8-6e0e53b7f08d",
  "to": "liesbeth.janssens2@gmail.com",
  "parentRole": "mama",
  "childName": "Peeters Charel",
  "ploeg": "U9",
  "club": "HEBO"
}
```

## Welke rijen worden meegenomen

Alleen deze jeugdploegen worden meegenomen:

- `U5`
- `U6`
- `U7`
- `U9`
- `U10`
- `U11`
- `U12`
- `U15`
- `U17`

## Welke rijen worden uitgesloten

Het systeem sluit onder meer uit:

- `Staff`
- `Veteranen`
- andere niet-ondersteunde ploegwaarden
- rijen zonder geldig emailadres
- ongeldige emailadressen zoals `??`
- dubbele mama/papa-email binnen dezelfde rij

Als mama en papa hetzelfde emailadres hebben op dezelfde CSV-rij, dan wordt er maar 1 recipient aangemaakt voor die ouder-kind rij.

## API endpoints

### 1. POST `/api/season-intent`

Bestand:

- `src/pages/api/season-intent.ts`

Dit endpoint bouwt de recipient-lijst op en ondersteunt 3 modi:

- `dry-run`
- `test`
- `send`

Authenticatie gebeurt via:

- `Authorization: Bearer <SEASON_INTENT_TOKEN>`

### Request body

```json
{
  "mode": "dry-run"
}
```

Voor `test`:

```json
{
  "mode": "test",
  "filter": {
    "childNames": ["Peeters Juul", "Peeters Charel"],
    "parentRoles": ["mama", "papa"]
  }
}
```

Je kan ook gericht alleen naar mama of alleen naar papa sturen:

```json
{
  "mode": "test",
  "filter": {
    "childNames": ["Peeters Juul", "Peeters Charel"],
    "parentRoles": ["mama"]
  }
}
```

Voor een gerichte `send` per ploeg:

```json
{
  "mode": "send",
  "filter": {
    "teams": ["U11"]
  }
}
```

Meerdere ploegen tegelijk:

```json
{
  "mode": "send",
  "filter": {
    "teams": ["U11", "U12"]
  }
}
```

Filters zijn combineerbaar:

```json
{
  "mode": "send",
  "filter": {
    "teams": ["U11"],
    "childNames": ["Peeters Juul"],
    "parentRoles": ["mama"]
  }
}
```

### Gedrag per mode

#### `dry-run`

- leest actieve `members` uit Convex
- filtert en normaliseert recipients
- genereert UUIDs
- kan optioneel filteren op `filter.childNames`, `filter.parentRoles` en `filter.teams`
- geeft `selectedRecipients` terug op basis van de filter
- geeft de volledige lijst met uitgesloten records terug
- schrijft niets weg
- verstuurt niets

#### `test`

- vereist `filter.childNames`
- ondersteunt optioneel `filter.parentRoles` en `filter.teams`
- verstuurt alleen naar de echte adressen van de geselecteerde kinderen
- bewaart de gebruikte filter in de campagne-metadata
- schrijft campagne- en recipient-data weg

#### `send`

- stuurt mails naar de echte ontvangers
- ondersteunt optioneel `filter.childNames`, `filter.parentRoles` en `filter.teams` voor een gerichte verzending
- schrijft campagne- en recipient-data weg
- deduplicatie: ontvangers die al een mail kregen in een eerdere `send`-campaign worden automatisch overgeslagen

Alle modi zijn operationeel. Gebruik `dry-run` om eerst te controleren welke recipients geselecteerd worden.

### Deduplicatie

Bij elke `dry-run`, `test` of `send` call wordt automatisch gecontroleerd welke ontvangers al een mail ontvingen in een eerdere `send`-campaign. De dedup-sleutel is de combinatie van `email + childName + parentRole`.

Het response bevat altijd:

- `newRecipientCount`: aantal ontvangers die effectief (zouden) worden gemaild
- `deduplicatedCount`: aantal ontvangers die overgeslagen worden
- `deduplicatedRecipients`: lijst van overgeslagen ontvangers (met `to`, `childName`, `parentRole`, `ploeg`)

In `dry-run` mode toont `selectedRecipients` alleen de nieuwe ontvangers (na deduplicatie).

In `send` mode: als alle geselecteerde ontvangers al gemaild werden, wordt er niets verstuurd en bevat het response een `message` veld.

### 2. GET `/api/season-intent/respond/[id]`

Bestand:

- `src/pages/api/season-intent/respond/[id].ts`

De links in de email verwijzen naar een UUID-gebaseerde route, bijvoorbeeld:

- `/api/season-intent/respond/<uuid>?choice=stay`
- `/api/season-intent/respond/<uuid>?choice=leave`
- `/api/season-intent/respond/<uuid>?choice=talk`

### Klikgedrag

Bij eerste geldige klik:

- wordt de keuze opgeslagen
- krijgt de gebruiker een bevestigingspagina

Bij een volgende klik op dezelfde UUID:

- krijgt de gebruiker de melding: `je hebt je keuze al doorgegeven`
- de keuze wordt niet overschreven

## Convex-opslag

Bestand:

- `src/lib/season-intent/storage.ts`
- `src/lib/members-storage.ts`
- `convex/schema.ts`
- `convex/seasonIntent.ts`
- `convex/members.ts`

De persistente data wordt bewaard in Convex, in deze tabellen:

- `memberImports`
- `members`
- `campaigns`
- `seasonIntentRecipients`
- `seasonIntentResponses`

`memberImports`

- 1 snapshot per CSV-import
- exact 1 import is actief

`members`

- de geimporteerde ledenrijen van de actieve of historische snapshots
- season-intent leest hieruit in plaats van rechtstreeks uit CSV

### Betekenis

`campaigns`

- metadata per verzendrun
- inclusief eventuele `filter`

`seasonIntentRecipients`

- alle effectief aangemaakte verzendrecords met UUID

`seasonIntentResponses`

- vastgelegde keuzes per UUID

`externalId` blijft de publieke UUID in de maillinks. Convex `_id` blijft intern.

## Email template

Bestanden:

- `src/lib/season-intent/email-template.tsx`
- `src/lib/season-intent/email.ts`

De template is lokaal opgenomen in deze repo.

De email bevat 3 keuze-links:

- blijven
- stoppen
- praten

Onderwerpen worden per kind gepersonaliseerd.

In `test` mode krijgt het onderwerp een prefix:

- `[TEST]`

## Environment variabelen

Benodigd voor uiteindelijke verzending:

- `SEASON_INTENT_TOKEN`
- `CONVEX_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- optioneel `RESEND_REPLY_TO`
- optioneel `SEASON_INTENT_BASE_URL`

Voor Convex zelf heb je lokaal of in Vercel ook de deploymentconfig nodig die `npx convex dev` of `npx convex deploy` aanmaakt.

Aanbevolen:

- `RESEND_FROM_EMAIL=info@hebojeugd.be`

### Voorbeeld `.env`

```env
SEASON_INTENT_TOKEN=replace-with-a-long-random-token
CONVEX_URL=https://your-deployment.convex.cloud
RESEND_API_KEY=re_replace_me
RESEND_FROM_EMAIL=info@hebojeugd.be
# Optional
# RESEND_REPLY_TO=info@hebojeugd.be
# SEASON_INTENT_BASE_URL=https://www.hebojeugd.be
```

Voor deze Astro-app is `CONVEX_URL` de belangrijkste Convex env var.

Op Vercel zet je dezelfde variabelen in de project environment variables.

## Huidige dry-run uitkomst

Laatste gecontroleerde resultaat:

- `sourceRows`: 160
- `recipientCount`: 196
- `skipped.staff`: 13
- `skipped.unsupported_team`: 6
- `skipped.duplicate_parent_email`: 1
- `skipped.invalid_email`: 2
- `skipped.missing_email`: 7

## Veilig testplan

Onderstaande stappen zijn bewust opgesplitst van veilig naar risicovoller.

### Fase 1: Alleen parser en filtering controleren

Doel:

- bevestigen dat CSV correct wordt gelezen
- bevestigen dat alleen de juiste doelgroepen meegenomen worden
- bevestigen dat UUIDs gegenereerd worden
- de volledige genormaliseerde output valideren tegen de CSV

Uitvoeren:

```bash
curl -X POST http://localhost:4321/api/season-intent \
  -H "Authorization: Bearer <SEASON_INTENT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"mode":"dry-run"}'
```

Of met een team-filter:

```bash
curl -X POST http://localhost:4321/api/season-intent \
  -H "Authorization: Bearer <SEASON_INTENT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"mode":"dry-run","filter":{"teams":["U11"]}}'
```

Controleren:

- totaal aantal recipients
- selectedRecipients klopt met de filter
- UUIDs aanwezig
- skipped redenen logisch
- uitgesloten records volledig nalopen

Deze stap verstuurt niets.

### Fase 2: Handmatig inhoud van de email controleren zonder te verzenden

Doel:

- controleren of onderwerp en keuze-links correct opgebouwd zijn

Aanpak:

- 1 preview recipient uit de `dry-run` output nemen
- lokaal de gegenereerde metadata en links inspecteren
- geen `test` of `send` gebruiken

Deze stap verstuurt niets.

### Fase 3: Resend configuratie voorbereiden

Doel:

- klaarzetten voor veilige testverzending later

Te doen:

- oude gedeelde API key roteren
- nieuwe `RESEND_API_KEY` veilig als env var instellen
- `info@hebojeugd.be` als afzenderdomein in Resend verifiëren

Deze stap verstuurt nog steeds niets zolang `test` of `send` niet gebruikt wordt.

### Fase 4: Testverzending naar 1 adres

Deze fase gebruikt niet langer `testEmail`, maar een gerichte selectie op kindnaam.

Pas doen na expliciete goedkeuring.

Doel:

- controleren hoe de mail echt aankomt

Uitvoeren:

```bash
curl -X POST http://localhost:4321/api/season-intent \
  -H "Authorization: Bearer <SEASON_INTENT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"mode":"test","filter":{"childNames":["Peeters Juul","Peeters Charel"],"parentRoles":["mama"]}}'
```

Verwacht gedrag:

- alleen mails voor de geselecteerde kinderen worden verstuurd
- die mails gaan naar de echte ouderadressen van die kinderen

Pas na manuele review van de ontvangen mails verdergaan.

### Fase 5: Klikflow testen

Doel:

- controleren dat keuzes correct worden opgeslagen

Te testen:

- 1 geldige keuze-link aanklikken
- bevestiging bekijken
- dezelfde link opnieuw openen
- melding controleren: `je hebt je keuze al doorgegeven`

Verifiëren:

- `seasonIntentResponses` in Convex bevat de eerste keuze
- tweede klik overschrijft niets

### Fase 6: Echte verzending

Pas doen na expliciete goedkeuring.

Voorwaarden:

- dry-run gevalideerd
- email-inhoud gevalideerd
- Resend domein correct
- nieuwe API key ingesteld
- testverzending naar 1 adres goedgekeurd
- klikflow gevalideerd

Pas dan `mode: send` gebruiken.

## Belangrijke veiligheidsregels

- Gebruik altijd eerst `dry-run` met dezelfde filter om te controleren wie geselecteerd wordt.
- Sla API keys nooit op in de repo op.
- Deel API keys niet in chat of code.

## Eerste Convex setup

Voor een clean start met Convex:

1. Installeer dependencies:

```bash
npm install
```

2. Start een Convex dev deployment en log in:

```bash
npm run convex:dev
```

3. Laat Convex de backendcode syncen:

- `convex/schema.ts`
- `convex/seasonIntent.ts`

4. Zet de relevante Convex URL daarna als env var voor Astro:

- `CONVEX_URL`

Lokaal kan je die in `.env` of `.env.local` zetten. Op Vercel zet je die in de project settings.

Het importscript `scripts/import-members-to-convex.ts` leest lokaal automatisch eerst `.env.local` en daarna `.env`.

5. Voor productie deploy je later expliciet:

```bash
npm run convex:deploy
```

`dry-run` blijft ook na deze setup volledig write-free.

## Members CSV import

De leden-CSV wordt als snapshot in Convex geimporteerd.

Dry-run van de import:

```bash
npm run members:import:dry-run
```

Echte import naar Convex:

```bash
npm run members:import
```

Gedrag:

- elke import maakt een nieuwe snapshot
- de nieuwe import wordt actief
- vorige imports blijven historisch bewaard maar worden inactief
- season-intent leest altijd de actieve import

## Bekende beperking

`astro check` wordt momenteel niet volledig groen door een bestaande, niet-gerelateerde fout in:

- `src/pages/inschrijven-alt.astro:219`

De build zelf slaagt wel.
