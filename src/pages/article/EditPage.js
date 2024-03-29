// EditPage.js
import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider , Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { Link, useHistory, useParams } from "react-router-dom";
import { Editor, EditorState, ContentState , convertFromRaw } from "draft-js";
import { Editor as WysiwygEditor } from "react-draft-wysiwyg";
import axios from 'axios';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import NavigationBar from "../../components/NavigationBar";
import { FaMapMarkedAlt, FaWineBottle, FaUtensils } from "react-icons/fa";


const theme = createTheme({
    palette: {
      primary: {
        main: "#6f48eb", // 보라색
      },
    },
  });


  const EditPage = () => {
    const { id } = useParams(); // URL에서 게시글 ID 추출
    const [boardId, setBoardId] = useState(1); // 게시판 ID 상태
    const [title, setTitle] = useState(""); // 제목 상태
    const [editorState, setEditorState] = useState(EditorState.createEmpty()); // 에디터 상태
    const history = useHistory(); // 히스토리 객체
    
    
    useEffect(() => {
      // 게시글 정보 가져오기
      axios.get(`http://localhost:8081/usr/article/getArticle?id=${id}`)
        .then(response => {
          const articleData = response.data;
          setTitle(articleData.title);
          setBoardId(articleData.boardId.toString()); // boardId를 문자열로 변환
          const content = EditorState.createWithContent(ContentState.createFromText(articleData.body));
          setEditorState(content);
        })
        .catch(error => console.error('Error fetching article:', error));
    }, [id]);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const bodyText = editorState.getCurrentContent().getPlainText();
    
      // 데이터 로그 확인
      console.log("Sending PUT request with data:", { title, body: bodyText, boardId });
    
      try {
        const response = await axios.put(`http://localhost:8081/usr/article/doModify?id=${id}`, {
          title,
          body: bodyText,
          boardId
        });
        //업데이트 확인로그
        console.log("Update response:", response);
        history.goBack();//전으로 돌아가기
        //에러날 경우
      } catch (error) {
        console.error('Error updating article:', error);
      }
    };

    //이미지 업로드 처리
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post('http://localhost:8080/usr/article/uploadImage', formData);
      return { data: { link: response.data.imageUrl } };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { data: { link: null } };
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <div>
      <NavigationBar /> 
        <section className="text-xl mt-20">
            <div className="container mx-auto px-3 text-center">
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="body" />
              <div className="table-box-type text-center">
                <table className="table table-lg" style={{ margin: "0 auto" }}>
                  <tbody>
                    <tr>
                      <th style={{ padding: "10px" }}>게시판</th>
                      <td style={{ padding: "10px" }}>
                        <div className="flex">
                        <FormControl>
                            <RadioGroup row value={boardId} onChange={(e) => setBoardId(e.target.value)}>
                              <FormControlLabel value="1" control={<Radio />} label={<><FaMapMarkedAlt /> 맛집</>} />
                              <FormControlLabel value="2" control={<Radio />} label={<><FaWineBottle /> 술</>} />
                              <FormControlLabel value="3" control={<Radio />} label={<><FaUtensils /> 안주</>} />
                            </RadioGroup>
                          </FormControl>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th style={{ padding: "10px" }}>제목</th>
                      <td style={{ padding: "10px" }}>
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
                      <th style={{ padding: "10px" }}>내용</th>
                      <td style={{ padding: "10px" }}>
                        <WysiwygEditor
                          editorState={editorState}
                          onEditorStateChange={setEditorState}
                          wrapperClassName="editor-wrapper"
                          editorClassName="editor-main"
                          toolbarClassName="editor-toolbar"
                          toolbar={{
                            image: { uploadCallback: handleImageUpload, alt: { present: true, mandatory: true } },
                          }}
                          editorStyle={{ backgroundColor: "white", height: "300px" }}
                          />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="btns mt-4" style={{ display: "flex", justifyContent: "center", gap: "10px"}}>
                <button className="btn btn-primary" type="submit">
                  수정
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
export default EditPage;
