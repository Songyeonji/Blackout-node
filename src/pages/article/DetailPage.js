import React, { useEffect, useState , useContext} from 'react';
import { useParams, useHistory, Link} from 'react-router-dom';
import axios from 'axios';

import { AppBar, Toolbar, createTheme, ThemeProvider } from '@mui/material';
import NavigationBar from '../../components/NavigationBar';
import { AuthContext } from '../../AuthContext';





const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

const DetailPage = (props) => {
  const { id } = useParams();

  const history = useHistory();

  const [article, setArticle] = useState({});
  const [replies, setReplies] = useState([]);
  const { userId } = useContext(AuthContext); 
  // 게시글 정보 가져오기
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/usr/article/getArticle?id=${id}`);
        console.log(response.data); // 서버 응답 확인
        setArticle({
          ...response.data,
          memberId: Number(response.data.memberId) // memberId를 숫자로 변환
        });
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };
  
    fetchArticle();
  }, [id]);

  
  const handleDelete = async () => {
    if (window.confirm('게시글을 삭제하시겠습니까?') && article.id) {
      try {
        await axios.delete(`http://localhost:8080/usr/article/doDelete?id=${article.id}`);
        history.push('/learn-more');
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };
    // 게시글 수정 (수정 페이지로 이동하는 로직 추가 필요)
    const handleEdit = () => {
      history.push(`/edit/${article.id}`);
    };

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
      <NavigationBar/>

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
              <h1>{article.title}</h1> {/* 게시글 제목 */}
              <div className="mt-8 text-xl">
                <section>
                  <div className="container mx-auto px-3 pb-8 border-bottom-line">
                    <div className="table-box-type">
                      <table className="table table-lg">
                        {/* 게시글 상세 정보 */}
                        <tr>
                          <th style={{ padding: "10px" }}>번호</th>
                          <td style={{ padding: "10px" }}>{article.id}</td>
                        </tr>
                        <tr>
                          <th style={{ padding: "10px" }}>작성일</th>
                          <td style={{ padding: "10px" }}>{article.regDate && new Date(article.regDate).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                          <th style={{ padding: "10px" }}>최종 수정일</th>
                          <td style={{ padding: "10px" }}>{article.updateDate && new Date(article.updateDate).toLocaleString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        </tr>
                        <tr>
                          <th style={{ padding: "10px" }}>내용</th>
                          <td style={{ padding: "10px" }}>{article.body}</td> {/* 게시글 내용 */}
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
          {console.log('User ID:', userId, 'Article Member ID:', article.memberId)}
          {userId === article.memberId && (
              <>
                <button className="btn-text-color btn btn-outline btn-sm" onClick={handleDelete}>
                  삭제
                </button>
                <button className="btn-text-color btn btn-outline btn-sm" onClick={handleEdit}>
                  수정
                </button>
              </>
            )}
            <button className="btn-text-color btn btn-outline btn-sm" onClick={() => history.goBack()}>
              뒤로가기
            </button>
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
