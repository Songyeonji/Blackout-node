import React, { useEffect, useState , useContext} from 'react';
import { useParams, useHistory, Link} from 'react-router-dom';
import axios from 'axios';

import { AppBar, Toolbar, createTheme, ThemeProvider } from '@mui/material';
import NavigationBar from '../../components/NavigationBar';






const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

const DetailPage = () => {
  const { id } = useParams(); // URL에서 게시글 ID 추출
  const history = useHistory(); // 히스토리 객체
  const [article, setArticle] = useState({});
  const [userId, setUserId] = useState(null);//로그인한 사람의 id

  //필요한 정보들 백엔드에서 불러오기
  useEffect(() => {
    const fetchArticleAndUser = async () => {
      try {
          // 게시글 정보 가져오기
        const articleResponse = await axios.get(`http://localhost:8081/usr/article/getArticle?id=${id}`);
        setArticle(articleResponse.data);
        //사용자 아이디 가져오기
        const userResponse = await axios.get('http://localhost:8081/usr/member/getLoggedUser', { withCredentials: true });
        if (userResponse.data && userResponse.data.id) {
          setUserId(userResponse.data.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchArticleAndUser();
  }, [id]);
  
  //게시글 삭제함수
  const handleDelete = async () => {
    if (window.confirm('게시글을 삭제하시겠습니까?') && article.id) {
      try {
        await axios.delete(`http://localhost:8081/usr/article/doDelete?id=${article.id}`);
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


  // handleLike 함수 정의
  const handleLike = async () => {
    try {
      const url = `http://localhost:8081/usr/recommendPoint/toggleRecommend/article/${id}`;
      const response = await axios.post(url, {}, { withCredentials: true });

      if (response.data.isLikedByUser !== undefined) {
        setArticle(prevArticle => ({
          ...prevArticle,
          isLiked: response.data.isLikedByUser,
          point: response.data.point
        }));
      } else {
        alert("로그인이 필요합니다.");
      }
    } catch (error) {
      console.error('Error handling like:', error);
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
                            <button
                                  id="recommendBtn"
                                  className={`mr-8 btn-text-color btn btn-outline btn-xs ${
                                    article.point > 0 ? 'btn-active' : ''
                                  }`}
                                  onClick={handleLike}
                                >
                                  좋아요👍
                                </button>
                                <span>좋아요 : {article.point}개</span>
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
