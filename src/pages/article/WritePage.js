import React, { useState } from "react";
import { AppBar, Toolbar, createTheme, ThemeProvider } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { Editor, EditorState, convertToRaw } from "draft-js";
import { Editor as WysiwygEditor } from "react-draft-wysiwyg";
import axios from 'axios';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";

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
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const contentState = editorState.getCurrentContent();
    const body = JSON.stringify(convertToRaw(contentState)); 
    const memberId = 1; // 멤버 ID를 1로 설정

    try {
      // Spring Boot API 호출
      const response = await axios.post('http://localhost:8080/usr/article/doWrite', {
        title,
        body,
        boardId,
        memberId, // 요청에 멤버 ID 추가
      });
  

      console.log("Submitted:", response.data);
      history.goBack();
    } catch (error) {
      console.error('Error submitting:', error);
    };
  };
  const handleImageUpload = (file) => {
    // 이미지 업로드 로직 생략
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

        <section className="text-xl mt-20">
          <div className="container mx-auto px-3 text-center">
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="body" />
              <div className="table-box-type text-center">
                <table className="table table-lg" style={{ margin: "0 auto" }}>
                  <tbody>
                    <tr>
                      <th>게시판</th>
                      <td>
                        <div className="flex">
                          <input
                            type="text"
                            name="boardId"
                            value={boardId}
                            onChange={(e) => setBoardId(e.target.value)}
                          />
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
                        <WysiwygEditor
                          editorState={editorState}
                          onEditorStateChange={(newEditorState) => setEditorState(newEditorState)}
                          wrapperClassName="editor-wrapper"
                          editorClassName="editor-main"
                          toolbarClassName="editor-toolbar"
                          toolbar={{
                            image: { uploadCallback: handleImageUpload, alt: { present: true, mandatory: true } },
                          }}
                          editorStyle={{ backgroundColor: "white" }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            
            
            <div className="btns mt-4">
              <button className="btn btn-primary" type="submit">
                작성
              </button>
              <button type="button" className="btn btn-outline btn-sm ml-4" onClick={() => history.goBack()}>
                뒤로가기
              </button>
            </div>
            </form>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
};

export default WritePage;
