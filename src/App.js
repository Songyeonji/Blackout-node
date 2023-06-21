import { useState, useQuery } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './index.css';
import moment from 'moment';
import { experimental_extendTheme } from '@mui/material';


export default function CalendarPage() {
  const currDate = new Date(); // 현재 날짜
  

const [value, onChange] = useState(currDate);
const day = moment(value).format('YYYY-MM-DD');
const currDateTime = moment(currDate).format('MM-DD');


const mark = [
  '2023-06-10',
  '2023-06-21',
  '2023-06-02',
  '2023-06-14',
  '2023-06-27',
  '2023-06-27',
];

const addContent = ({ date, view }) => {
  // 해당 날짜(하루)에 추가할 컨텐츠의 배열
  const contents = [];

  // date(각 날짜)가  리스트의 날짜와 일치하면 해당 컨텐츠(이모티콘) 추가
  if (mark.find((day) => day === moment(date).format('YYYY-MM-DD'))) {
    contents.push(
      <>
        {/* <div className="dot"></div> */}
        
        <div key={day} className="dot">
        </div>
        
      </>
    );
  }
  return <div >{contents}</div> // 각 날짜마다 해당 요소가 들어감
};



return (
  <div className='maincalendar'>
    <Calendar
      onChange={onChange}
      value={value}
      locale="en" 
      formatDay={(locale, date) => moment(date).format('D')} // '일' 표시 x
      tileDisabled={({ date, view }) =>
        moment(date).format('MM-DD') < currDateTime
	      }
      tileContent={addContent}
    />
  </div>
  )
}

