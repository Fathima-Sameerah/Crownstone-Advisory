const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.join(__dirname, 'screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const widths = [
  { name: '360', width: 360, height: 2600 },
  { name: '390', width: 390, height: 2800 },
  { name: '430', width: 430, height: 2800 },
  { name: '768', width: 768, height: 2400 },
  { name: '1024', width: 1024, height: 2200 },
  { name: '1440', width: 1440, height: 2600 },
  { name: '1920', width: 1920, height: 2600 },
  { name: 'landscape', width: 844, height: 1800 }
];

const pages = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'services', path: '/services' },
  { name: 'support', path: '/support' },
  { name: 'contact', path: '/contact' }
];

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve();
          } else {
            reject(new Error(`Status ${res.statusCode}`));
          }
        });
        req.on('error', reject);
        req.end();
      });
      return true;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  throw new Error('Server did not start in time');
}

function runChromeScreenshot(url, width, height, outputFile) {
  return new Promise((resolve) => {
    const args = [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      `--window-size=${width},${height}`,
      `--screenshot=${outputFile}`,
      '--virtual-time-budget=2000',
      url
    ];

    const proc = spawn(chromePath, args);
    proc.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

async function main() {
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('Starting preview server...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer('http://localhost:4173');
    console.log('Preview server ready at http://localhost:4173');

    // 1. Capture 1440px desktop full page for all 5 pages
    for (const page of pages) {
      const filename = path.join(outputDir, `full-${page.name}-1440.png`);
      const url = `http://localhost:4173${page.path}`;
      console.log(`Capturing full ${page.name} at 1440px...`);
      await runChromeScreenshot(url, 1440, 3200, filename);
    }

    // 2. Capture 390px mobile full page for all 5 pages
    for (const page of pages) {
      const filename = path.join(outputDir, `full-${page.name}-390.png`);
      const url = `http://localhost:4173${page.path}`;
      console.log(`Capturing full ${page.name} at 390px...`);
      await runChromeScreenshot(url, 390, 4200, filename);
    }

    // 3. Capture Home across all required widths (360, 390, 430, 768, 1024, 1440, 1920, landscape)
    for (const w of widths) {
      const filename = path.join(outputDir, `viewport-home-${w.name}.png`);
      const url = 'http://localhost:4173/';
      console.log(`Capturing Home at ${w.name} (${w.width}x${w.height})...`);
      await runChromeScreenshot(url, w.width, w.height, filename);
    }

    console.log('All comprehensive screenshots captured in screenshots/ directory.');
  } catch (err) {
    console.error('Error during testing:', err);
  } finally {
    console.log('Stopping preview server...');
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t']);
    } else {
      server.kill();
    }
  }
}

main();
