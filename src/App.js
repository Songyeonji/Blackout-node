import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './index.css';
import moment from 'moment';

function App() {
  const curDate = new Date(); // 현재 날짜
  const [value, onChange] = useState(curDate); // 클릭한 날짜 (초기값으로 현재 날짜 넣어줌)
  const activeDate = moment(value).format('YYYY-MM-DD'); // 클릭한 날짜 (년-월-일))

  return (
    <div className='app'>
      <h1 className='text-center'>React Calendar with Range</h1>
      <div className='calendar-container'>
        <Calendar
          onChange={onChange}
          value={value}
          selectRange={true}
          locale="en"
          next2Label={null}
          prev2Label={null}
          formatDay={(locale, date) => moment(date).format('D')}
         // tileContent={addContent}
          showNeighboringMonth={false}
          // onActiveStartDateChange={({ activeStartDate }) =>
          //   getActiveMonth(activeStartDate)}
        />
      </div>
      {value.length > 0 ? (
        <p className='text-center'>
          <span className='bold'>Start:</span>{' '}
          {value[0].toDateString()}
          &nbsp;|&nbsp;
          <span className='bold'>End:</span> {value[1].toDateString()}
        </p>
      ) : (
        <p className='text-center'>
          <span className='bold'>Default selected date:</span>{' '}
          {value.toDateString()}
        </p>
      )}
    </div>
  );
}

export default App;