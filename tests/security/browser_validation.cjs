/**
 * LS PDF - Headless Chrome CDP Real Browser End-to-End Workflow Validation
 * 
 * Executes full browser cryptographic workflows through the live React UI:
 * 1. Viewport & Web Crypto API availability checks (Desktop 1280x800 & Mobile 375x667).
 * 2. Real Browser Protect Workflow (upload synthetic PDF, set password, encrypt, capture blob, verify AES-256).
 * 3. Real Browser Password Mismatch Validation (UI button disabled).
 * 4. Real Browser Non-ASCII / Unicode Password Workflow (Café-München-2026 / emoji).
 * 5. Real Browser Unlock Workflow (upload encrypted PDF, enter password, decrypt, capture blob, verify unencrypted).
 * 6. Real Browser Re-Protection Workflow (upload locked PDF, unlock in UI, re-protect with new password).
 * 7. Real Browser Unsupported AES-128 Safe Error Notification (toast error verified).
 */

const { spawn, execSync } = require('child_process');
const http = require('http');
const assert = require('assert');
const { PDFDocument, PDFName, PDFNumber, PDFHexString } = require('pdf-lib');
const { decryptPDF, isEncrypted } = require('@pdfsmaller/pdf-decrypt');
const { saslPrep } = require('@pdfsmaller/pdf-encrypt');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PREVIEW_PORT = 4173;

async function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function killPort(port) {
  try {
    const net = execSync(`netstat -ano | findstr 127.0.0.1:${port}`).toString();
    const lines = net.trim().split('\n');
    for (const line of lines) {
      if (line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        const pid = parseInt(parts[parts.length - 1], 10);
        if (pid && pid > 4) {
          try { execSync(`taskkill /pid ${pid} /t /f`); } catch (e) {}
        }
      }
    }
  } catch (e) {}
}

async function waitForHttp(url, maxMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) resolve();
          else reject(new Error('Status ' + res.statusCode));
        });
        req.on('error', reject);
        req.setTimeout(500, () => { req.destroy(); reject(new Error('timeout')); });
      });
      return;
    } catch (e) {
      await wait(300);
    }
  }
  throw new Error('HTTP server failed to respond at ' + url);
}

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on('error', reject);
  });
}

async function sendCdp(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const msg = JSON.stringify({ id, method, params });
    function onMsg(event) {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.id === id) {
          ws.removeEventListener('message', onMsg);
          if (parsed.error) reject(new Error(parsed.error.message));
          else resolve(parsed.result);
        }
      } catch (e) {}
    }
    ws.addEventListener('message', onMsg);
    ws.send(msg);
  });
}

async function evaluateInBrowser(ws, funcStr, args = []) {
  const argsJson = JSON.stringify(args);
  const expr = `(${funcStr})(...${argsJson})`;
  const result = await sendCdp(ws, 'Runtime.evaluate', {
    expression: expr,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || 'Browser evaluation failed');
  }
  return result.result.value;
}

