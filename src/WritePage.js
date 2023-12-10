import React, { useState } from "react";
import { AppBar, Toolbar, createTheme, ThemeProvider } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { Editor, EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor as WysiwygEditor } from "react-draft-wysiwyg";
import draftjsToHtml from "draftjs-to-html";
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const contentState = editorState.getCurrentContent();
    const contentRaw = convertToRaw(contentState);
    const content = JSON.stringify(contentRaw);

    console.log("Submitted:", { boardId, title, content });

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

        <section className="text-xl mt-20">
          <div className="container mx-auto px-3 text-center">
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="body" />
              <div className="table-box-type text-center"> {/* text-center 클래스 추가 */}
                <table className="table table-lg" style={{ margin: "0 auto" }}>
                  <tbody>
                    <tr>
                      <th>게시판</th>
                      <td>
                        <div className="flex">
                          {/* ... (이전 코드 생략) */}
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
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
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