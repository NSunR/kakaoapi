//검색할 인풋창이 있는 로직 => MapContainer 지도 위치 불러옴
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useInput from "../../MyTools/Hooks/UseInput";

import MapContainer from "./MapContainer";
import Kakaospot from "./Kakaospot";

const TrainMaching = () => {
  const { kakao } = window;
  const [InputText, setInputText] = useInput("");
  const [InputText02, setInputText02] = useInput("");
  const [Place, setPlace] = useState("");
  const [Info, setInfo, infonChangeValue, InfoReset] = useInput({
    station: "",
  });
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();

  const onChange = (e) => {
    e.preventDefault();
    setInputText(e.target.value);
    // setPlace(e.target.value);
    //////
    if (!map) return;
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(InputText, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();
        let markers = [];
        console.log(data);
        console.log(bounds);
        console.log(markers);
        for (var i = 0; i < data.length; i++) {
          // @ts-ignore
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          });
          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        setMarkers(markers);

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }
    });

    /////
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
        {/* <button type="submit" className="border ">
          검색
        </button> */}
        <button type="submit" className="border">
          본래는 검색
        </button>
        <button type="submit" className="border">
          매칭
        </button>
      </form>
      <MapContainer searchPlace={InputText} />
      <Kakaospot />
    </>
  );
};

export default TrainMaching;

// 1. 강남역(좌표o)
// 2. ㅅ
// 1. 강남역(좌표o)
// 2. 서

// 강남역
