import React, { useState } from "react";
import moment from "moment";
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

  const tileContent = ({ date }) => {
    const entry = diaryEntries[moment(date).format("YYYY-MM-DD")];
    if (entry) {
      return <div className="dot"></div>;
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
        </div>
      )}
    </div>
  );
};

export default DiaryCalendar;