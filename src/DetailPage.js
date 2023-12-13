import React from "react";
import { AppBar, Toolbar, createTheme, ThemeProvider } from "@mui/material";
import { Link, useParams } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

const DetailPage = (props) => {
  const { index } = props.match.params;
  const { id } = useParams();

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
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu
                  pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
                </p>
                {/* 필요에 따라 더 많은 콘텐츠 추가 */}
              </article>
            </div>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
};

export default DetailPage;
