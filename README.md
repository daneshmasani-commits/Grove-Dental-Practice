# Grove Dental Practice — Website

A single-page, mobile-first marketing site for **Grove Dental Practice**, an NHS &
private dental practice on Plashet Grove, East Ham, London.

Built as a tailored pitch draft to show the practice what we can produce. Some content
is placeholder and clearly flagged (see **Placeholders to confirm** below).

## Highlights

- **Hand-built, no framework** — plain semantic HTML5, modern CSS, and vanilla ES6
  JavaScript. Zero build step, zero dependencies. Deployable to any static host
  (GitHub Pages, Netlify, Vercel, etc.).
- **Original visual identity** — deep-teal / warm-sand / muted-terracotta palette,
  Fraunces + Inter type pairing, a custom monoline "tooth + leaf" logo, organic arch
  imagery, and bespoke dental service icons.
- **Accessible & responsive** — semantic landmarks, keyboard-operable carousel /
  accordion / service panels, visible focus styles, `prefers-reduced-motion` support,
  WCAG-AA-minded colour contrast, and layouts tested at 360 / 768 / 1024 / 1440px.

## Sections

Hero · About (with 2×2 value cards) · Services (expandable, with NHS band links) ·
Reviews (auto-rotating carousel of 8 real 5★ Google reviews) · Team · FAQs (accordion) ·
Booking (Formspree enquiry form) · Find us (privacy-gated Google Map + opening hours) ·
Footer.

Global: sticky nav with active-section highlighting · persistent "Book Now" (floating
on desktop, sticky bar on mobile) · UK-GDPR cookie-consent banner gating the map.

## Project structure

```
grove-dental-practice/
├── index.html          # All page markup
├── css/
│   └── styles.css      # Design tokens + all component styles
├── js/
│   └── main.js         # Nav, carousel, accordion, service panels, form, cookie/map
├── assets/
│   ├── logo.svg        # Tooth + leaf monoline logo (single colour)
│   └── images/
│       ├── hero.jpg    # Hero treatment-room photo  [placeholder]
│       └── about.jpg   # About candid-care photo     [placeholder]
└── README.md
```

## View locally

No build step. Either open `index.html` directly, or (recommended, so the map embed and
relative paths behave) serve the folder:

```bash
# Python
python3 -m http.server 8000
# or Node
npx http-server -p 8000
```

Then visit <http://localhost:8000>.

## Booking form (Formspree)

The enquiry form posts to Formspree endpoint `mqeopwwg`. **This endpoint is currently
shared with another site**, so a hidden `_subject` field
(`New enquiry from Grove Dental Practice site`) tags every Grove submission. On success
the user sees an inline confirmation; failures show an inline error with the phone
number. A honeypot field guards against basic spam.

## Cookie consent & map

The Google Map loads only after the visitor accepts the cookie banner (or clicks
"Show map"). The choice is stored in `localStorage` (`grove-cookie-consent`) and can be
changed again via **Cookie settings** in the footer. No other cookies or trackers are
used.

## Placeholders to confirm with the client  `[TO CONFIRM]`

- **Founding year** of the practice
- **Real photos and bios** for every team member
- **Full names** for Taiyba, Radha, Marina, and the two dental nurses
- **GDC registration numbers** for each clinician
- Confirmation that **all listed services are offered**, and the **real pricing**
- **Real email address** (placeholder: `contact@grovedentalpractice.co.uk`)
- Whether the practice is **currently accepting new patients** (NHS / private)
- **Privacy policy, cookie policy and complaints procedure** content/links
- **Hero and About photos** — swap the stock placeholders for real practice imagery
- **Team portraits** — currently tasteful monogram placeholders (see note below)

### Notes for review

- **Team portraits** use initial-monogram avatars rather than stock faces, to avoid
  attaching strangers' photos to real, named staff in a pitch. Swap to stock photos or
  real photos on request.
- All body copy in About, Services and FAQs is drafted by us and should be reviewed for
  tone and accuracy before going live.
- Images are royalty-free stock (Unsplash / Pexels) used as placeholders.
