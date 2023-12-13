import React from "react";

const WeatherInfo = ({ weather }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
      <div>
        <strong>도시:</strong> {weather.name}
      </div>
      {weather.main && (
        <div>
          <strong>기온:</strong> {weather.main.temp}°C
        </div>
      )}
      {weather.weather && (
        <div>
          <strong>날씨:</strong> {weather.weather[0].description}
        </div>
      )}
    </div>
  );
};

export default WeatherInfo;