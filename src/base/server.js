const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // 'mysql2'로 변경
const session = require('express-session')
const app = express();
const port = 8081;
// const axios = require('axios');
// const cheerio = require('cheerio');

// 세션 설정
app.use(session({
  secret: 'blackout', // 세션 암호화 키 (보안을 위해 복잡한 문자열 사용)
  resave: false,// 세션을 항상 저장할지 여부 (보통 false로 설정)
  saveUninitialized: false,// 초기화되지 않은 세션을 저장소에 저장할지 여부
  cookie: { secure: false } // HTTPS를 사용하지 않는 경우 false로 설정
}));


// JSON 요청을 처리하기 위한 미들웨어
app.use(express.json());

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000', // 클라이언트 애플리케이션의 도메인
  credentials: true  // CORS 요청 시 쿠키를 포함시키기 위함
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
  const { name, loginId, loginPw, email } = req.body;//요청받은 내용들 추출

  if (!(name && loginId && loginPw && email)) {
    return res.status(400).send('All fields are required');
  }

  //회원추가하는 데이터 베이스 코드
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
  const { loginId } = req.query;//요청받은 내용들 추출

  //로그인 아이디가 없을 경우
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
  const { loginId, loginPw } = req.body;// 클라이언트로부터 전달받은 로그인 ID와 비밀번호

  console.log(`Login Request: loginId=${loginId}, loginPw=${loginPw}`);

  // 데이터베이스 쿼리: 해당 loginId를 가진 사용자 조회
  const query = 'SELECT id, loginId, loginPw, name FROM `member` WHERE loginId = ?';
  db.query(query, [loginId], (err, results) => {
    if (err) {
      // 데이터베이스 쿼리 중 에러 발생 시
      console.error('Database error:', err);
      return res.status(500).send('서버 에러');
    }

    console.log(`Results Length: ${results.length}`);
    // 사용자 조회 결과가 있고 비밀번호가 일치하는 경우
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
    console.log('로그인 라우트 req.session.userId : '+ req.session.userId);
    res.json({ id: results[0].id, name: results[0].name, authToken: 'your-auth-token' });
  });
});

// 로그아웃 라우트
app.post('/usr/member/doLogout', (req, res) => {
  // 세션에서 사용자 정보 삭제
  req.session.destroy(err => {
    if (err) {
      console.error('Session destroy error:', err);
    }
  });

  res.send('Logout successful');
});

// 회원 정보 조회 라우트
app.get('/usr/member/myPage', (req, res) => {
  const userId = req.session.userId;//현재 로그인 된 id 추출
  console.log('myPage userId : ' + userId);
  if (!userId) {
    return res.status(403).send('Unauthorized');
  }
 // 데이터베이스에서 사용자 정보 조회
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
  const { name, email } = req.body;//요청받은 내용들 추출
  const userId = req.session.userId;//현재 로그인 된 id 추출
  console.log('doModify userId : ' + userId);

  //userid가 없을 경우
  if (!userId) {
    return res.status(403).send('Unauthorized');
  }

   // 데이터베이스에서 사용자 정보 수정
  const query = 'UPDATE member SET name = ?, email = ?, updateDate = NOW() WHERE id = ?';
  db.query(query, [name, email, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Information updated successfully');
  });
});


// 사용자 정보 로그인(userid)를 js 쓸 수있도록 가져오는  라우트
app.get('/usr/member/getLoggedUser', (req, res) => {
  const userId = req.session.userId;//현재 로그인 된 아이디 추출
  if (!userId) {
    return res.status(403).send('Unauthorized');
  }
  // 데이터베이스에서 사용자 정보 조회
  const query = 'SELECT id, name FROM member WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }
    if (results.length > 0) {
      res.json({ id: results[0].id, name: results[0].name });
    } else {
      res.status(404).send('User not found');
    }
  });
});

