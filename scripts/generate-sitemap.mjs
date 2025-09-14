import { createClient } from 'contentful'
import fs from 'fs'
import path from 'path'

const SITE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || '').replace(/\/$/, '') || 'https://nojaagency.com'

const space = process.env.VITE_CONTENTFUL_SPACE_ID
const accessToken = process.env.VITE_CONTENTFUL_ACCESS_TOKEN
const environment = process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master'

const client = (space && accessToken)
  ? createClient({ space, accessToken, environment })
  : null

async function fetchProjectSlugs() {
  if (!client) return []
  try {
    const res = await client.getEntries({ content_type: 'project', select: 'fields.slug,sys.updatedAt', limit: 500 })
    return (res.items || []).map(item => ({
      slug: item.fields?.slug,
      updatedAt: item.sys?.updatedAt,
    })).filter(p => typeof p.slug === 'string')
  } catch {
    return []
  }
}

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function main() {
  const staticPaths = ['/', '/about', '/projects', '/services', '/contact']
  const projects = await fetchProjectSlugs()
  const urls = [
    ...staticPaths.map(p => ({ loc: `${SITE_URL}${p}`, priority: p === '/' ? '1.0' : '0.7' })),
    ...projects.map(p => ({ loc: `${SITE_URL}/projects/${p.slug}`, lastmod: p.updatedAt, priority: '0.6' }))
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
urls.map(u => {
  return `  <url>\n` +
         `    <loc>${xmlEscape(u.loc)}</loc>\n` +
         (u.lastmod ? `    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>\n` : '') +
         (u.priority ? `    <priority>${u.priority}</priority>\n` : '') +
         `  </url>`
}).join('\n') +
`\n</urlset>\n`

  const outDir = path.resolve(process.cwd(), 'dist')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), body, 'utf8')
  console.log('sitemap.xml generated with', urls.length, 'urls')
}

main()

