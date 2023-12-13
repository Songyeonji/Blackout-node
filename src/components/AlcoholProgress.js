import React from "react";
import { LinearProgress } from "@mui/material";

const AlcoholProgress = ({ calculateDrinkRatio, calculateTotalDrinkRatio }) => {
  return (
    <div>
      {/* 와인 프로그레스 바 */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
        <div style={{ width: "100px", marginRight: "10px" }}>
          <LinearProgress
            variant="determinate"
            value={calculateDrinkRatio("wine")}
            style={{ backgroundColor: "#D5A9E3", height: "15px", borderRadius: "10px" }}
          />
        </div>
        <span>{`${calculateDrinkRatio("wine").toFixed(0)}% 와인`}</span>
      </div>
      {/* 소주 프로그레스 바 */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
        <div style={{ width: "100px", marginRight: "10px" }}>
          <LinearProgress
            variant="determinate"
            value={calculateDrinkRatio("soju")}
            style={{ backgroundColor: "#98EECC", height: "15px", borderRadius: "10px" }}
          />
        </div>
        <span>{`${calculateDrinkRatio("soju").toFixed(0)}% 소주`}</span>
      </div>
      {/* 맥주 프로그레스 바 */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
        <div style={{ width: "100px", marginRight: "10px" }}>
          <LinearProgress
            variant="determinate"
            value={calculateDrinkRatio("beer")}
            style={{ backgroundColor: "#AED6F1", height: "15px", borderRadius: "10px" }}
          />
        </div>
        <span>{`${calculateDrinkRatio("beer").toFixed(0)}% 맥주`}</span>
      </div>
      {/* 막걸리 프로그레스 바 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: "100px", marginRight: "10px" }}>
          <LinearProgress
            variant="determinate"
            value={calculateDrinkRatio("makgeolli")}
            style={{ backgroundColor: "#F9E79F", height: "15px", borderRadius: "10px" }}
          />
        </div>
        <span>{`${calculateDrinkRatio("makgeolli").toFixed(0)}% 막걸리`}</span>
      </div>
      {/* 총 음주량 프로그레스 바 */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <div style={{ width: "100%", marginRight: "10px" }}>
          <LinearProgress
            variant="determinate"
            value={calculateTotalDrinkRatio()}
            style={{ backgroundColor: "#B799FF", height: "15px", borderRadius: "10px" }}
          />
        </div>
        <span>{`${calculateTotalDrinkRatio().toFixed(0)}% 총 음주량`}</span>
      </div>
    </div>
  );
};

export default AlcoholProgress;
