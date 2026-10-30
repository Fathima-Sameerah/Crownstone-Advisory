const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      if (Date.now() - start > timeoutMs) return reject(new Error('Timeout'));
      http.get(url, (res) => {
        if (res.statusCode < 400) resolve();
        else setTimeout(check, 300);
      }).on('error', () => setTimeout(check, 300));
    }
    check();
  });
}

function runChromeScreenshot(url, width, height, outputFile) {
  return new Promise((resolve) => {
    const args = [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      `--window-size=${width},${height}`,
      `--screenshot=${outputFile}`,
      '--virtual-time-budget=3000',
      '--run-all-compositor-stages-before-draw',
      url
    ];
    const proc = spawn(chromePath, args);
    proc.on('close', (code) => resolve(code === 0));
  });
}

function dumpDOM(url, width, height) {
  return new Promise((resolve) => {
    const args = [
      '--headless',
      '--disable-gpu',
      `--window-size=${width},${height}`,
      '--dump-dom',
      '--virtual-time-budget=3000',
      '--run-all-compositor-stages-before-draw',
      url
    ];
    const proc = spawn(chromePath, args);
    let out = '';
    proc.stdout.on('data', (d) => out += d.toString());
    proc.on('close', () => resolve(out));
  });
}

const VIEWPORTS = [
  { name: '360', width: 360, height: 2600 },
  { name: '390', width: 390, height: 2600 },
  { name: '430', width: 430, height: 2600 },
  { name: '600', width: 600, height: 2400 },
  { name: '768', width: 768, height: 2400 },
  { name: '1024', width: 1024, height: 2200 },
  { name: '1280', width: 1280, height: 2200 },
  { name: '1440', width: 1440, height: 2400 },
  { name: '1920', width: 1920, height: 2400 },
  { name: 'phone-landscape', width: 844, height: 1800 }
];

async function main() {
  console.log('Building with base /...');
  execSync('npx vite build --base /', { stdio: 'inherit' });

  console.log('Starting preview server...');
  const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '4173', '--base', '/'], {
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer('http://127.0.0.1:4173/');
    console.log('Preview server ready.');

    const contactUrl = 'http://127.0.0.1:4173/#/contact';

    // 1. Capture key screenshots
    console.log('Capturing Contact 1440px...');
    await runChromeScreenshot(contactUrl, 1440, 2400, path.join(outputDir, 'contact-v2-1440.png'));

    console.log('Capturing Contact 1024px...');
    await runChromeScreenshot(contactUrl, 1024, 2800, path.join(outputDir, 'contact-v2-1024.png'));

    console.log('Capturing Contact 768px...');
    await runChromeScreenshot(contactUrl, 768, 3000, path.join(outputDir, 'contact-v2-768.png'));

    console.log('Capturing Contact 390px...');
    await runChromeScreenshot(contactUrl, 390, 3600, path.join(outputDir, 'contact-v2-390.png'));

    // 2. Verify DOM and links
    console.log('Checking Contact DOM links...');
    const dom = await dumpDOM(contactUrl, 1440, 900);

    const mailtos = [...dom.matchAll(/href=["'](mailto:[^"']+)["']/g)].map(m => m[1]);
    const tels = [...dom.matchAll(/href=["'](tel:[^"']+)["']/g)].map(m => m[1]);

    console.log('\n--- VERIFIED LINKS ON CONTACT PAGE ---');
    console.log('Mailto links:', mailtos);
    console.log('Tel links:', tels);

    console.log('\nTesting complete!');
  } catch (e) {
    console.error('Error during testing:', e);
  } finally {
    if (process.platform === 'win32') {
      try { execSync('taskkill /im node.exe /fi "WINDOWTITLE eq vite*" /f', { stdio: 'ignore' }); } catch (e) {}
    }
  }
}

main();
