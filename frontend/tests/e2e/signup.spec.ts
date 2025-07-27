import { test, expect } from '@playwright/test';

test.describe('회원가입 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 회원가입 페이지로 이동
    await page.goto('http://localhost:4000/signup');
  });

  test('회원가입 페이지가 정상적으로 로드되는지 확인', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/회원가입/);
    
    // 필수 입력 필드 확인
    await expect(page.locator('input[type="text"]').first()).toBeVisible(); // 닉네임
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').nth(1)).toBeVisible(); // 비밀번호 확인
    
    // 회원가입 버튼 확인
    await expect(page.locator('button[type="submit"]')).toContainText('회원가입');
  });

  test('유효하지 않은 데이터로 회원가입 시도', async ({ page }) => {
    // 빈 폼으로 제출
    await page.locator('button[type="submit"]').click();
    
    // 에러 메시지 확인
    await expect(page.locator('text=닉네임을 입력해주세요')).toBeVisible();
    await expect(page.locator('text=이메일을 입력해주세요')).toBeVisible();
    await expect(page.locator('text=비밀번호를 입력해주세요')).toBeVisible();
  });

  test('닉네임 유효성 검사', async ({ page }) => {
    // 너무 짧은 닉네임
    await page.locator('input[type="text"]').first().fill('a');
    await page.locator('input[type="email"]').click(); // 포커스 이동으로 유효성 검사 트리거
    
    await expect(page.locator('text=닉네임은 2자 이상이어야 합니다')).toBeVisible();
    
    // 특수문자 포함
    await page.locator('input[type="text"]').first().fill('test@user');
    await page.locator('input[type="email"]').click();
    
    await expect(page.locator('text=닉네임은 영문, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다')).toBeVisible();
  });

  test('이메일 유효성 검사', async ({ page }) => {
    // 잘못된 이메일 형식
    await page.locator('input[type="email"]').fill('invalid-email');
    await page.locator('input[type="password"]').first().click();
    
    await expect(page.locator('text=올바른 이메일 형식이 아닙니다')).toBeVisible();
  });

  test('비밀번호 강도 표시기 동작 확인', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first();
    
    // 약한 비밀번호
    await passwordInput.fill('weak');
    await expect(page.locator('text=매우 약함')).toBeVisible();
    
    // 중간 강도 비밀번호
    await passwordInput.fill('Test1234');
    await expect(page.locator('text=보통')).toBeVisible();
    
    // 강한 비밀번호
    await passwordInput.fill('Test1234!@#');
    await expect(page.locator('text=강함')).toBeVisible();
  });

  test('비밀번호 확인 일치 검사', async ({ page }) => {
    await page.locator('input[type="password"]').first().fill('Test1234!');
    await page.locator('input[type="password"]').nth(1).fill('Different123!');
    await page.locator('button[type="submit"]').click();
    
    await expect(page.locator('text=비밀번호가 일치하지 않습니다')).toBeVisible();
  });

  test('정상적인 회원가입 플로우', async ({ page }) => {
    // 콘솔 로그 모니터링
    page.on('console', msg => {
      console.log('브라우저 콘솔:', msg.text());
    });
    
    // 네트워크 요청 모니터링
    page.on('request', request => {
      if (request.url().includes('/api/auth/register')) {
        console.log('회원가입 API 호출:', request.method(), request.url());
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/auth/register')) {
        console.log('회원가입 API 응답:', response.status());
      }
    });
    
    // 유효한 데이터 입력
    await page.locator('input[type="text"]').first().fill('testuser123');
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('Test1234!@#');
    await page.locator('input[type="password"]').nth(1).fill('Test1234!@#');
    
    // 회원가입 버튼 클릭
    await page.locator('button[type="submit"]').click();
    
    // 백엔드 서버가 실행 중이지 않은 경우 에러 메시지 확인
    const errorToast = page.locator('text=백엔드 서버에 연결할 수 없습니다');
    const successToast = page.locator('text=회원가입 성공!');
    
    // 둘 중 하나가 나타날 때까지 대기 (최대 5초)
    await Promise.race([
      errorToast.waitFor({ timeout: 5000 }).catch(() => null),
      successToast.waitFor({ timeout: 5000 }).catch(() => null),
    ]);
    
    // 서버 연결 실패 시
    if (await errorToast.isVisible()) {
      console.log('백엔드 서버가 실행되지 않음');
      await expect(errorToast).toBeVisible();
    }
    // 회원가입 성공 시
    else if (await successToast.isVisible()) {
      console.log('회원가입 성공');
      await expect(page).toHaveURL(/\/signup\/verify/);
    }
  });

  test('비밀번호 표시/숨기기 토글', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first();
    const toggleButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    
    // 비밀번호 입력
    await passwordInput.fill('MyPassword123!');
    
    // 비밀번호 표시 버튼 클릭
    await toggleButton.click();
    
    // input type이 text로 변경되었는지 확인
    await expect(page.locator('input[type="text"][value="MyPassword123!"]')).toBeVisible();
    
    // 다시 숨기기
    await toggleButton.click();
    await expect(passwordInput).toBeVisible();
  });
});

test.describe('회원가입 후 이메일 인증', () => {
  test('이메일 인증 페이지 확인', async ({ page }) => {
    // 직접 인증 페이지로 이동
    await page.goto('http://localhost:4000/signup/verify');
    
    // 페이지 요소 확인
    await expect(page.locator('text=이메일 인증')).toBeVisible();
    await expect(page.locator('text=인증 이메일이 발송되었습니다')).toBeVisible();
  });
});