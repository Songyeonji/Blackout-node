import { useState } from 'react';
import { AppBar, Toolbar } from "@mui/material";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './index.css';
import moment from 'moment';

function App() {
  const curDate = new Date(); // 현재 날짜
  const [value, onChange] = useState(curDate); // 클릭한 날짜 (초기값으로 현재 날짜 넣어줌)
  const activeDate = moment(value).format('YYYY-MM-DD');
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <div className="flex-1"></div>
          <span className="font-bold">Black out</span>
          <div className="flex-1"></div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div className='app'>
      <h1 className="mr-auto">React Calendar with Range</h1>
      <div className='calendar-container'>
        <Calendar
        onChange={onChange}
          value={value}
          locale="en"
          formatDay={(locale, date) => moment(date).format('D')}
         // tileContent={addContent}
          showNeighboringMonth={false}
          // onActiveStartDateChange={({ activeStartDate }) =>
          //   getActiveMonth(activeStartDate)}
        />
      </div>
        <p className='mr-auto'>
          <span className='bold'>Default selected date:</span>{' '}
          {value.toDateString()}
        </p>
      </div>
    </>
  );
}


export default App;