# VC HEBO Jeugd

Website voor VC HEBO Jeugd, jeugdvoetbalclub in Heers-Bovelingen.

🌐 **https://hebojeugd.be**

## Tech stack

- [Astro](https://astro.build/) - Static site generator
- Nginx + Cloudflare

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Season Intent

Het `season-intent` mailsysteem en het veilige testplan staan in:

- `docs/season-intent.md`

Persistente opslag voor deze flow loopt via Convex. De Convex backendcode staat in `convex/`.

Een voorbeeld van de nodige environment variables staat in `.env.example`.

Leden importeren naar Convex:

```bash
npm run members:import:dry-run
npm run members:import
```

## Club info

| | |
|---|---|
| **Stamnummer** | 09827 |
| **Fusie** | 2024 (Heers VV + EMBO) |
| **Teams** | U6 - U17 |

### Terreinen

- **Heers VV** - Raes van Heerslaan, 3870 Heers
- **EMBO** - Gelindenstraat z/n, 3870 Mechelen-Bovelingen

## Links

- [Voetbal Vlaanderen](https://www.voetbalvlaanderen.be/club/9732)
- [Wedstrijden](https://www.voetbalvlaanderen.be/club/9732/komende-wedstrijden)
