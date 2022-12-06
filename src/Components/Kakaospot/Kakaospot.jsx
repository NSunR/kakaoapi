import React, { useEffect, useState } from "react";
const { kakao } = window;
// import {
//   Map,
//   ZoomControl,
//   MapMarker,
//   CustomOverlayMap,
// } from "react-kakao-maps-sdk";

const Kakaospot = () => {
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(37.365264512305174, 127.10676860117488),
      level: 3,
    };

    const map = new kakao.maps.Map(container, options);
    const markerPosition = new kakao.maps.LatLng(
      37.365264512305174,
      127.10676860117488
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);
  }, []);

  const [state, setState] = useState({
    center: {
      lat: 33.450701,
      lng: 126.570667,
    },
    errMsg: null,
    isLoading: true,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
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
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false,
      }));
    }
  }, []);

  return (
    <div>
      <div id="map" style={{ width: "500px", height: "400px" }}></div>
      <div // 지도를 표시할 Container
        id="map"
        center={state.center}
        style={{
          // 지도의 크기
          width: "500px",
          height: "400px",
        }}
        level={3} // 지도의 확대 레벨
      >
        {!state.isLoading && (
          <div position={state.center}>
            <div style={{ padding: "5px", color: "#000" }}>
              {state.errMsg ? state.errMsg : "여기에 계신가요?!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kakaospot;
