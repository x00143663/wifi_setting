# Home WiFi Setup Wizard

A step-by-step web application that guides non-technical users through the complete process of configuring their home router and WiFi network. Built for the Irish market, with support for the most common Irish internet providers and router models.

## Features

- **Router identification** — select your provider (Eir, Virgin Media, Sky, Vodafone) and router model to get tailored instructions
- **Admin panel access guide** — step-by-step instructions to access your router's control panel, with device-specific admin URLs and login credentials
- **Configuration dashboard** — accordion-style menu with 6 configurable sections:
  - Admin password change
  - WiFi setup (network name, password, 2.4 GHz / 5 GHz info, hide SSID option)
  - Guest WiFi setup (separate network for visitors)
  - Disable WPS
  - Enable firewall
  - Firmware update guide
- **WiFi QR codes** — instant QR codes for main and guest networks; visitors can connect by scanning with their phone camera
- **Printable summary** — full summary of all settings with a print-friendly layout and QR-only print option
- **Privacy-first** — all data stays in the browser (localStorage), nothing is sent to any server

## Supported Providers & Routers

| Provider | Routers |
|---|---|
| Eir | F3000 (Zyxel), Smart Hub, F2000 |
| Virgin Media | Hub 3, Hub 4, Hub 5 |
| Sky | Sky Hub, Sky Q Hub |
| Vodafone | HG659b, Gigabox |

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 15 | React framework (App Router) |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |
| [Zustand](https://github.com/pmndrs/zustand) | 5 | Global state management with localStorage persistence |
| [qrcode](https://github.com/soldair/node-qrcode) | 1.5 | QR code generation (canvas-based, client-side) |
| TypeScript | 5 | Type safety |

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── page.tsx          # Landing page
├── setup/            # 2-step wizard (router ID + admin login)
├── configure/        # Dashboard with 6 configurable sections
└── summary/          # Final summary with QR codes and print options
components/
├── wizard/           # Wizard shell and step modules
└── shared/           # Reusable UI components
lib/
├── store.ts          # Zustand store
├── routers-db.ts     # Irish router database
└── generators.ts     # SSID and password generators
```

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com):

```bash
npm run build
```

No backend or environment variables required — the app is fully static.
