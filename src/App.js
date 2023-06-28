import moment from "moment";
import { useState, useQuery } from 'react';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DiaryCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState({});

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDiaryEntry = (event) => {
    const { value } = event.target;
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD")]: value,
    }));
  };

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD")]: value,
    }));
  };

  const tileContent = ({ date }) => {
    const entry = diaryEntries[moment(date).format("YYYY-MM-DD")];
    if (entry) {
      return <div className={`dot ${entry}`}></div>;
    }
    return null;
  };

  return (
    <div>
      <h1>Diary Calendar</h1>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={tileContent}
      />
      {selectedDate && (
        <div>
          <h2>{moment(selectedDate).format("YYYY-MM-DD")}</h2>
          <textarea
            value={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] || ""}
            onChange={handleDiaryEntry}
            rows={5}
          />
          <div>
            <label>
              <input
                type="radio"
                name="drink"
                value="wine"
                checked={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] === "wine"}
                onChange={handleRadioChange}
              />
              와인
            </label>
            <label>
              <input
                type="radio"
                name="drink"
                value="soju"
                checked={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] === "soju"}
                onChange={handleRadioChange}
              />
              소주
            </label>
            <label>
              <input
                type="radio"
                name="drink"
                value="beer"
                checked={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] === "beer"}
                onChange={handleRadioChange}
              />
              맥주
            </label>
            <label>
              <input
                type="radio"
                name="drink"
                value="makgeolli"
                checked={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] === "makgeolli"}
                onChange={handleRadioChange}
              />
              막걸리
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryCalendar;