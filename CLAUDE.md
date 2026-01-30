# CLAUDE.md - VC HEBO Jeugd Website

## Project

Website voor VC HEBO Jeugd, jeugdvoetbalclub in Heers-Bovelingen (stamnr. 09827).

**URL:** https://hebojeugd.be  
**Tech:** Astro (static site)  
**Hosting:** Nginx op VPS met Cloudflare Origin Certificate

## Commands

```bash
npm run dev      # Development server
npm run build    # Build naar dist/
```

## Git

**Altijd conventional commits gebruiken!**

```
feat:     Nieuwe feature
fix:      Bug fix
docs:     Documentatie
style:    Formatting, geen code changes
refactor: Code refactor
chore:    Maintenance, dependencies
```

Voorbeelden:
- `feat: add team roster page`
- `fix: correct terrein address`
- `chore: update astro to v5`

Na build: nginx serveert automatisch uit `/root/projects/hebojeugd.be/dist/`

## Structuur

```
src/
├── layouts/Layout.astro    # Base layout met fonts & global styles
├── components/Card.astro   # Herbruikbare bento card component
└── pages/index.astro       # Homepage
public/
└── logo.png                # Club logo
```

## Design

- **Stijl:** Nike-inspired bento grid
- **Kleuren:** Navy (#1e3264), Rood (#c8202f), Wit
- **Fonts:** Bebas Neue (headlines), Inter (body)

## Club info

- **Naam:** VC HEBO Jeugd (Heers-Bovelingen)
- **Stamnummer:** 09827
- **Fusie:** 2024 (Heers VV + EMBO)
- **Teams:** U6, U7, U9, U10, U11, U12, U15, U17

### Terreinen

1. **Heers VV** - Raes van Heerslaan, 3870 Heers
2. **EMBO** - Gelindenstraat z/n, 3870 Mechelen-Bovelingen

## Links

- Voetbal Vlaanderen: https://www.voetbalvlaanderen.be/club/9732
- Wedstrijden: https://www.voetbalvlaanderen.be/club/9732/komende-wedstrijden

## SSL

Cloudflare Origin Certificate (15 jaar geldig):
- Cert: `/etc/ssl/cloudflare/hebojeugd.be.pem`
- Key: `/etc/ssl/cloudflare/hebojeugd.be.key`

Cloudflare SSL mode: Full (strict)
