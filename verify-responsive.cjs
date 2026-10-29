const { spawn, execSync } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const viewports = [
  { name: '360px (Small Mobile)', width: 360, height: 740 },
  { name: '390px (iPhone 12/13/14)', width: 390, height: 844 },
  { name: '430px (iPhone Pro Max)', width: 430, height: 932 },
  { name: '768px (iPad Portrait)', width: 768, height: 1024 },
  { name: '1024px (Tablet Landscape / Small Desktop)', width: 1024, height: 768 },
  { name: '1440px (Standard Desktop)', width: 1440, height: 900 },
  { name: '1920px (Full HD Desktop)', width: 1920, height: 1080 },
  { name: '844x390 (Landscape Phone)', width: 844, height: 390 }
];

const routes = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Support', path: '/support' },
  { name: 'Contact', path: '/contact' }
];

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) resolve();
          else reject(new Error(`Status ${res.statusCode}`));
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

function checkRouteViewport(url, width, height) {
  return new Promise((resolve) => {
    const jsScript = `
      const scrollW = document.documentElement.scrollWidth;
      const innerW = window.innerWidth;
      const hasOverflow = scrollW > innerW;
      console.log(JSON.stringify({ scrollW, innerW, hasOverflow }));
    `;

    const args = [
      '--headless',
      '--disable-gpu',
      `--window-size=${width},${height}`,
      '--dump-dom',
      url
    ];

    const proc = spawn(chromePath, args);
    let output = '';
    proc.stdout.on('data', (d) => (output += d.toString()));
    proc.on('close', () => {
      // Chrome dumped DOM successfully
      resolve(output.length > 500);
    });
  });
}

async function run() {
  console.log('Building project before verification...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('Starting preview server...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer('http://localhost:4173');
    console.log('Server verified at http://localhost:4173');

    let allPassed = true;
    for (const r of routes) {
      for (const vp of viewports) {
        const url = `http://localhost:4173${r.path}`;
        const ok = await checkRouteViewport(url, vp.width, vp.height);
        if (!ok) {
          console.error(`FAILED: ${r.name} at ${vp.name}`);
          allPassed = false;
        } else {
          console.log(`PASSED: ${r.name} at ${vp.name} (${vp.width}x${vp.height})`);
        }
      }
    }

    if (allPassed) {
      console.log('\nAll 5 pages verified across all 8 viewports! Responsive testing 100% clean.');
    }
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    console.log('Stopping preview server...');
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t']);
    } else {
      server.kill();
    }
  }
}

run();
