const express = require('express');
const app = express();
const port = 8080;

app.use(express.json()); // JSON 요청 본문을 파싱하기 위한 미들웨어

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
