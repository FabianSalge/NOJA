# NOJA Creative Agency

This project is a React-based website for NOJA, a creative content production studio. It is built with Vite, TypeScript, and Tailwind CSS.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/pulse-creative-agency.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Run the development server
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:8080`.

## About This Project

This website was built to showcase the portfolio, services, and team of NOJA. It features a modern, responsive design with smooth animations and a cohesive brand identity.

## Deployment

This project is configured for modern SPAs using BrowserRouter.

- Vercel (recommended)
  - Framework preset: Vite
  - Build command: `npm run build`
  - Output directory: `dist`
  - SPA routing: Vercel auto-handles this; no extra config needed.

- Netlify
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Ensure the file `public/_redirects` exists with: `/* /index.html 200` for SPA routing.

### Environment variables

Site runs fine without a custom domain. For best SEO and analytics, set these when you have a domain:

- `VITE_SITE_URL` (recommended): Your production URL, e.g. `https://nojaagency.com`.
  - Used for canonical links, absolute OpenGraph/JSON-LD URLs, and future sitemap automation.

- `VITE_GA_ID` (optional): Google Analytics 4 Measurement ID (format: `G-XXXXXXXXXX`).
  - Add property at analytics.google.com → Data streams → Web.
  - If set, GA4 is injected automatically.

- `VITE_GSC_VERIFICATION` (optional): Google Search Console meta verification token.
  - Add property at search.google.com/search-console → URL prefix → HTML tag.
  - Paste the meta `content` value as this variable to verify ownership.

On Vercel/Netlify:
- Add env vars in project settings → Environment Variables.
- Redeploy to apply changes.

### Custom domain steps (when ready)
1. Add your domain in Vercel/Netlify project settings.
2. Update DNS (A/ALIAS/CNAME) per provider instructions.
3. Set `VITE_SITE_URL=https://your-domain.com` and redeploy.
4. Search Console:
   - Add the same domain property and verify (HTML tag or DNS).
   - Submit `https://your-domain.com/sitemap.xml`.
5. Analytics:
   - Create GA4 web stream for your domain, copy Measurement ID to `VITE_GA_ID`.
   - Optionally configure consent mode as required for your region.

## SEO Notes

- Per-page titles/descriptions/canonicals are handled via `react-helmet-async`.
- JSON-LD added for Organization (home), Services, Projects breadcrumbs, and Project details.
- SPA routing is supported via BrowserRouter with appropriate rewrites.
- Images use lazy loading and responsive `srcset/sizes` where applicable.
