# Dink Deck landing page

The marketing site for [Dink Deck](https://play.dinkdeck.net) — a fair, skill-matched open-play court queue for pickleball.

Plain static HTML/CSS, no build step: `index.html`, `styles.css`, and the screenshots in `images/`. "Sign in" and "Get started" link out to the real app at `play.dinkdeck.net`, since this site has no backend of its own.

## Run it locally

Open `index.html` directly in a browser, or serve it:

```
npx serve .
```

## Screenshots

`images/*.png` are real product screenshots, captured against a seeded demo fixture (realistic club/player data, no test artifacts) rather than hand-mocked.

## SEO

The canonical URL, `sitemap.xml`, `robots.txt`, and every Open Graph/Twitter/JSON-LD URL are hardcoded to `https://dinkdeck.net`. If this ever deploys somewhere else (a different domain, a `www.` subdomain, a staging URL), all of those need updating together — a mismatched canonical actively hurts ranking rather than just being a no-op.
