const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // 'mysql2'로 변경
const session = require('express-session')
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const port = 8081;
// const axios = require('axios');
// const cheerio = require('cheerio');

require('dotenv').config();

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

//게시물 불러오는 라우터
app.get('/usr/article/showListWithRecommendCount', (req, res) => {
  const userId = req.session.userId || 0; // 로그인하지 않은 경우 0 또는 게스트 사용자 표현으로 사용
  const { boardId, page = 1, pageSize = 10, searchKeyword, searchKeywordType } = req.query;
  const offset = (page - 1) * pageSize;

  // 검색어에 따라 SQL 쿼리 조건 추가
  let searchSQL = '';
  let searchParams = [];
  if (searchKeyword) {
    switch (searchKeywordType) {
      //제목 검색하는 쿼리
      case 'title':
        searchSQL += 'AND title LIKE ? ';
        searchParams.push(`%${searchKeyword}%`);
        break;
      //내용 검색하는 쿼리
      case 'body':
        searchSQL += 'AND body LIKE ? ';
        searchParams.push(`%${searchKeyword}%`);
        break;
      //제목+내용 검색하는 쿼리
      case 'title,body':
        searchSQL += 'AND (title LIKE ? OR body LIKE ?) ';
        searchParams.push(`%${searchKeyword}%`, `%${searchKeyword}%`);
        break;
      default:
        // 기본값이나 정의되지 않은 searchKeywordType에 대한 처리
        break;
    }
  }

  // 게시글 데이터를 가져오는 쿼리
  const query = `
    SELECT a.*, 
          (SELECT COUNT(*) FROM recommendPoint WHERE relId = a.id AND relTypeCode = 'article' AND memberId = ?) AS isLikedByUser
    FROM article a
    WHERE a.boardId = ? ${searchSQL}
    ORDER BY a.id DESC
    LIMIT ?
    OFFSET ?;
  `;

  // 전체 게시글 수를 계산하는 쿼리 (페이지네이션을 위해 필요)
  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM article 
    WHERE boardId = ? ${searchSQL};
  `;

  // 쿼리 파라미터 설정 (검색 조건 포함)
  let queryParams = [userId, boardId, ...searchParams, parseInt(pageSize), parseInt(offset)];
  let countQueryParams = [boardId, ...searchParams];

  // 전체 게시글 수 조회
  db.query(countQuery, countQueryParams, (err, totalResults) => {
    if (err) {
      console.error('데이터베이스 오류:', err);
      return res.status(500).send('서버 오류');
    }

    const totalItems = totalResults[0].total;
    const totalPages = Math.ceil(totalItems / pageSize);

    // 검색 조건에 맞는 게시글 데이터 조회
    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error('데이터베이스 오류:', err);
        return res.status(500).send('서버 오류');
      }

      res.json({ articles: results, totalPages, currentPage: parseInt(page) });
    });
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
//

// 클라이언트로부터 받은 질문을 OpenAI의 ChatGPT로 전달하는 엔드포인트
app.post('/api/chatgpt', async (req, res) => {
  try {
    const userQuery = req.body.query;
      // 요청 로그 출력
    console.log('Received request:', req.body);
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userQuery }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.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}`,
          'Content-Type': 'application/json',
        }
      }
    );
    console.log('Sending response to client...');
    // OpenAI로부터 받은 응답을 클라이언트에 전달
    res.json(response.data);
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    res.status(500).send('Internal Server Error');
  }
});


// 크롤링

app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  console.log(`검색 쿼리: ${query}`); // 콘솔에 검색 쿼리 로깅
  
  try {
    // 네이버 블로그 검색 API 사용
    const response = await axios.get('https://openapi.naver.com/v1/search/blog.json', {
      params: { query: `${query} 술` },
      headers: {
        'X-Naver-Client-Id': 'XmW984WqUSoPwCffqkk_', // 실제 사용할 Client ID
        'X-Naver-Client-Secret': 'Ky9uQ2GFsY' // 실제 사용할 Client Secret
      }
    });

    // 성공적으로 데이터를 받아왔는지 콘솔로 확인
    console.log('네이버 API로부터 데이터 수신 성공');


    // 클라이언트에게 API 응답 전송
    res.json(response.data.items);
  } catch (error) {
    // 에러 로깅
    console.error('네이버 API 요청 중 오류 발생:', error.message);
    res.status(500).send('서버 내부 오류');
  }
});



// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
