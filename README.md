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

## Forms

The invite-request and contact forms post to `POST /v1/submissions` on the
Dink Deck API (`https://api.dinkdeck.net/v1` by default; override with
`window.DINKDECK_API` before submitting, for local testing). Submissions land
in the Inbox tab of the app's operator dashboard.

Two things have to be true for them to work in production:

- The API's `CORS_ORIGINS` must contain this site's exact origin. It is matched
  literally — no wildcards — so `https://dinkdeck.net` and `https://www.dinkdeck.net`
  would each need their own entry.
- This site has no Content-Security-Policy today. If one is ever added, its
  `connect-src` must include the API origin, or the fetch is blocked.

## SEO

The canonical URL, `sitemap.xml`, `robots.txt`, and every Open Graph/Twitter/JSON-LD URL are hardcoded to `https://dinkdeck.net`. If this ever deploys somewhere else (a different domain, a `www.` subdomain, a staging URL), all of those need updating together — a mismatched canonical actively hurts ranking rather than just being a no-op.
