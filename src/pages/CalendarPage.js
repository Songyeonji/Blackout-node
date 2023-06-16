import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './index.css';
import moment from 'moment';


export default function CalendarPage() {
const [value, onChange] = useState<Date>(new Date());
const day = moment(value).format('YYYY-MM-DD');
const currDate = new Date();
const currDateTime = moment(currDate).format('MM-DD');

const mark = ['2023-06-02', '2023-06-22', '2023-06-10'];

return (
  <div className='maincalendar'>
    <Calendar
      onChange={onChange}
      value={value}
      locale="ko-KO" // 한글버전
      formatDay={(locale, date) => moment(date).format('D')} // '일' 표시 x
      tileDisabled={({ date, view }) =>
        moment(date).format('MM-DD') < currDateTime
	      }
      tileContent={({ date, view }) => {
      // 날짜 타일에 컨텐츠 추가하기 (html 태그)
      // 추가할 html 태그를 변수 초기화
      const html = [];
      // 현재 날짜가 post 작성한 날짜 배열(mark)에 있다면, dot div 추가
        if (mark.find((x) => x === moment(date).format('YYYY-MM-DD'))) {
          html.push(<div className="dot"></div>);
        }
        // 다른 조건을 주어서 html.push 에 추가적인 html 태그를 적용할 수 있음.
        return (
        <>
        <div className="flex justify-center items-center absoluteDiv">
        	{html}
        </div>
        </>
        );
    }}
    />
  </div>
  )
}



/*<div className='app'>
<h1 className='text-center'>React Calendar with Range</h1>
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
  <p className='text-center'>
    <span className='bold'>Default selected date:</span>{' '}
    {value.toDateString()}
  </p>
</div>*/