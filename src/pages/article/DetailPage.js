import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link} from 'react-router-dom';
import axios from 'axios';

import { AppBar, Toolbar, createTheme, ThemeProvider } from '@mui/material';




const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

const DetailPage = (props) => {
  const { index, id } = useParams();

  const history = useHistory();

  const [article, setArticle] = useState({});
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/articles/${id}`);
        setArticle(response.data.article);
        setReplies(response.data.replies);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [id]);

  const handleRecommend = async () => {
    try {
      const response = await axios.get(`/api/recommendPoint/doRecommendPoint`, {
        params: {
          relTypeCode: 'article',
          relId: article.id,
          recommendBtn: article.point > 0,
        },
      });
      if (response.data.success) {
        setArticle((prevArticle) => ({
          ...prevArticle,
          point: response.data.point,
        }));
      }
    } catch (error) {
      console.error('Error handling recommendation:', error);
    }
  };

  // const handleReplyModify = async (replyId, index) => {
  //   try {
  //     const response = await axios.get(`/api/reply/getReplyContent?id=${replyId}`);
  //     // Handle reply modification UI update
  //     // For example, you can update state or show a modal
  //   } catch (error) {
  //     console.error('Error fetching reply content:', error);
  //   }
  // };

  // const handleReplyCancel = (index) => {
  //   // Handle reply modification cancellation
  //   // For example, you can update state or revert UI changes
  // };

  // const handleReplyDelete = async (replyId) => {
  //   try {
  //     const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
  //     if (confirmDelete) {
  //       await axios.get(`/api/reply/doDelete?id=${replyId}`);
  //       // Handle reply deletion UI update
  //       // For example, you can update state or refresh replies
  //     }
  //   } catch (error) {
  //     console.error('Error handling reply deletion:', error);
  //   }
  // };


  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <div className="flex-1"></div>
            <Link to="/drink-recommendation" style={{ color: "white", textDecoration: "none" }}>
              <span className="font-bold">오늘의 술 추천</span>
            </Link>
            <div className="flex-1"></div>
          </Toolbar>
        </AppBar>
        <Toolbar />

        <section className="text-xl mt-20">
          <div className="container mx-auto px-3 text-center">
            <div className="table-box-type text-center">
              <article
                style={{
                  border: "1px solid #ddd", // 테두리 스타일 추가
                  borderRadius: "8px", // 둥근 테두리를 위한 경계 반경 추가
                  padding: "20px", // 간격을 위한 패딩 추가
                }}
              >
                <h1>{index}에 대한 상세페이지</h1>
                <div className="mt-8 text-xl">
      <section>
        <div className="container mx-auto px-3 pb-8 border-bottom-line">
          <div className="table-box-type">
            <table className="table table-lg">
              <tr>
                <th>번호</th>
                <td>{article.id}</td>
              </tr>
              <tr>
                <th>작성일</th>
                <td>{article.regDate && article.regDate.substring(2, 16)}</td>
              </tr>
              {/* ... (더 많은 테이블 행 추가) */}
              <tr>
                <th>추천</th>
                <td>
                  {/* {rq.getLoginedMemberId() === 0 ? (
                    <span>{article.point}</span>
                  ) : ( */}
                    <>
                      <button
                        id="recommendBtn"
                        className={`mr-8 btn-text-color btn btn-outline btn-xs ${
                          article.point > 0 ? 'btn-active' : ''
                        }`}
                        onClick={handleRecommend}
                      >
                        좋아요👍
                      </button>
                      <span>좋아요 : {article.point}개</span>
                    </>
                  {/* )} */}
                </td>
              </tr>
              {/* ... (더 많은 테이블 행 추가) */}
            </table>
          </div>
          <div className="btns mt-2">
            <button className="btn-text-color btn btn-outline btn-sm" onClick={() => history.goBack()}>
              뒤로가기
            </button>
            {/* ... (더 많은 버튼 및 UI 추가) */}
          </div>
        </div>
      </section>
      <section className="my-5 text-base">
        <div className="container mx-auto px-3">
          <h2 className="text-lg">댓글</h2>
          {/* ... (더 많은 댓글 UI 및 로직 추가) */}
        </div>
      </section>
    </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
};

export default DetailPage;