//get
app.get('/usr/article/showListWithRecommendCount', (req, res) => {
  const userId = req.session.userId; // 현재 로그인한 사용자 ID
  // const user = req.session.article;
  // const articleId = req.params.articleId;
  // const loginedMemberId = req.session.userId;
  console.log(req.session)

  // console.log('글 목록 : articleId : ' + articleId); // ud

  // console.log('글 목록 : loginedMemberId' + loginedMemberId); ud
  // console.log('guser1 : ' + user);
  // console.log('g로그인한놈1' + userId);
  console.log('글 목록 : 로그인한놈 : ' + req.session.userId);
  console.log('글 목록 : session : ' + req.session);
  
  console.log(JSON.stringify(req.session));
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
      a.point,
      (SELECT COUNT(*) > 0 FROM recommendPoint WHERE relId = a.id AND relTypeCode = 'article' AND memberId = ?) AS isLikedByUser
    FROM 
      article a
    LEFT JOIN 
      recommendPoint rp ON a.id = rp.relId AND rp.relTypeCode = 'article' 
    GROUP BY 
      a.id;
  `;


  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }

  });

});
// 게시글 좋아요 토글 라우트
app.post('/usr/recommendPoint/toggleRecommend/article/:articleId', async (req, res) => {
  const articleId = req.params.articleId;//게시물 번호들
  const userId = req.session.userId;// 현재 로그인한 사용자 ID

  console.log('게시글 좋아요 articleId : ' + articleId);
  console.log('게시글 좋아요 userId : ' + userId);

  if (!userId) {
    return res.status(403).send('Unauthorized');
  }

  try {
    // 이미 추천했는지 확인
    const checkQuery = `
      SELECT id
      FROM recommendPoint
      WHERE memberId = ? AND relId = ? AND relTypeCode = 'article'
    `;
    const [checkResults] = await db.promise().query(checkQuery, [userId, articleId]);

    let isLikedByUser;

    // 이미 추천했다면 삭제, 아니면 추가
    if (checkResults.length > 0) {
      const deleteQuery = 'DELETE FROM recommendPoint WHERE id = ?';
      await db.promise().query(deleteQuery, [checkResults[0].id]);
      isLikedByUser = false;  // 좋아요 삭제
    } else {
      const insertQuery = 'INSERT INTO recommendPoint (memberId, relTypeCode, relId, point) VALUES (?, "article", ?, 1)';
      await db.promise().query(insertQuery, [userId, articleId]);
      isLikedByUser = true;  // 좋아요 추가
    }

    // 추천 수 업데이트
    const updatePointQuery = 'UPDATE article SET point = (SELECT COUNT(*) FROM recommendPoint WHERE relId = ? AND relTypeCode = "article") WHERE id = ?';
    await db.promise().query(updatePointQuery, [articleId, articleId]);

    // 업데이트된 추천 수 가져오기
    const selectPointQuery = 'SELECT point FROM article WHERE id = ?';
    const [pointResults] = await db.promise().query(selectPointQuery, [articleId]);

    res.json({ point: pointResults[0].point, isLikedByUser });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
});





//게시물 글쓰기 라우트
app.post('/usr/article/doWrite', async (req, res) => {
  const { title, body, boardId, memberId, imageUrls } = req.body;//요청받은 내용들 추출

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
  const { id } = req.query;//url 쿼리에서 게시글 id 추출

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
  const { title, body, boardId } = req.body;//요청받은 내용들 추출
  const { id } = req.query; // URL 쿼리에서 id 추출
   // 로그로 요청 본문 확인
   console.log(`Received PUT request with data: ${JSON.stringify(req.body)}`);

  if (!(id && title && body && boardId)) {
    return res.status(400).send('All fields are required');
  }

  //업데이트
  try {
    const updateArticleQuery = 'UPDATE article SET title = ?, body = ?, boardId = ? WHERE id = ?';
    await db.promise().query(updateArticleQuery, [title, body, boardId, id]);
    res.send('Article updated successfully');
    //오류날 경우
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
});

//게시물 불러오기 라우트
app.get('/usr/article/getArticle', async (req, res) => {
  const { id } = req.query;// URL 쿼리에서 id 추출

  if (!id) {
    return res.status(400).send('Article ID is required');
  }

  try {
    const selectArticleQuery = 'SELECT a.id, a.regDate, a.updateDate, a.memberId, a.boardId, a.title, a.point, a.body, m.name AS writer FROM article AS a INNER JOIN `member` AS m on a.memberId = m.id  WHERE a.id = ?';
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
// // 크롤링
// app.get('/api/crawl', async (req, res) => {
//   try {
//       const url = '여기에 크롤링할 웹사이트 주소를 입력하세요';
//       const { data } = await axios.get(url);
//       const $ = cheerio.load(data);
//       let articles = [];

//       // 예시: 각 기사의 제목과 링크를 가져오기
//       $('article').each((index, element) => {
//           const title = $(element).find('h2').text();
//           const link = $(element).find('a').attr('href');
//           articles.push({ title, link });
//       });

//       res.json(articles);
//   } catch (error) {
//       console.error('Crawling failed:', error);
//       res.status(500).send('Server Error');
//   }
// });


//회원용 달력 일기 가져오기
app.get('/api/diaryEntries', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    // Consider returning an empty array or a message for non-logged-in users
    return res.status(403).send('Unauthorized');
  }

  try {
    const query = 'SELECT * FROM DiaryEntries WHERE userId = ? ORDER BY entryDate DESC';
    const [entries] = await db.query(query, [userId]);
    res.json(entries);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
});
//회원 일기 항목 데이터 저장하기
app.post('/api/diaryEntries', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(403).send('Unauthorized');
  }

  const { entryDate, entryText, entryType, entryValue, entryRating, entryColor } = req.body;

  try {
    const insertQuery = `
      INSERT INTO DiaryEntries (userId, entryDate, entryText, entryType, entryValue, entryRating, entryColor)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await db.query(insertQuery, [userId, entryDate, entryText, entryType, entryValue, entryRating, entryColor]);
    res.send('Entry saved successfully');
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
});
// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
