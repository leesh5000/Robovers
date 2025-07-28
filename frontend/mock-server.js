const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { email, password, nickname } = req.body;
  
  console.log('Registration request received:', { email, nickname });
  
  // Simulate validation
  if (!email || !password || !nickname) {
    return res.status(400).json({
      message: '필수 필드가 누락되었습니다',
      error: 'Bad Request',
    });
  }
  
  // Simulate successful registration
  res.status(201).json({
    id: Math.random().toString(36).substr(2, 9),
    email,
    nickname,
    message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login request received:', { email });
  
  res.json({
    user: {
      id: Math.random().toString(36).substr(2, 9),
      email,
      nickname: 'TestUser',
      role: 'USER',
      isActive: true,
      emailVerified: true,
    },
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  });
});

// Verify email endpoint
app.post('/api/auth/verify-email', (req, res) => {
  const { token } = req.body;
  
  console.log('Email verification request received:', { token });
  
  res.json({
    message: '이메일 인증이 완료되었습니다.',
  });
});

const PORT = 4010;
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});