async function runBrowserE2EValidation() {
  console.log('================================================================');
  console.log('LS PDF SECURITY: REAL BROWSER (CHROME CDP) E2E WORKFLOW VALIDATION');
  console.log('================================================================\n');

  killPort(PREVIEW_PORT);

  // Start Vite preview
  console.log('Starting local preview server on 127.0.0.1:' + PREVIEW_PORT + '...');
  const previewProc = spawn('cmd.exe', ['/c', 'npx', 'vite', 'preview', '--host', '127.0.0.1', '--port', String(PREVIEW_PORT), '--strictPort']);
  
  await waitForHttp(`http://127.0.0.1:${PREVIEW_PORT}/protect`);
  console.log('Vite preview server responding at http://127.0.0.1:' + PREVIEW_PORT);

  // Start Headless Chrome
  console.log('Launching Headless Chrome with remote debugging on port 9222...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `http://127.0.0.1:${PREVIEW_PORT}/protect`
  ]);

  await wait(2000);

  const WS = globalThis.WebSocket;
  if (!WS) throw new Error('globalThis.WebSocket not available in this Node runtime');

  try {
    const versionInfo = await fetchJson('http://127.0.0.1:9222/json/version');
    console.log('Chrome Browser Version:', versionInfo.Browser);
    console.log('V8 Engine Version:', versionInfo['V8-Version']);

    const targets = await fetchJson('http://127.0.0.1:9222/json/list');
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const ws = new WS(pageTarget.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    console.log('Connected to Chrome DevTools Protocol WebSocket.');

    await sendCdp(ws, 'Runtime.enable');
    await sendCdp(ws, 'Page.enable');

    // Hook createObjectURL on new document to reliably intercept cryptographic artifacts
    await sendCdp(ws, 'Page.addScriptToEvaluateOnNewDocument', {
      source: `
        window.__capturedBlobs = [];
        const origCreate = window.URL.createObjectURL;
        window.URL.createObjectURL = function(blob) {
          const url = origCreate.call(window.URL, blob);
          window.__capturedBlobs.push({ url, blob });
          return url;
        };
      `
    });

    const consoleMessages = [];
    ws.addEventListener('message', event => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
          consoleMessages.push({ type: msg.params.type, text: msg.params.args.map(a => a.value).join(' ') });
        }
      } catch (e) {}
    });

    // =====================================================================
    // TEST 1: Viewport & Web Crypto API Availability
    // =====================================================================
    console.log('\n[1] Testing Viewports & Web Crypto API...');
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await sendCdp(ws, 'Page.navigate', { url: `http://127.0.0.1:${PREVIEW_PORT}/protect` });
    await wait(1500);

    const cryptoEval = await evaluateInBrowser(ws, `() => ({
      hasSubtle: typeof window.crypto?.subtle === "object",
      hasEncrypt: typeof window.crypto?.subtle?.encrypt === "function",
      hasDigest: typeof window.crypto?.subtle?.digest === "function"
    })`);
    assert(cryptoEval.hasSubtle && cryptoEval.hasEncrypt && cryptoEval.hasDigest, 'Web Crypto API missing');
    console.log('Web Crypto subtle API verified:', cryptoEval);

    // Mobile layout check (375x667 iPhone SE)
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', { width: 375, height: 667, deviceScaleFactor: 2, mobile: true });
    await wait(1000);
    const mobileLayout = await evaluateInBrowser(ws, `() => ({
      viewportWidth: window.innerWidth,
      bodyScrollWidth: document.body.scrollWidth,
      noOverflow: document.body.scrollWidth <= window.innerWidth
    })`);
    assert(mobileLayout.noOverflow, 'Mobile layout overflow detected');
    console.log('Mobile layout check (375px): no overflow =', mobileLayout.noOverflow);

    // Switch back to desktop
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await wait(500);

    // =====================================================================
    // TEST 2: Real Browser Protect Workflow (Upload, Password, Encrypt, Download)
    // =====================================================================
    console.log('\n[2] Executing Real Browser Protect Workflow on /protect...');

    // Generate synthetic test PDF in Node
    const synthDoc = await PDFDocument.create();
    const p1 = synthDoc.addPage([500, 500]);
    p1.drawText('Browser E2E PDF Content - Verification 2026', { x: 50, y: 400 });
    const synthRaw = await synthDoc.save();
    const synthBase64 = Buffer.from(synthRaw).toString('base64');

    // Dispatch file into React input
    const fileLoadRes = await evaluateInBrowser(ws, `(base64) => {
      window.__capturedBlobs = [];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const file = new File([bytes], 'browser-e2e-input.pdf', { type: 'application/pdf' });
      const dt = new DataTransfer();
      dt.items.add(file);
      const input = document.querySelector('input[type="file"]');
      if (!input) return { error: 'No input[type="file"] found' };
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return { success: true, fileName: file.name, fileSize: file.size };
    }`, [synthBase64]);
    assert(fileLoadRes.success, 'Failed to dispatch file to React UI');
    console.log('Dispatched synthetic PDF to UI:', fileLoadRes);

    await wait(1500);

    // Set passwords in React controlled inputs
    const setPassRes = await evaluateInBrowser(ws, `(pwd) => {
      const inputs = Array.from(document.querySelectorAll('input[type="password"]'));
      if (inputs.length < 2) return { error: 'Password inputs not found in UI: ' + inputs.length };
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(inputs[0], pwd);
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      setter.call(inputs[1], pwd);
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].dispatchEvent(new Event('change', { bubbles: true }));

      const btns = Array.from(document.querySelectorAll('button'));
      const encryptBtn = btns.find(b => b.textContent && b.textContent.includes('Encrypt & Save'));
      return {
        success: true,
        input0: inputs[0].value,
        input1: inputs[1].value,
        encryptBtnDisabled: encryptBtn ? encryptBtn.disabled : null
      };
    }`, ['BrowserSecret2026!']);
    assert(setPassRes.success, 'Failed to set password inputs');
    assert.strictEqual(setPassRes.encryptBtnDisabled, false, 'Encrypt & Save button should be enabled');
    console.log('Password inputs configured in UI (button enabled):', setPassRes);

    // Click "Encrypt & Save" button in UI
    const clickEncryptRes = await evaluateInBrowser(ws, `() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const encryptBtn = btns.find(b => b.textContent && b.textContent.includes('Encrypt & Save'));
      if (!encryptBtn) return { error: 'Encrypt & Save button not found' };
      if (encryptBtn.disabled) return { error: 'Encrypt & Save button is disabled' };
      encryptBtn.click();
      return { success: true };
    }`);
    assert(clickEncryptRes.success, clickEncryptRes.error || 'Click Encrypt & Save failed');
    console.log('Clicked Encrypt & Save in browser.');

    // Poll for captured blob in browser window.__capturedBlobs
    let capturedEncryptedBytes = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      await wait(300);
      const pollRes = await evaluateInBrowser(ws, `async () => {
        if (!window.__capturedBlobs || !window.__capturedBlobs.length) return null;
        const item = window.__capturedBlobs[window.__capturedBlobs.length - 1];
        const ab = await item.blob.arrayBuffer();
        return Array.from(new Uint8Array(ab));
      }`);

      if (pollRes && pollRes.length > 500) {
        capturedEncryptedBytes = new Uint8Array(pollRes);
        console.log(`Captured encrypted output blob from browser: ${capturedEncryptedBytes.length} bytes`);
        break;
      }
    }

    assert(capturedEncryptedBytes && capturedEncryptedBytes.length > 0, 'Timed out waiting for encrypted blob in browser');

    // Independent cryptographic verification of captured browser output in Node
    const encCheck = await isEncrypted(capturedEncryptedBytes);
    assert.strictEqual(encCheck.encrypted, true, 'Browser output not encrypted');
    assert.strictEqual(encCheck.algorithm, 'AES-256', 'Browser output not AES-256');
    assert.strictEqual(encCheck.version, 5, 'Browser output V != 5');
    assert.strictEqual(encCheck.revision, 6, 'Browser output R != 6');
    console.log('Browser Encrypted Output Dictionary Verified (V=5, R=6, AES-256): PASS');

    // Verify incorrect password rejected
    let wrongRejected = false;
    try {
      await decryptPDF(capturedEncryptedBytes, 'WrongPassword');
    } catch (e) {
      if (e.message.includes('Incorrect password')) wrongRejected = true;
    }
    assert(wrongRejected, 'Browser encrypted file did not reject incorrect password');
    console.log('Browser Encrypted Output rejected incorrect password: PASS');

    // Verify correct password decrypts
    const browserDecrypted = await decryptPDF(capturedEncryptedBytes, 'BrowserSecret2026!');
    const docVerified = await PDFDocument.load(browserDecrypted);
    assert.strictEqual(docVerified.getPageCount(), 1, 'Page count mismatch');
    console.log('Browser Encrypted Output decrypted with correct password: PASS');

    // =====================================================================
    // TEST 3: UI Password Mismatch Validation
    // =====================================================================
    console.log('\n[3] Testing UI Password Mismatch behavior on /protect...');
    await sendCdp(ws, 'Page.navigate', { url: `http://127.0.0.1:${PREVIEW_PORT}/protect` });
    await wait(1200);

    // Re-dispatch synthetic file
    await evaluateInBrowser(ws, `(base64) => {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const file = new File([bytes], 'mismatch-test.pdf', { type: 'application/pdf' });
      const dt = new DataTransfer();
      dt.items.add(file);
      const input = document.querySelector('input[type="file"]');
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }`, [synthBase64]);

    await wait(1200);

    const mismatchCheck = await evaluateInBrowser(ws, `() => {
      const inputs = Array.from(document.querySelectorAll('input[type="password"]'));
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(inputs[0], 'PassAlpha123');
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      setter.call(inputs[1], 'PassBeta456'); // Mismatch!
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].dispatchEvent(new Event('change', { bubbles: true }));

      const btns = Array.from(document.querySelectorAll('button'));
      const encryptBtn = btns.find(b => b.textContent && b.textContent.includes('Encrypt & Save'));
      return {
        disabled: encryptBtn ? encryptBtn.disabled : null,
        val0: inputs[0].value,
        val1: inputs[1].value
      };
    }`);
    assert.strictEqual(mismatchCheck.disabled, true, 'Encrypt button was not disabled on password mismatch');
    console.log('UI correctly disabled submission on password mismatch: PASS');

    // =====================================================================
    // TEST 4: Real Browser Unlock Workflow (/unlock)
    // =====================================================================
    console.log('\n[4] Executing Real Browser Unlock Workflow on /unlock...');
    await sendCdp(ws, 'Page.navigate', { url: `http://127.0.0.1:${PREVIEW_PORT}/unlock` });
    await wait(1500);

    // Dispatch the encrypted PDF bytes from Test 2 into /unlock
    const encBase64 = Buffer.from(capturedEncryptedBytes).toString('base64');
    const unlockDispatchRes = await evaluateInBrowser(ws, `(base64) => {
      window.__capturedBlobs = [];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const file = new File([bytes], 'browser-encrypted.pdf', { type: 'application/pdf' });
      const dt = new DataTransfer();
      dt.items.add(file);
      const input = document.querySelector('input[type="file"]');
      if (!input) return { error: 'No input[type="file"] found' };
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return { success: true };
    }`, [encBase64]);
    assert(unlockDispatchRes.success, 'Failed to dispatch locked PDF to /unlock UI');
    console.log('Dispatched encrypted PDF to /unlock UI.');

    // Wait until getPdfMetaData finishes and password field appears
    let hasLoadedLockedState = false;
    for (let attempt = 0; attempt < 20; attempt++) {
      await wait(300);
      const checkLocked = await evaluateInBrowser(ws, `() => {
        const pwdInput = document.querySelector('input[type="password"]');
        const actionBtn = Array.from(document.querySelectorAll('button')).find(b => b.className && b.className.includes('bg-rose-500'));
        return {
          hasPwdInput: !!pwdInput,
          hasActionBtn: !!actionBtn,
          btnDisabled: actionBtn ? actionBtn.disabled : null
        };
      }`);
      if (checkLocked.hasPwdInput && checkLocked.hasActionBtn) {
        hasLoadedLockedState = true;
        assert.strictEqual(checkLocked.btnDisabled, true, 'Action button should be disabled before entering password');
        console.log('Unlock UI detected encrypted document (action button disabled until password): PASS');
        break;
      }
    }
    assert(hasLoadedLockedState, 'Unlock UI timed out loading locked PDF state');

    // Enter correct password and click Unlock PDF
    const triggerUnlockRes = await evaluateInBrowser(ws, `(pwd) => {
      const pwdInput = document.querySelector('input[type="password"]');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(pwdInput, pwd);
      pwdInput.dispatchEvent(new Event('input', { bubbles: true }));
      pwdInput.dispatchEvent(new Event('change', { bubbles: true }));

      const actionBtn = Array.from(document.querySelectorAll('button')).find(b => b.className && b.className.includes('bg-rose-500'));
      if (!actionBtn) return { error: 'Action button not found' };
      if (actionBtn.disabled) return { error: 'Action button is still disabled' };
      actionBtn.click();
      return { success: true };
    }`, ['BrowserSecret2026!']);
    assert(triggerUnlockRes.success, triggerUnlockRes.error || 'Failed to trigger unlock');
    console.log('Entered password and clicked Unlock PDF in browser.');

    // Poll for SuccessState and capture decrypted blob
    let capturedUnlockedBytes = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      await wait(300);
      const pollUnlock = await evaluateInBrowser(ws, `async () => {
        if (!window.__capturedBlobs || !window.__capturedBlobs.length) return null;
        const item = window.__capturedBlobs[window.__capturedBlobs.length - 1];
        const ab = await item.blob.arrayBuffer();
        return Array.from(new Uint8Array(ab));
      }`);

      if (pollUnlock && pollUnlock.length > 500) {
        capturedUnlockedBytes = new Uint8Array(pollUnlock);
        console.log(`Captured unlocked output blob from browser: ${capturedUnlockedBytes.length} bytes`);
        break;
      }
    }

    assert(capturedUnlockedBytes && capturedUnlockedBytes.length > 0, 'Timed out waiting for unlocked blob in browser');

    // Verify unlocked document in Node
    const unencCheck = await isEncrypted(capturedUnlockedBytes);
    assert.strictEqual(unencCheck.encrypted, false, 'Unlocked PDF is still encrypted');
    const cleanDoc = await PDFDocument.load(capturedUnlockedBytes);
    assert.strictEqual(cleanDoc.getPageCount(), 1, 'Unlocked PDF page count mismatch');
    console.log('Real Browser Unlock produced genuine unencrypted PDF: PASS');

    // =====================================================================
    // TEST 5: Real Browser Non-ASCII / Unicode Password Workflow
    // =====================================================================
    console.log('\n[5] Testing Non-ASCII / Unicode Password Workflow in Browser (/protect)...');
    await sendCdp(ws, 'Page.navigate', { url: `http://127.0.0.1:${PREVIEW_PORT}/protect` });
    await wait(1200);

    // Dispatch synthetic PDF
    await evaluateInBrowser(ws, `(base64) => {
      window.__capturedBlobs = [];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const file = new File([bytes], 'unicode-test.pdf', { type: 'application/pdf' });
      const dt = new DataTransfer();
      dt.items.add(file);
      const input = document.querySelector('input[type="file"]');
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }`, [synthBase64]);

    await wait(1200);

    const unicodePwd = 'Café-München-2026-🛡️';
    await evaluateInBrowser(ws, `(pwd) => {
      const inputs = Array.from(document.querySelectorAll('input[type="password"]'));
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(inputs[0], pwd);
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      setter.call(inputs[1], pwd);
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].dispatchEvent(new Event('change', { bubbles: true }));

      const actionBtn = Array.from(document.querySelectorAll('button')).find(b => b.className && b.className.includes('bg-rose-500'));
      if (actionBtn && !actionBtn.disabled) actionBtn.click();
    }`, [unicodePwd]);

    let capturedUnicodeEnc = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      await wait(300);
      const pollUnicode = await evaluateInBrowser(ws, `async () => {
        if (!window.__capturedBlobs || !window.__capturedBlobs.length) return null;
        const item = window.__capturedBlobs[window.__capturedBlobs.length - 1];
        const ab = await item.blob.arrayBuffer();
        return Array.from(new Uint8Array(ab));
      }`);
      if (pollUnicode && pollUnicode.length > 500) {
        capturedUnicodeEnc = new Uint8Array(pollUnicode);
        break;
      }
    }
    assert(capturedUnicodeEnc, 'Failed to capture unicode encrypted blob');

    // Verify decryption with unicode normalization
    let unicodeDecrypted;
    try {
      unicodeDecrypted = await decryptPDF(capturedUnicodeEnc, unicodePwd);
    } catch (e) {
      if (e.message.includes('Incorrect password')) {
        unicodeDecrypted = await decryptPDF(capturedUnicodeEnc, saslPrep(unicodePwd));
      } else {
        throw e;
      }
    }
    const unicodeDoc = await PDFDocument.load(unicodeDecrypted);
    assert.strictEqual(unicodeDoc.getPageCount(), 1, 'Unicode decrypted document page mismatch');
    console.log(`Non-ASCII password '${unicodePwd}' encrypted in browser and verified: PASS`);

    // =====================================================================
    // TEST 6: Real Browser Re-Protection Workflow (Unlock source in UI -> Re-encrypt)
    // =====================================================================
    console.log('\n[6] Testing Real Browser Re-Protection Workflow (/protect)...');
    await sendCdp(ws, 'Page.navigate', { url: `http://127.0.0.1:${PREVIEW_PORT}/protect` });
    await wait(1200);

    // Upload the encrypted PDF from Test 2
    await evaluateInBrowser(ws, `(base64) => {
      window.__capturedBlobs = [];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const file = new File([bytes], 'locked-to-reprotect.pdf', { type: 'application/pdf' });
      const dt = new DataTransfer();
      dt.items.add(file);
      const input = document.querySelector('input[type="file"]');
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }`, [encBase64]);

    // Wait for unlock prompt on /protect
    let hasUnlockPrompt = false;
    for (let attempt = 0; attempt < 20; attempt++) {
      await wait(300);
      const checkPrompt = await evaluateInBrowser(ws, `() => {
        const currentPwdInput = document.querySelector('input[placeholder="Current Password"]');
        const unlockBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Unlock'));
        return { hasInput: !!currentPwdInput, hasBtn: !!unlockBtn };
      }`);
      if (checkPrompt.hasInput && checkPrompt.hasBtn) {
        hasUnlockPrompt = true;
        break;
      }
    }
    assert(hasUnlockPrompt, 'Re-protection unlock prompt not displayed');

    // Enter source password and unlock inside ProtectTool
    await evaluateInBrowser(ws, `(pwd) => {
      const currentPwdInput = document.querySelector('input[placeholder="Current Password"]');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(currentPwdInput, pwd);
      currentPwdInput.dispatchEvent(new Event('input', { bubbles: true }));
      currentPwdInput.dispatchEvent(new Event('change', { bubbles: true }));

      const unlockBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Unlock'));
      unlockBtn.click();
    }`, ['BrowserSecret2026!']);

    // Wait for transition to unlocked mode and fill new password
    let hasNewPasswordInputs = false;
    for (let attempt = 0; attempt < 20; attempt++) {
      await wait(300);
      const checkNewInputs = await evaluateInBrowser(ws, `() => {
        const inputs = Array.from(document.querySelectorAll('input[type="password"]'));
        return { count: inputs.length };
      }`);
      if (checkNewInputs.count >= 2) {
        hasNewPasswordInputs = true;
        break;
      }
    }
    assert(hasNewPasswordInputs, 'ProtectTool did not transition to unlocked re-protection state');

    // Set new password
    const newPwd = 'NewSecureKey!987';
    await evaluateInBrowser(ws, `(pwd) => {
      const inputs = Array.from(document.querySelectorAll('input[type="password"]'));
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(inputs[0], pwd);
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      setter.call(inputs[1], pwd);
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].dispatchEvent(new Event('change', { bubbles: true }));

      const actionBtn = Array.from(document.querySelectorAll('button')).find(b => b.className && b.className.includes('bg-rose-500'));
      if (actionBtn && !actionBtn.disabled) actionBtn.click();
    }`, [newPwd]);

    let capturedReProtected = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      await wait(300);
      const pollRe = await evaluateInBrowser(ws, `async () => {
        if (!window.__capturedBlobs || !window.__capturedBlobs.length) return null;
        const item = window.__capturedBlobs[window.__capturedBlobs.length - 1];
        const ab = await item.blob.arrayBuffer();
        return Array.from(new Uint8Array(ab));
      }`);
      if (pollRe && pollRe.length > 500) {
        capturedReProtected = new Uint8Array(pollRe);
        break;
      }
    }
    assert(capturedReProtected, 'Failed to capture re-protected blob');

    // Verify in Node that old password fails and new password succeeds
    let oldFailed = false;
    try {
      await decryptPDF(capturedReProtected, 'BrowserSecret2026!');
    } catch (e) {
      if (e.message.includes('Incorrect password')) oldFailed = true;
    }
    assert(oldFailed, 'Re-protected document still accepted old password');

    const reDecrypted = await decryptPDF(capturedReProtected, newPwd);
    const reDoc = await PDFDocument.load(reDecrypted);
    assert.strictEqual(reDoc.getPageCount(), 1, 'Re-protected page count mismatch');
    console.log('Real Browser Re-Protection workflow (source unlock -> re-encrypt): PASS');

    // =====================================================================
    // TEST 7: Unsupported AES-128 (V=4, R=4) Safe Error Notification
    // =====================================================================
    console.log('\n[7] Testing Unsupported AES-128 error handling on /unlock...');
    await sendCdp(ws, 'Page.navigate', { url: `http://127.0.0.1:${PREVIEW_PORT}/unlock` });
    await wait(1200);

    // Generate synthetic V=4, R=4 PDF in Node
    const v4Doc = await PDFDocument.create();
    v4Doc.addPage([300, 300]);
    const v4Dict = v4Doc.context.obj({
      Filter: PDFName.of('Standard'),
      V: PDFNumber.of(4),
      R: PDFNumber.of(4),
      Length: PDFNumber.of(128),
      P: PDFNumber.of(-4),
      O: PDFHexString.of('00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff'),
      U: PDFHexString.of('00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff')
    });
    const ref = v4Doc.context.register(v4Dict);
    v4Doc.context.trailerInfo.Encrypt = ref;
    const v4Raw = await v4Doc.save();
    const v4Base64 = Buffer.from(v4Raw).toString('base64');

    // Dispatch V=4 file to /unlock
    await evaluateInBrowser(ws, `(base64) => {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const file = new File([bytes], 'unsupported-v4.pdf', { type: 'application/pdf' });
      const dt = new DataTransfer();
      dt.items.add(file);
      const input = document.querySelector('input[type="file"]');
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }`, [v4Base64]);

    await wait(1200);

    // Enter password and click Unlock
    await evaluateInBrowser(ws, `(pwd) => {
      const pwdInput = document.querySelector('input[type="password"]');
      if (pwdInput) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(pwdInput, pwd);
        pwdInput.dispatchEvent(new Event('input', { bubbles: true }));
        pwdInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const actionBtn = Array.from(document.querySelectorAll('button')).find(b => b.className && b.className.includes('bg-rose-500'));
      if (actionBtn && !actionBtn.disabled) actionBtn.click();
    }`, ['anyPassword']);

    // Check for toast error message in DOM
    let toastFound = false;
    for (let attempt = 0; attempt < 20; attempt++) {
      await wait(300);
      const toastCheck = await evaluateInBrowser(ws, `() => {
        const bodyText = document.body.innerText;
        return {
          hasUnsupportedMsg: bodyText.includes('unsupported encryption format') || bodyText.includes('legacy AES-128'),
          textSnippet: bodyText.substring(0, 300)
        };
      }`);
      if (toastCheck.hasUnsupportedMsg) {
        toastFound = true;
        console.log('UI displayed explicit unsupported cipher notification: PASS');
        break;
      }
    }
    assert(toastFound, 'Unsupported cipher error message not displayed in UI');

    console.log('\n--- Console Messages During Browser E2E Session ---');
    console.log(consoleMessages.length ? consoleMessages : 'Zero console errors/warnings.');

    ws.close();
    console.log('\n================================================================');
    console.log('REAL BROWSER (CHROME CDP) FULL WORKFLOW E2E VALIDATION: 100% PASS');
    console.log('================================================================');
  } finally {
    try { chromeProc.kill(); } catch (e) {}
    killPort(PREVIEW_PORT);
  }
}

runBrowserE2EValidation().catch(err => {
  console.error('\nBROWSER E2E VALIDATION FAILED:', err);
  killPort(PREVIEW_PORT);
  process.exit(1);
});
