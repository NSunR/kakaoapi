import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import useInput from "../../MyTools/Hooks/UseInput";

import MapContainer from "./MapContainer";

const TrainMaching = () => {
  const [InputText, setInputText] = useInput("");
  const [InputText02, setInputText02] = useInput("");
  const [Place, setPlace] = useState("");

  const onChange = (e) => {
    setInputText(e.target.value);
  };

  const onChange02 = (e) => {
    setInputText02(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(InputText);
    setInputText("");
  };

  return (
    <>
      <form className="inputForm" onSubmit={handleSubmit}>
        <input
          placeholder="타실 역을 입력하세요"
          onChange={onChange}
          value={InputText}
        />
        <input
          placeholder="내리실 역을 입력하세요"
          onChange={onChange02}
          value={InputText02}
        />
        <button type="submit">매칭</button>
      </form>
      <MapContainer
        searchPlace={Place}
        setPlace={setPlace}
        onChange01={onChange}
      />
    </>
  );
};

export default TrainMaching;

// 1. 강남역(좌표o)
// 2. ㅅ
// 1. 강남역(좌표o)
// 2. 서

// 강남역
