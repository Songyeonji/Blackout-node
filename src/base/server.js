const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // 'mysql2'로 변경
const session = require('express-session')
const app = express();
const port = 8081;

// 세션 설정
app.use(session({
  secret: 'blackout', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // HTTPS를 사용하지 않는 경우 false로 설정
}));

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
app.post('/usr/member/doJoin', (req, res) => {
  const { name, loginId, loginPw, email } = req.body;

  if (!(name && loginId && loginPw && email)) {
    return res.status(400).send('All fields are required');
  }

  const query = 'INSERT INTO member (name, loginId, loginPw, email) VALUES (?, ?, ?, ?)';
  db.query(query, [name, loginId, loginPw, email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Registration successful');
  });
});

// 아이디 중복 확인 라우트
app.get('/usr/member/isLoginIdAvailable', (req, res) => {
  const { loginId } = req.query;

  if (!loginId) {
    return res.status(400).send('loginId is required');
  }

  const query = 'SELECT id FROM member WHERE loginId = ?';
  db.query(query, [loginId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }

    res.send(results.length === 0);
  });
});


// 로그인 라우트
app.post('/usr/member/doLogin', (req, res) => {
  const { loginId, loginPw } = req.body;

  console.log(`Login Request: loginId=${loginId}, loginPw=${loginPw}`);

  const query = 'SELECT id, loginId, loginPw, name FROM `member` WHERE loginId = ?';
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
      // 세션에 사용자 ID 저장
    req.session.userId = results[0].id;
    res.json({ id: results[0].id, name: results[0].name, authToken: 'your-auth-token' });
  });
});

// 회원 정보 조회 라우트
app.get('/usr/member/myPage', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(403).send('Unauthorized');
  }

  const query = 'SELECT name, loginId, email FROM member WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('User not found');
    }
  });
});


// 회원 정보 수정 라우트
app.post('/usr/member/doModify', (req, res) => {
  const { name, email } = req.body;
  const userId = req.session.userId;
  if (!userId) {
    return res.status(403).send('Unauthorized');
  }
  const query = 'UPDATE member SET name = ?, email = ?, updateDate = NOW() WHERE id = ?';
  db.query(query, [name, email, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Information updated successfully');
  });
});

app.get('/usr/article/showListWithRecommendCount', (req, res) => {
  const query = `
    SELECT 
      a.id, 
      a.regDate, 
      a.updateDate, 
      a.memberId, 
      a.boardId, 
      a.title, 
      a.img, 
      a.body, 
      a.hitCount, 
      COUNT(rp.id) AS recommendCount 
    FROM 
      article a 
    LEFT JOIN 
      recommendPoint rp ON a.id = rp.relId AND rp.relTypeCode = 'article' 
    GROUP BY 
      a.id, 
      a.regDate, 
      a.updateDate, 
      a.memberId, 
      a.boardId, 
      a.title, 
      a.img, 
      a.body, 
      a.hitCount
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

// 게시글 좋아요 토글 라우트
app.post('/usr/recommendPoint/toggleRecommend/article/:articleId', async (req, res) => {
  const articleId = req.params.articleId;
  const memberId = req.session.userId;

  if (!memberId) {
    return res.status(403).send('Unauthorized');
  }

  try {
    // 이미 추천했는지 확인
    const checkQuery = `
      SELECT id
      FROM recommendPoint
      WHERE memberId = ? AND relId = ? AND relTypeCode = 'article'
    `;
    const [checkResults] = await db.promise().query(checkQuery, [memberId, articleId]);

    // 이미 추천했다면 삭제, 아니면 추가
    if (checkResults.length > 0) {
      const deleteQuery = 'DELETE FROM recommendPoint WHERE id = ?';
      await db.promise().query(deleteQuery, [checkResults[0].id]);
    } else {
      const insertQuery = 'INSERT INTO recommendPoint (memberId, relTypeCode, relId, point) VALUES (?, "article", ?, 1)';
      await db.promise().query(insertQuery, [memberId, articleId]);
    }

    // 추천 수 계산
    const countQuery = `
      SELECT COUNT(id) AS recommendCount 
      FROM recommendPoint 
      WHERE relId = ? AND relTypeCode = 'article'
    `;
    const [countResults] = await db.promise().query(countQuery, [articleId]);

    res.json({ recommendCount: countResults[0].recommendCount });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
});

//게시물 글쓰기 라우트
app.post('/usr/article/doWrite', async (req, res) => {
  const { title, body, boardId, memberId, imageUrls } = req.body;

  if (!(title && body && boardId && memberId)) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const insertArticleQuery = 'INSERT INTO article (title, body, boardId, memberId, img, regDate) VALUES (?, ?, ?, ?, ?, NOW())';
    await db.promise().query(insertArticleQuery, [title, body, boardId, memberId, imageUrls.join(',')]);
    res.send('Article created successfully');
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
});

//게시물 삭제 라우트
app.delete('/usr/article/doDelete', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('Article ID is required');
  }

  try {
    const deleteArticleQuery = 'DELETE FROM article WHERE id = ?';
    await db.promise().query(deleteArticleQuery, [id]);
    res.send('Article deleted successfully');
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
});

//게시물 수정 라우트
app.put('/usr/article/doModify', async (req, res) => {
  const { id, title, body, boardId } = req.body;

  if (!(id && title && body && boardId)) {
    return res.status(400).send('All fields are required');
  }

  try {
    const updateArticleQuery = 'UPDATE article SET title = ?, body = ?, boardId = ? WHERE id = ?';
    await db.promise().query(updateArticleQuery, [title, body, boardId, id]);
    res.send('Article updated successfully');
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
});

//게시물 불러오기 라우트
app.get('/usr/article/getArticle', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('Article ID is required');
  }

  try {
    const selectArticleQuery = 'SELECT id, regDate, updateDate, memberId, boardId, title, body FROM article WHERE id = ?';
    const [article] = await db.promise().query(selectArticleQuery, [id]);
    if (article.length > 0) {
      res.json(article[0]);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
}
});
// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
