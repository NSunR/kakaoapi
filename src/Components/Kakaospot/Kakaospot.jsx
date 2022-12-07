import axios from "axios";
import React, { useEffect, useState } from "react";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";
import { trainApi } from "../../Redux/Modules/Instance";

const Kakaospot = () => {
  const { kakao } = window;
  const [state, setState] = useState({
    addr: "",
    center: {
      lat: 33.450701,
      lng: 126.570667, //지도상의 중심좌표
    },
    errMsg: null,
    isLoading: true,
  });

  //아래 useEffect가 함수 보다 위에 찍혀야 더 정확한 위치 추출

  // 현재 경도 위도 지도에 표시하는 로직 함수-아래 useEffect로 지도에 표시.
  useEffect(() => {
    getAddr(state.center.lat, state.center.lng);
  });
  const getAddr = (lat, lng, arr) => {
    const geocoder = new kakao.maps.services.Geocoder(); //좌표-주소변환 함수

    const coord = new kakao.maps.LatLng(lat, lng); //마커가 표시될 위치를 geolocation 좌표로 생성.

    const callback = async (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const arr = { ...result };
        const _arr = arr[0].road_address.building_name;
        console.log(arr); //현위치의 주소, 상세 건물 이름
        console.log(_arr); //현위치 주소의 상세 위치: "js아파트 111동"
        // try {//백으로 현위치 정보보내기
        //   const { data } = await trainApi.postMapInfo(_arr);
        //   console.log(data);
        // } catch (err) {
        //   console.log(err);
        // }
      }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  };

  // console.log(getAddr);
  console.log(state.center.lat, state.center.lng); //현재 위치 위도 경도
  //현재 위치찎어주기

  // 현재 접속 위치 포인트 잡아주기. 찍는 건 위의 함수가 표시해줄 거임.
  // 현 위치에서 반경 30m까지 내 위치가 표시 될 수 있는 오차 존재.
  useEffect(() => {
    // GeoLocation을 이용해서 접속 위치를 얻어오기
    //위도, 경도를 받아오기 위해 navigator.geolcation을 사용.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
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
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      setState((prev) => ({
        ...prev,
        errMsg: "현재 위치를 알 수 없어서 기본 위치로 이동합니다",
        isLoading: false,
      }));
    }
  }, []);
  //===================================================================
  //내 위치 중심좌표 함 찍어보기 -위치 정보 테스트
  // const spotInfow = state.center;
  // console.log(spotInfow);
  const geocoder = new kakao.maps.services.Geocoder(); //좌표-주소변환 함수

  const coord = new kakao.maps.LatLng(state.center.lat, state.center.lng); //마커가 표시될 위치를 geolocation 좌표로 생성.

  console.log("geocoder 정보", geocoder.coord2Address);
  console.log("coord정보", coord);

  return (
    <div>
      <Map // 지도를 표시할 Container
        center={state.center}
        style={{
          // 지도의 크기
          width: "340px",
          height: "260px",
          margin: "0px auto",
          border: "1px solid pink",
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
            {/* <p>
                {state.errMsg ? state.errMsg : "현위치입니다"}
              </p> */}
            {/* </div> */}
          </MapMarker>
        )}
      </Map>
    </div>
  );
};

export default Kakaospot;

const ThisMap = styled.div`
  border: 1px solid pink;
  color: #000;
`;
