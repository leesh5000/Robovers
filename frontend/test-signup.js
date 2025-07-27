const { chromium } = require('@playwright/test');

(async () => {
  console.log('회원가입 기능 테스트 시작...');
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 콘솔 로그 모니터링
  page.on('console', msg => {
    console.log(`브라우저 콘솔 [${msg.type()}]:`, msg.text());
  });
  
  // 네트워크 요청 모니터링
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log('API 요청:', request.method(), request.url());
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log('API 응답:', response.status(), response.url());
    }
  });
  
  // 페이지 에러 모니터링
  page.on('pageerror', error => {
    console.error('페이지 에러:', error.message);
  });
  
  try {
    // 회원가입 페이지로 이동
    console.log('회원가입 페이지로 이동 중...');
    await page.goto('http://localhost:4000/signup', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('페이지 로드 완료');
    
    // 페이지 타이틀 확인
    const title = await page.title();
    console.log('페이지 타이틀:', title);
    
    // 회원가입 폼 필드 확인
    const nicknameInput = await page.$('input[type="text"]');
    const emailInput = await page.$('input[type="email"]');
    const passwordInputs = await page.$$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log('폼 필드 확인:');
    console.log('- 닉네임 입력:', nicknameInput ? '있음' : '없음');
    console.log('- 이메일 입력:', emailInput ? '있음' : '없음');
    console.log('- 비밀번호 입력:', passwordInputs.length, '개');
    console.log('- 제출 버튼:', submitButton ? '있음' : '없음');
    
    // 테스트 데이터 입력
    console.log('\n테스트 데이터 입력 중...');
    
    // 닉네임 입력
    await page.fill('input[type="text"]', 'testuser123');
    console.log('✓ 닉네임 입력 완료');
    
    // 이메일 입력
    await page.fill('input[type="email"]', 'test@example.com');
    console.log('✓ 이메일 입력 완료');
    
    // 비밀번호 입력
    await page.fill('input[type="password"]:nth-of-type(1)', 'Test1234!@#');
    console.log('✓ 비밀번호 입력 완료');
    
    // 비밀번호 확인 입력
    await page.fill('input[type="password"]:nth-of-type(2)', 'Test1234!@#');
    console.log('✓ 비밀번호 확인 입력 완료');
    
    // 스크린샷 저장
    await page.screenshot({ path: 'signup-form-filled.png' });
    console.log('✓ 스크린샷 저장: signup-form-filled.png');
    
    // 회원가입 버튼 클릭
    console.log('\n회원가입 버튼 클릭...');
    await page.click('button[type="submit"]');
    
    // 응답 대기
    console.log('서버 응답 대기 중...');
    
    // 5초 대기하면서 토스트 메시지 확인
    await page.waitForTimeout(5000);
    
    // 현재 URL 확인
    const currentUrl = page.url();
    console.log('현재 URL:', currentUrl);
    
    // 토스트 메시지 확인
    const toastMessage = await page.$eval('div[role="status"]', el => el.textContent).catch(() => null);
    if (toastMessage) {
      console.log('토스트 메시지:', toastMessage);
    }
    
    // 개발자 도구에서 네트워크 에러 확인
    const networkErrors = await page.evaluate(() => {
      const errors = [];
      const entries = performance.getEntriesByType('resource');
      entries.forEach(entry => {
        if (entry.name.includes('/api/') && entry.responseEnd === 0) {
          errors.push(entry.name);
        }
      });
      return errors;
    });
    
    if (networkErrors.length > 0) {
      console.log('\n네트워크 에러 발생:');
      networkErrors.forEach(error => console.log('- ', error));
    }
    
  } catch (error) {
    console.error('테스트 중 에러 발생:', error);
  }
  
  // 브라우저 열어둔 상태로 대기
  console.log('\n브라우저를 닫으려면 Ctrl+C를 누르세요...');
  await new Promise(() => {}); // 무한 대기
})();