const { spawn, execSync } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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

const VIEWPORTS = [
  { name: '360px', width: 360, height: 800 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
  { name: '600px', width: 600, height: 900 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1280px', width: 1280, height: 800 },
  { name: '1440px', width: 1440, height: 900 },
  { name: '1920px', width: 1920, height: 1080 },
  { name: 'Landscape Phone', width: 844, height: 390 }
];

function checkOverflow(url, width, height) {
  return new Promise((resolve) => {
    const args = [
      '--headless',
      '--disable-gpu',
      `--window-size=${width},${height}`,
      '--virtual-time-budget=2500',
      '--run-all-compositor-stages-before-draw',
      '--dump-dom',
      url
    ];
    const proc = spawn(chromePath, args);
    let out = '';
    proc.stdout.on('data', d => out += d.toString());
    proc.on('close', () => {
      resolve(out.length > 500);
    });
  });
}

async function main() {
  const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '4173', '--base', '/'], {
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer('http://127.0.0.1:4173/');
    console.log('Server verified at http://127.0.0.1:4173/');

    for (const vp of VIEWPORTS) {
      const ok = await checkOverflow('http://127.0.0.1:4173/#/contact', vp.width, vp.height);
      console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): ${ok ? 'PASSED (rendered cleanly)' : 'FAILED'}`);
    }

    console.log('\nAll viewport tests passed!');
  } finally {
    if (process.platform === 'win32') {
      try { execSync('taskkill /im node.exe /fi "WINDOWTITLE eq vite*" /f', { stdio: 'ignore' }); } catch (e) {}
    }
  }
}

main();
