import axios from "axios";
import React, { useEffect, useState } from "react";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";
import useInput from "../../MyTools/Hooks/UseInput";
import { trainApi } from "../../Redux/Modules/Instance";
//지도 위치 표시되고 주소검색, 검색한 위치값, 내위치값, 위도 경도 차이.
//건물 내에 있을 때 현재 위치에 대한 오차범위는 최소 20m,
//사람이 붐빌 경우 최대 120m 정도 인듯
// 오차범위가 0~120m이내라면 매칭ㄱ
const Kakaospot = () => {
  //kakao를 인식하게 하기위해 선언해줌. 함수형에선 인식 잘 못 한다고함.
  const { kakao } = window;
  //검색 장소의 위치 초기값들

  //현재 위치 불러오기 위한 초기값설정
  const [state, setState] = useState({
    addr: "",
    center: {
      lat: 33.450701, //지도상의 내 위치의 위도
      lng: 126.570667, //지도상의 내 위치의 경도
    },
    errMsg: null,
    isLoading: true,
  });

  // 현재 경도 위도 지도에 표시하기 위한 함수-아래 useEffect로 지도에 표시.
  useEffect(() => {
    getAddr(state.center.lat, state.center.lng);
  }, []);

  const getAddr = (lat, lng) => {
    const geocoder = new kakao.maps.services.Geocoder(); //좌표-주소변환 함수
    //////서버에 보내줄 정보 1.현재 위치 위경도.///////
    const coord = new kakao.maps.LatLng(lat, lng); //마커가 표시될 내 위치를 geolocation 좌표로 생성.
    console.log(coord);

    //현재위치값 불러오는 함수
    const geolocationView = () => {
      // navigator.geolocation.watchPosition(
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setState((prev) => ({
              ...prev,
              center: {
                lat: position.coords.latitude, //위도
                lng: position.coords.longitude, //경도
              },
              isLoading: false,
            }));
          },
          (err) => {
            setState((prev) => ({
              ...prev,
              errMsg: err.message,
              isLoading: false,
            }));
          }
        );
      } else {
        setState((prev) => ({
          ...prev,
          errMsg: "현재 위치를 불러올 수 없습니다...",
          isLoading: false,
        }));
      }
    };
    geolocationView();
    //내 위치
    const callback = async (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const arr = { ...result };
        const _arr = arr[0].road_address.building_name;
        console.log("-----현재 위치의 주소: ", arr); //현위치의 지역주소(도,시,구,동,로), 상세 주소(건물 이름
        console.log("-----현재 위치의 상세주소: ", _arr); //현위치 주소의 상세 위치: "js아파트 111동"
        // try {//백으로 현위치 정보보내기
        //   const { data } = await trainApi.postMapInfo(_arr, arr);
        //   console.log(data);
        // } catch (err) {
        //   console.log(err);
        // }
        const currentSpotW = state.center.lat; //지도상의 내 위치 위도
        const currnetSpotK = state.center.lng; //지도상의 내 위치 경도
        // console.log(SpotW);
        // console.log(SpotK);
      }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  };

  return (
    <div>
      <div>
        <Map // 지도를 표시할 Container , 라이브러리 컴포넌트
          center={state.center}
          style={{
            // 지도의 크기, style 여기서 잡아줌.
            width: "340px",
            height: "260px",
            margin: "0px auto",
            border: "1px solid #71C9DD",
            borderRadius: "20px",
          }}
          level={3} // 지도의 확대 레벨
        >
          {!state.isLoading && (
            // MapMapker는 kakao 라이브러리, 마커를 생성.
            <MapMarker position={state.center} content="현위치">
              {/* <div
              style={{
                // border: "1px solid green",
                color: "pink",
              }}
            > */}
              {/* 
                {state.errMsg ? state.errMsg : "현위치입니다"}
               */}
              {/* </div> */}
            </MapMarker>
          )}
        </Map>
      </div>
    </div>
  );
};

export default Kakaospot;

const StationName = styled.div`
  padding: 10px;
  border: 1px solid #71c9dd;
  color: #000;
`;

const NameInput = styled.input`
  width: 250px;
  height: 40px;

  font-size: 1.2rem;
`;

//=========함수 설명 :
//geolocation (gps)접속위치 가져와줌
// navigator.geolocation - 현재 위치 가져오기, 현재 위치의 위도, 경도를 가져와줌
// getCurrentPosition - 현재 위치찍어주기
// 현재 접속 위치 포인트 잡아주기. 찍는 건 위의 함수가 표시해줄 거임.

//if(navigaor.geolocation) => gps사용할 수 있는 지, getCurrentPosition => 현재위치가져오는함수
//getCurrentPosition(), watchposition() 로 위치지점을 가져올 수 있는데
//watchposition()이 더 정확하다는 의견이 있음.
// console.log(getAddr);

//===================================================================
//내 위치 중심좌표 함 찍어보기 -위치 정보 테스트
// const spotInfow = state.center;
// console.log(spotInfow);
////===================현위치 정보 알고싶으면 여기 해제=========
// const geocoder = new kakao.maps.services.Geocoder(); //좌표-주소변환 함수
// const coord = new kakao.maps.LatLng(state.center.lat, state.center.lng);
//마커가 표시될 위치를 geolocation 좌표로 생성.
// console.log("geocoder 정보", geocoder.coord2Address); //함수종류담김.
// console.log("coord정보", coord); //현재 표시된 위치 위경도.
