const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');

async function checkErrors() {
  console.log('개발 서버 시작 중...');
  
  // pnpm dev 실행
  const devProcess = spawn('pnpm', ['dev'], {
    cwd: path.resolve(__dirname),
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // 서버 로그 출력
  devProcess.stdout.on('data', (data) => {
    console.log(`[서버] ${data.toString()}`);
  });

  devProcess.stderr.on('data', (data) => {
    console.error(`[서버 에러] ${data.toString()}`);
  });

  // 서버가 시작될 때까지 대기
  console.log('서버 시작 대기 중...');
  await new Promise(resolve => setTimeout(resolve, 10000));

  console.log('브라우저 시작 중...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 콘솔 메시지 수집
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // 페이지 에러 수집
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push({
      message: error.message,
      stack: error.stack
    });
  });

  // 네트워크 실패 수집
  const networkFailures = [];
  page.on('requestfailed', request => {
    networkFailures.push({
      url: request.url(),
      failure: request.failure()
    });
  });

  try {
    console.log('페이지 로드 중...');
    await page.goto('http://localhost:4000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // 5초 대기하여 추가 에러 수집
    await page.waitForTimeout(5000);

    console.log('\n=== 콘솔 로그 ===');
    consoleLogs.forEach(log => {
      console.log(`[${log.type}] ${log.text}`);
      if (log.location.url) {
        console.log(`  위치: ${log.location.url}:${log.location.lineNumber}`);
      }
    });

    console.log('\n=== 페이지 에러 ===');
    if (pageErrors.length === 0) {
      console.log('페이지 에러 없음');
    } else {
      pageErrors.forEach(error => {
        console.error('에러:', error.message);
        if (error.stack) {
          console.error('스택:', error.stack);
        }
      });
    }

    console.log('\n=== 네트워크 실패 ===');
    if (networkFailures.length === 0) {
      console.log('네트워크 실패 없음');
    } else {
      networkFailures.forEach(failure => {
        console.error(`URL: ${failure.url}`);
        console.error(`실패 원인: ${failure.failure.errorText}`);
      });
    }

    // 스크린샷 저장
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    console.log('\n스크린샷 저장됨: error-screenshot.png');

  } catch (error) {
    console.error('\n페이지 로드 중 에러:', error.message);
  }

  await browser.close();
  devProcess.kill();
  process.exit(0);
}

checkErrors().catch(console.error);