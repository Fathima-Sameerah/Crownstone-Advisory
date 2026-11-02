import { spawn, execSync } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.join(__dirname, 'screenshots', 'services-test');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const viewports = [
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
  { name: '600', width: 600, height: 900 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
  { name: 'landscape-844x390', width: 844, height: 390 }
];

async function main() {
  console.log('1. Building project with Vite...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('2. Starting Vite preview server on dynamic ephemeral port...');
  const { preview } = await import('vite');
  const previewServer = await preview({
    preview: { port: 0 }
  });
  const port = previewServer.httpServer.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Vite preview running at ${baseUrl}`);

  // Find free debugging port for Chrome
  const cdpPort = 9333;
  console.log(`3. Launching Chrome with remote debugging on port ${cdpPort}...`);
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${cdpPort}`,
    '--hide-scrollbars',
    'about:blank'
  ]);

  // Wait for CDP to respond
  await new Promise((r) => setTimeout(r, 1200));

  try {
    // Connect to CDP
    const versionRes = await fetch(`http://127.0.0.1:${cdpPort}/json/version`).then(r => r.json());
    console.log('Chrome connected:', versionRes.Browser);

    const newTab = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(baseUrl + '/services')}`, {
      method: 'PUT'
    }).then(r => r.json());

    const wsUrl = newTab.webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        callbacks.get(data.id)(data);
        callbacks.delete(data.id);
      }
    };

    await new Promise((resolve) => ws.onopen = resolve);

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    // Wait for page to finish loading
    await new Promise((r) => setTimeout(r, 1500));

    console.log('\n==================================================');
    console.log('VERIFYING SERVICES PAGE CONTENT & SEO');
    console.log('==================================================');

    // Check title and meta
    const seoCheck = await send('Runtime.evaluate', {
      expression: `({
        title: document.title,
        metaDesc: document.querySelector('meta[name="description"]')?.content || '',
        headings: Array.from(document.querySelectorAll('h2, h3')).map(h => h.textContent.trim()),
        eyebrows: Array.from(document.querySelectorAll('.eyebrow-badge')).map(e => e.textContent.trim())
      })`,
      returnByValue: true
    });

    console.log('Page Title:', seoCheck.result.value.title);
    console.log('Meta Description:', seoCheck.result.value.metaDesc);

    const titleValid =
      seoCheck.result.value.title.includes('Scope of Services') &&
      seoCheck.result.value.title.includes('Pre-Contract Advisory') &&
      seoCheck.result.value.title.includes('Tender Management');
    console.log('SEO Title Check (Scope of Services, Pre-Contract Advisory, Tender Management):', titleValid ? 'PASS' : 'FAIL');

    const descValid =
      seoCheck.result.value.metaDesc.includes('Scope of Services') &&
      seoCheck.result.value.metaDesc.includes('Pre-Contract Advisory') &&
      seoCheck.result.value.metaDesc.includes('Tender Management');
    console.log('SEO Meta Description Check:', descValid ? 'PASS' : 'FAIL');

    console.log('\n==================================================');
    console.log('VERIFYING SECTION IDS & QUICK-JUMP ANCHORS');
    console.log('==================================================');

    const sectionCheck = await send('Runtime.evaluate', {
      expression: `({
        hasCore: !!document.getElementById('core'),
        hasScope: !!document.getElementById('scope'),
        hasTender: !!document.getElementById('tender'),
        hasClaims: !!document.getElementById('claims'),
        pills: Array.from(document.querySelectorAll('.services-jump-pill')).map(p => ({
          text: p.textContent.trim(),
          href: p.getAttribute('href')
        }))
      })`,
      returnByValue: true
    });

    console.log('Section IDs present:', sectionCheck.result.value);
    const pills = sectionCheck.result.value.pills;
    console.log('Quick-jump pills:', pills);

    console.log('\n==================================================');
    console.log('VERIFYING SCOPE OF SERVICES (5 CARDS, ICONS, NUMBERS)');
    console.log('==================================================');

    const scopeCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const scopeSection = document.getElementById('scope');
        const cards = Array.from(scopeSection.querySelectorAll('.scope-card'));
        return {
          cardCount: cards.length,
          cards: cards.map(c => ({
            num: c.querySelector('.scope-card-num')?.textContent.trim(),
            numFont: window.getComputedStyle(c.querySelector('.scope-card-num')).fontFamily,
            title: c.querySelector('.scope-card-title')?.textContent.trim(),
            desc: c.querySelector('.scope-card-desc')?.textContent.trim(),
            hasIcon: !!c.querySelector('.icon-circle svg'),
            borderRadius: window.getComputedStyle(c).borderRadius,
            padding: window.getComputedStyle(c).padding
          }))
        };
      })()`,
      returnByValue: true
    });

    console.log('Scope Cards Count:', scopeCheck.result.value.cardCount);
    scopeCheck.result.value.cards.forEach((c, idx) => {
      console.log(` Card ${idx + 1}: [${c.num}] "${c.title}" (icon: ${c.hasIcon}, font: ${c.numFont.includes('Cormorant') ? 'Cormorant Garamond' : c.numFont})`);
      console.log(`    Desc: "${c.desc}"`);
      console.log(`    Border-radius: ${c.borderRadius}, Padding: ${c.padding}`);
    });

    console.log('\n==================================================');
    console.log('VERIFYING PRE-CONTRACT & TENDER (CARDS A & B, COMMITMENT)');
    console.log('==================================================');

    const tenderCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const tenderSection = document.getElementById('tender');
        const cardA = tenderSection.querySelector('.tender-card-white');
        const cardB = tenderSection.querySelector('.tender-card-navy');
        const commitment = tenderSection.querySelector('.commitment-card');

        return {
          cardA: {
            title: cardA.querySelector('.tender-card-title')?.textContent.trim(),
            itemsCount: cardA.querySelectorAll('.tender-card-item').length,
            items: Array.from(cardA.querySelectorAll('.tender-card-item')).map(i => i.textContent.trim()),
            bulletsCount: cardA.querySelectorAll('.gold-dot-bullet').length
          },
          cardB: {
            title: cardB.querySelector('.tender-card-title')?.textContent.trim(),
            itemsCount: cardB.querySelectorAll('.tender-card-item').length,
            items: Array.from(cardB.querySelectorAll('.tender-card-item')).map(i => i.textContent.trim()),
            bulletsCount: cardB.querySelectorAll('.gold-dot-bullet').length
          },
          commitment: {
            eyebrow: commitment.querySelector('.eyebrow-badge')?.textContent.trim(),
            hasShieldIcon: !!commitment.querySelector('.commitment-icon'),
            text: commitment.querySelector('.commitment-text')?.textContent.trim(),
            font: window.getComputedStyle(commitment.querySelector('.commitment-text')).fontFamily,
            fontStyle: window.getComputedStyle(commitment.querySelector('.commitment-text')).fontStyle,
            fontSize: window.getComputedStyle(commitment.querySelector('.commitment-text')).fontSize,
            borderLeft: window.getComputedStyle(commitment).borderLeft
          }
        };
      })()`,
      returnByValue: true
    });

    console.log('Card A (White):', tenderCheck.result.value.cardA.title, `(${tenderCheck.result.value.cardA.itemsCount} items)`);
    console.log('Card B (Navy):', tenderCheck.result.value.cardB.title, `(${tenderCheck.result.value.cardB.itemsCount} items)`);
    console.log('Commitment Band:');
    console.log('  Eyebrow:', tenderCheck.result.value.commitment.eyebrow);
    console.log('  Shield icon:', tenderCheck.result.value.commitment.hasShieldIcon);
    console.log('  Text:', tenderCheck.result.value.commitment.text);
    console.log('  Font:', tenderCheck.result.value.commitment.font, 'Style:', tenderCheck.result.value.commitment.fontStyle, 'Size:', tenderCheck.result.value.commitment.fontSize);
    console.log('  Left border:', tenderCheck.result.value.commitment.borderLeft);

    console.log('\n==================================================');
    console.log('TESTING ALL 10 VIEWPORTS FOR RESPONSIVENESS & OVERFLOW');
    console.log('==================================================');

    let allViewportsPassed = true;
    for (const vp of viewports) {
      // Set viewport in Chrome
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 900
      });

      await send('Emulation.setVisibleSize', { width: vp.width, height: vp.height });
      await new Promise((r) => setTimeout(r, 400));

      // Check overflow & layout metrics
      const metrics = await send('Runtime.evaluate', {
        expression: `(() => {
          const docW = document.documentElement.offsetWidth;
          const bodyW = document.body.offsetWidth;
          const scrollW = document.documentElement.scrollWidth;
          const innerW = window.innerWidth;
          const hasPageOverflow = scrollW > innerW;

          // Check scroll-margin-top on sections
          const sections = ['core', 'scope', 'tender', 'claims'].map(id => {
            const el = document.getElementById(id);
            return { id, scrollMarginTop: el ? window.getComputedStyle(el).scrollMarginTop : null };
          });

          // Check pills height
          const pill = document.querySelector('.services-jump-pill');
          const pillHeight = pill ? pill.getBoundingClientRect().height : 0;

          // Check tender cards stacking
          const cardA = document.querySelector('.tender-card-white');
          const cardB = document.querySelector('.tender-card-navy');
          let tenderStacked = false;
          let tenderEqualHeights = false;
          let listStartsEqual = false;
          if (cardA && cardB) {
            const rectA = cardA.getBoundingClientRect();
            const rectB = cardB.getBoundingClientRect();
            tenderStacked = rectB.top >= rectA.bottom - 5;
            tenderEqualHeights = Math.abs(rectA.height - rectB.height) < 2;

            const listA = cardA.querySelector('.tender-card-list')?.getBoundingClientRect();
            const listB = cardB.querySelector('.tender-card-list')?.getBoundingClientRect();
            if (listA && listB && !tenderStacked) {
              listStartsEqual = Math.abs(listA.top - listB.top) < 2;
            }
          }

          // Check Scope cards grid layout
          const scopeGrid = document.querySelector('.scope-grid');
          const scopeItems = Array.from(document.querySelectorAll('.scope-card-wrapper'));
          const scopeRects = scopeItems.map(item => item.getBoundingClientRect());
          
          return {
            innerW,
            scrollW,
            hasPageOverflow,
            sections,
            pillHeight,
            tenderStacked,
            tenderEqualHeights,
            listStartsEqual,
            scopeCardHeightsEqual: scopeRects.length === 5 && Math.abs(scopeRects[0].height - scopeRects[1].height) < 3
          };
        })()`,
        returnByValue: true
      });

      const res = metrics.result.value;
      const status = !res.hasPageOverflow ? 'PASS' : 'FAIL (Horizontal Overflow!)';
      if (res.hasPageOverflow) allViewportsPassed = false;

      console.log(`[Viewport ${vp.name.padEnd(18)}] Width: ${vp.width}px -> Overflow: ${status}`);
      console.log(`   scroll-margin-top: ${res.sections[0].scrollMarginTop}, Pill height: ${res.pillHeight}px`);
      if (vp.width >= 900) {
        console.log(`   Tender side-by-side equal heights: ${res.tenderEqualHeights}, list start aligned: ${res.listStartsEqual}`);
      } else {
        console.log(`   Tender cards stacked under 900px: ${res.tenderStacked}`);
      }

      // Capture screenshot
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outputDir, `services-${vp.name}.png`), Buffer.from(shot.result.data, 'base64'));
    }

    console.log('\n==================================================');
    console.log(`FINAL RESULT: ${allViewportsPassed ? 'ALL VIEWPORT TESTS PASSED PERFECTLY!' : 'SOME CHECKS FAILED'}`);
    console.log('==================================================');
  } catch (err) {
    console.error('Error during CDP testing:', err);
  } finally {
    try {
      chromeProc.kill();
      previewServer.httpServer.close();
    } catch (e) {}
  }
}

main();
