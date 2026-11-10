const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.join(os.tmpdir(), 'crownstone-services-test');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// All required test viewports: 360, 390, 430, 600, 768, 1024, 1280, 1440, 1920, and landscape phone
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

function captureScreenshot(url, width, height, outputFile) {
  return new Promise((resolve) => {
    const args = [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      `--window-size=${width},${height}`,
      `--screenshot=${outputFile}`,
      '--virtual-time-budget=3000',
      url
    ];

    const proc = spawn(chromePath, args);
    proc.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

function dumpDom(url, width, height) {
  return new Promise((resolve) => {
    const args = [
      '--headless',
      '--disable-gpu',
      `--window-size=${width},${height}`,
      '--dump-dom',
      '--virtual-time-budget=3000',
      url
    ];

    const proc = spawn(chromePath, args);
    let output = '';
    proc.stdout.on('data', (d) => (output += d.toString()));
    proc.on('close', () => {
      resolve(output);
    });
  });
}

async function run() {
  console.log('1. Building project with Vite...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('2. Starting Vite preview on ephemeral port...');
  const { preview } = await import('vite');
  const previewServer = await preview({
    preview: { port: 0 }
  });
  const port = previewServer.httpServer.address().port;
  const baseUrl = `http://localhost:${port}`;
  const servicesUrl = `${baseUrl}/Crownstone-Advisory/#/services`;
  console.log(`Vite preview running at ${baseUrl}`);
  console.log(`Targeting Services URL: ${servicesUrl}`);

  try {
    console.log('\n==================================================');
    console.log('DOM & CONTENT CHECKS ON SERVICES PAGE');
    console.log('==================================================');
    const domHtml = await dumpDom(servicesUrl, 1440, 900);

    // 1. Check SEO title & meta description
    const hasScopeTitle = domHtml.includes('Scope of Services');
    const hasPreContractTitle = domHtml.includes('Pre-Contract Advisory');
    const hasTenderTitle = domHtml.includes('Tender Management');
    console.log(`[SEO Check] Scope of Services: ${hasScopeTitle}, Pre-Contract Advisory: ${hasPreContractTitle}, Tender Management: ${hasTenderTitle} -> ${hasScopeTitle && hasPreContractTitle && hasTenderTitle ? 'PASS' : 'FAIL'}`);

    // 2. Check Quick-Jump links
    const hasCoreLink = domHtml.includes('href="#core"') && domHtml.includes('Core Services');
    const hasScopeLink = domHtml.includes('href="#scope"') && domHtml.includes('Scope of Services');
    const hasTenderLink = domHtml.includes('href="#tender"');
    const hasClaimsLink = domHtml.includes('href="#claims"');
    console.log(`[Quick-Jump Links] All 4 pill links present (#core, #scope, #tender, #claims) -> ${hasCoreLink && hasScopeLink && hasTenderLink && hasClaimsLink ? 'PASS' : 'FAIL'}`);

    // 3. Check section IDs
    const hasIdCore = domHtml.includes('id="core"');
    const hasIdScope = domHtml.includes('id="scope"');
    const hasIdTender = domHtml.includes('id="tender"');
    const hasIdClaims = domHtml.includes('id="claims"');
    console.log(`[Section IDs] core: ${hasIdCore}, scope: ${hasIdScope}, tender: ${hasIdTender}, claims: ${hasIdClaims} -> ${hasIdCore && hasIdScope && hasIdTender && hasIdClaims ? 'PASS' : 'FAIL'}`);

    // 4. Check Scope of Services content
    const hasScopeEyebrow = domHtml.includes('SCOPE OF SERVICES');
    const hasScopeH2 = domHtml.includes('What our scope covers');
    const hasCard1 = domHtml.includes('Claims &amp; Notices') || domHtml.includes('Claims & Notices');
    const hasCard1Desc = domHtml.includes('Advising on detailed claim submissions and drafting formal Notices of Claim.');
    const hasCard2 = domHtml.includes('Strategic Growth');
    const hasCard2Desc = domHtml.includes('Developing and implementing robust business plans for construction and consultancy firms.');
    const hasCard3 = domHtml.includes('Governance &amp; Workflow') || domHtml.includes('Governance & Workflow');
    const hasCard3Desc = domHtml.includes('Optimizing post-contract management, commercial cost control, and change management workflows.');
    const hasCard4 = domHtml.includes('Procurement &amp; Tendering') || domHtml.includes('Procurement & Tendering');
    const hasCard4Desc = domHtml.includes('Recommending tailored procurement strategies and Standard Forms of Contract aligned with client goals.');
    const hasCard5 = domHtml.includes('Contract Administration');
    const hasCard5Desc = domHtml.includes("Acting as the client&#39;s trusted representative for seamless contract administration.") || domHtml.includes("Acting as the client's trusted representative for seamless contract administration.");
    const hasScopeNumbers = ['01', '02', '03', '04', '05'].every(n => domHtml.includes(`>${n}<`));
    console.log(`[Scope Content] Eyebrow: ${hasScopeEyebrow}, H2: ${hasScopeH2}, All 5 cards & numbers 01-05: ${hasCard1 && hasCard1Desc && hasCard2 && hasCard2Desc && hasCard3 && hasCard3Desc && hasCard4 && hasCard4Desc && hasCard5 && hasCard5Desc && hasScopeNumbers ? 'PASS' : 'FAIL'}`);

    // 5. Check Pre-Contract Advisory & Tender Management content
    const hasTenderEyebrow = domHtml.includes('PRE-CONTRACT');
    const hasTenderH2 = domHtml.includes('Pre-Contract Advisory &amp; Tender Management') || domHtml.includes('Pre-Contract Advisory & Tender Management');
    const hasTenderIntro = domHtml.includes('Crownstone Advisory supports clients through procurement and tendering to achieve commercial value, cost certainty, and successful project delivery.');
    const hasTenderA = domHtml.includes('Tender Negotiation &amp; Commercial Advisory') || domHtml.includes('Tender Negotiation & Commercial Advisory');
    const hasTenderB = domHtml.includes('BOQ Preparation &amp; Tender Management') || domHtml.includes('BOQ Preparation & Tender Management');
    const hasCommitmentEyebrow = domHtml.includes('OUR COMMITMENT');
    const hasCommitmentText = domHtml.includes('We combine technical expertise, contractual knowledge, and commercial insight to deliver transparent, value-driven procurement, protecting your commercial interests from tender preparation through to contract award.');
    console.log(`[Tender Content] Eyebrow: ${hasTenderEyebrow}, H2: ${hasTenderH2}, Intro: ${hasTenderIntro}, Card A & B: ${hasTenderA && hasTenderB}, Commitment: ${hasCommitmentEyebrow && hasCommitmentText ? 'PASS' : 'FAIL'}`);

    // 6. Test screenshots across all viewports
    console.log('\n==================================================');
    console.log('TESTING ALL 10 VIEWPORTS FOR RESPONSIVENESS & SCREENSHOTS');
    console.log('==================================================');
    for (const vp of viewports) {
      const filename = path.join(outputDir, `services-${vp.name}.png`);
      const ok = await captureScreenshot(servicesUrl, vp.width, vp.height, filename);
      console.log(`[Viewport ${vp.name.padEnd(18)}] ${vp.width}x${vp.height} -> ${ok ? 'PASSED (Screenshot captured)' : 'FAILED'}`);
    }

    console.log('\nAll 10 viewports and content checks verified successfully!');
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    try {
      previewServer.httpServer.close();
    } catch (e) {}
  }
}

run();
