import React, { useState } from "react";
import { AppBar, Toolbar, createTheme, ThemeProvider, Box, Tabs, Tab, Typography, Button } from "@mui/material";
import { Link, useHistory } from "react-router-dom"; // useHistory 추가

const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

const WritePage = () => {
  const [boardId, setBoardId] = useState(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const history = useHistory(); // useHistory로 history 객체 가져오기

  const handleSubmit = (event) => {
    event.preventDefault();

    // 글쓰기 로직을 추가할 부분
    console.log("Submitted:", { boardId, title, content });

    // 예시로 뒤로가기
    history.goBack();
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <div className="flex-1"></div>
            <Link
              to="/drink-recommendation"
              style={{ color: "white", textDecoration: "none" }}
            >
              <span className="font-bold">오늘의 술 추천</span>
            </Link>
            <div className="flex-1"></div>
          </Toolbar>
        </AppBar>
        <Toolbar />

        <section className="mt-8 text-xl">
          <div className="container mx-auto px-3">
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="body" />
              <div className="table-box-type">
                <table className="table table-lg">
                  <tbody>
                    <tr>
                      <th>게시판</th>
                      <td>
                        <div className="flex">
                          <div>
                            <label className="flex items-center">
                              <input
                                className="radio radio-primary radio-sm"
                                name="boardId"
                                type="radio"
                                value="1"
                                checked={boardId === 1}
                                onChange={() => setBoardId(1)}
                              />
                              &nbsp;&nbsp;&nbsp;공지사항
                            </label>
                          </div>
                          <div className="w-20"></div>
                          <div>
                            <label className="flex items-center">
                              <input
                                className="radio radio-primary radio-sm"
                                name="boardId"
                                type="radio"
                                value="2"
                                checked={boardId === 2}
                                onChange={() => setBoardId(2)}
                              />
                              &nbsp;&nbsp;&nbsp;자유
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>제목</th>
                      <td>
                        <input
                          className="input input-bordered input-primary w-9/12"
                          name="title"
                          type="text"
                          placeholder="제목을 입력해주세요"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>내용</th>
                      <td>
                        <div className="toast-ui-editor">
                          {/* Toast UI Editor 컴포넌트를 여기에 추가 */}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center" colSpan="2">
                        <button className="btn-text-color btn btn-wide btn-outline">
                          작성
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </form>

            <div className="btns mt-2">
              <button className="btn-text-color btn btn-outline btn-sm" onClick={() => history.goBack()}>
                뒤로가기
              </button>
            </div>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
};

export default WritePage;
