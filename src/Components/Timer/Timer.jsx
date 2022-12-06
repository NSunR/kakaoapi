import React from "react";

//타이머(Timer) 구현할 컴포넌트 내용 생성
//props로 mm은 분(minutes), ss는 초(seconds) 받아오기.
const Timer = ({ mm, ss }) => {
  const [minutes, setMinutes] = useState(parseInt(mm));
  const [seconds, setSeconds] = useState(parseInt(ss));
  return (
    <div>
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

export default Timer;
