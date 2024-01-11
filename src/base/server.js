const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 8081;

// JSON 요청을 처리하기 위한 미들웨어
app.use(express.json());

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000', // 클라이언트 애플리케이션의 도메인
  credentials: true  // withCredentials를 위해 필요
}));
app.options('*', cors()); // 모든 OPTIONS 요청에 대해 CORS 허용

// MySQL 데이터베이스 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // 데이터베이스 사용자 이름
  password: '', // 데이터베이스 비밀번호
  database: 'Blackout', // 데이터베이스 이름
  port: 3307  
});

// 데이터베이스 연결
db.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
});

// 회원가입 라우트
app.post('/usr/member/doJoin', async (req, res) => {
  const { name, loginId, loginPw, email } = req.body;
  try {
    const query = 'INSERT INTO member (name, loginId, password, email) VALUES (?, ?, ?, ?)';    
    db.query(query, [name, loginId, loginPw, email], (err, result) => {
      if (err) throw err;
      res.send('회원가입 성공');
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('서버 에러');
  }
});

app.post('/usr/member/doLogin', (req, res) => {
  const { loginId, loginPw } = req.body;

  console.log(`Login Request: loginId=${loginId}, loginPw=${loginPw}`);

  const query = 'SELECT \* FROM `member` WHERE loginId = ?';
  db.query(query, [loginId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('서버 에러');
    }

    console.log(`Results Length: ${results.length}`);
    if (results.length > 0) {
      console.log(`User's Password from DB: ${results[0].loginPw}`);
    }

    if (results.length === 0 || results[0].loginPw !== loginPw) {
      console.log('Login failed: User not found or password incorrect');
      return res.status(400).send('사용자를 찾을 수 없거나 비밀번호가 잘못되었습니다.');
    }

    console.log('Login successful');
    res.json({ id: results[0].id, name: results[0].name, authToken: 'your-auth-token' });
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
