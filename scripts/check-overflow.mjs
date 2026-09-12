/**
 * Measures real horizontal overflow at phone width and names the culprits.
 *
 * A screenshot cannot tell you this: a headless window crops, so a page that
 * merely LOOKS clipped may just be a narrow capture of a wide viewport. This
 * asks the layout engine directly.
 */
import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const WIDTH = Number(process.argv[3] ?? 400)
const routes = (process.argv[2] ?? '/,/desk,/picks/neon-panel-desk-mat,/journal,/about').split(',')

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
let bad = 0

for (const route of routes) {
  const page = await browser.newPage()
  await page.setViewport({ width: WIDTH, height: 900, isMobile: true, deviceScaleFactor: 2 })
  await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle0' })

  const result = await page.evaluate((vw) => {
    const doc = document.documentElement
    const offenders = []
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0) continue
      // Only report elements that themselves cross the viewport edge.
      if (r.right > vw + 1 || r.left < -1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.getAttribute('class') || '').slice(0, 70),
          right: Math.round(r.right),
          left: Math.round(r.left),
        })
      }
    }
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offenders: offenders.slice(0, 6) }
  }, WIDTH)

  const overflow = result.scrollWidth - result.clientWidth
  const status = overflow > 0 ? 'OVERFLOW' : 'ok'
  if (overflow > 0) bad++
  console.log(`${status.padEnd(9)} ${route.padEnd(30)} scrollWidth=${result.scrollWidth} client=${result.clientWidth}`)
  if (overflow > 0) for (const o of result.offenders) console.log(`            <${o.tag}> l=${o.left} r=${o.right} ${o.cls}`)
  await page.close()
}

await browser.close()
console.log(bad ? `\n${bad} route(s) overflow at ${WIDTH}px` : `\nNo horizontal overflow at ${WIDTH}px`)
process.exit(bad ? 1 : 0)
