import React, { useState, useContext } from "react";
import { createTheme, ThemeProvider, Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";
import { useHistory } from "react-router-dom";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
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

const WritePage = () => {
  const [boardId, setBoardId] = useState(1);// 게시판 ID 상태
  const [title, setTitle] = useState("");// 제목 상태
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const history = useHistory();// 히스토리 객체
  const [selectedFile, setSelectedFile] = useState(null);//파일 업로드 객체

  const onEditorStateChange = (newState) => {
    setEditorState(newState);// 에디터 상태 업데이트
  };

  const editorStyle = {
    backgroundColor: 'white', // 하얀 배경 적용
    height: '300px',
    padding: '5px',
    border: '1px solid #ddd',
  };


   // 파일 선택 핸들러
   const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // 파일 업로드 핸들러
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8081/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File Uploaded Successfully:', response.data);
      // 업로드 후 작업 (예: 업로드된 이미지 URL을 상태에 저장)
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  
  // 로그인된 사용자의 정보를 가져오는 함수
  const getLoggedUser = async () => {
  try {
    const response = await axios.get('http://localhost:8081/usr/member/getLoggedUser', { withCredentials: true });
    return response.data; // 로그인된 사용자의 정보 반환
  } catch (error) {
    console.error('Error fetching logged user:', error);
    return null;
  }
  };
    // 폼 제출 처리
  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId  = await getLoggedUser();
    if (!userId ) {
      console.error('User is not logged in');
      return;
    }
  
    const contentState = editorState.getCurrentContent();
    const bodyText = contentState.getPlainText(); // 텍스트 내용 추출
    const rawContent = convertToRaw(contentState); // 에디터 내용을 원시 형식으로 변환
    const imageUrls = rawContent.blocks
      .filter(block => block.type === 'atomic') // 이미지 블록 필터링
      .map(block => block.data.src);

      console.log("title:", title);
      console.log("bodyText:", bodyText);
      console.log("imageUrls:", imageUrls);
      console.log("boardId:", boardId);
      console.log("memberId:", sessionStorage.getItem('userId'));

      try {
        await axios.post('http://localhost:8081/usr/article/doWrite', {
          title,
          body: bodyText,
          imageUrls,
          boardId,
          memberId: userId.id, // 여기서 userId를 사용
        }, {
          withCredentials: true//브라우저가 다른 도메인으로의 HTTP 요청 시 쿠키 및 인증 정보를 함께 전송할 수 있도록 허용하는 옵션
        });
        history.goBack();
      } catch (error) {
        console.error('Error submitting:', error);
      }
    }

// 이미지 업로드 콜백 함수
function uploadImageCallBack(file) {
  return new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/path-to-upload-image'); // 이미지를 업로드할 서버의 엔드포인트
      xhr.setRequestHeader('Authorization', 'Client-ID XXXXX'); // 필요한 경우 인증 헤더 설정
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        resolve({ data: { link: response.url } }); // 서버에서 받은 이미지 URL 사용
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    }
  );
}

  return (
    <ThemeProvider theme={theme}>
      <div>
        <NavigationBar />

        <section className="text-xl mt-40">
          <div className="container mx-auto px-3 text-center">
            <form onSubmit={handleSubmit}>
              {/* Form fields for title and boardId */}
              <div className="table-box-type text-center">
                <table className="table table-lg" style={{ margin: "0 auto" }}>
                  <tbody>
                    <tr>
                      <th style={{ padding: "10px" }}>게시판</th>
                      <td style={{ padding: "10px" }}>
                        <FormControl>
                          <RadioGroup row value={boardId} onChange={(e) => setBoardId(e.target.value)}>
                            <FormControlLabel value="1" control={<Radio />} label={<><FaMapMarkedAlt /> 맛집</>} />
                            <FormControlLabel value="2" control={<Radio />} label={<><FaWineBottle /> 술</>} />
                            <FormControlLabel value="3" control={<Radio />} label={<><FaUtensils /> 안주</>} />
                          </RadioGroup>
                        </FormControl>
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
                         <Editor
                          editorState={editorState}
                          onEditorStateChange={onEditorStateChange}
                          wrapperClassName="editor-wrapper"
                          editorClassName="editor-main"
                          toolbarClassName="editor-toolbar"
                          editorStyle={editorStyle} // 인라인 스타일 적용
                          toolbar={{
                            image: { uploadCallback: uploadImageCallBack, previewImage: true, alt: { present: true, mandatory: true } },
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <input type="file" onChange={handleFileChange} />
               
              </div>
              
              <div className="btns mt-4" style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <button className="btn btn-primary" type="submit">작성</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => history.goBack()}>뒤로가기</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
};

export default WritePage;
