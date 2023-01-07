//위치정보를 가져와서 좌표를 찍어주는 로직
import { getDistance } from "geolib";
import React, { useEffect, useRef, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";

//{ searchPlace, currSpot, searchWK, setSearchWK }
const MapContainer = ({ searchPlace }) => {
  //인풋값(출발/타실 역이름 )
  const [searchWK, setSearchWK] = useState({
    searchW: 0,
    searchK: 0,
  });

  //kakao를 인식하게 하기위해 선언해줌. 함수형에선 인식 잘 못 한다고함.
  const { kakao } = window;

  //현재 위치(페이지 떴을 때) 불러오기 위한 초기값설정
  const [state, setState] = useState({
    center: {
      lat: 0, //지도상의 내 위치의 위도
      // lat: 33.450701, //지도상의 내 위치의 위도
      lng: 0, //지도상의 내 위치의 경도
      // lng: 126.570667, //지도상의 내 위치의 경도
    },
    errMsg: null,
    isLoading: true,
  });

  //현재 위치 따로 저장할 위도, 경도값
  const [currSpot, setCurrSpot] = useState({
    currW: 0,
    currK: 0,
  });

  console.log("현재값 좌표", currSpot);
  //currSpot.currW(위도), currSpot.currK(경도)
  console.log("인풋값 좌표", searchWK);
  //searchWk.searchW(위도) , searchWK.searchK(경도)

  // 현재 경도 위도 지도에 표시하기 위한 함수-아래 useEffect로 지도에 표시.
  useEffect(() => {
    getAddr(state.center.lat, state.center.lng);
  }, [state.center.lat, state.center.lng]);

  const getAddr = (lat, lng) => {
    const geocoder = new kakao.maps.services.Geocoder(); //좌표-주소변환 함수
    //////서버에 보내줄 정보 1.현재 위치 위경도.///////
    const coord = new kakao.maps.LatLng(lat, lng); //마커가 표시될 내 위치를 geolocation 좌표로 생성.
    console.log(coord);
    // console.log(geocoder);

    //현재위치값 불러오는 함수
    const geolocationView = () => {
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
        const xSpot = result;
        // console.log(xSpot);
        const arr = { ...result };
        const _arr = arr[0].road_address.building_name;
        console.log(arr);
        // console.log("-----현재 위치의 주소: ", arr); //현위치의 지역주소(도,시,구,동,로), 상세 주소(건물 이름
        // console.log("-----현재 위치의 상세주소: ", _arr); //현위치 주소의 상세 위치: "js아파트 111동"

        const currentSpotW = state.center.lat; //지도상의 내 위치 위도
        const currnetSpotK = state.center.lng; //지도상의 내 위치 경도
        console.log(currentSpotW);
        console.log(currnetSpotK);
        setCurrSpot({
          currW: state.center.lat, //위도
          currK: state.center.lng, //경도
        });
      }
    };

    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  };
  // };

  //////
  //////
  console.log("인풋값 좌표", searchWK);
  // const [Data, setData] = useState({});
  useEffect(() => {
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    const container = document.getElementById("myMap");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchPlace, placesSearchCB);
    console.log(searchPlace);

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();
        console.log(data); //검색한 데이터가
        console.log(bounds);
        for (let i = 0; i < data.length; i++) {
          // displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        // console.log("bounds 위도 경도 생성", bounds);
        // map.setBounds(bounds);
      }
      setSearchWK({ searchW: Number(data[0].y), searchK: Number(data[0].x) });
    }
  }, [searchPlace]);

  console.log("현재값 좌표", currSpot);
  //currSpot.currW, currSpot.currK
  console.log("인풋값 좌표", searchWK);
  //searchWk.searchW , searchWK.searchK

  //현재 위치값~ 인풋 출발역 값 좌표 두 지점 간의 거리
  //계산 라이브러리 geolib => getDistance() 함수
  //getDistance(위도, 경도, )
  const WKdata = getDistance(
    {
      latitude: currSpot.currW,
      longitude: currSpot.currK,
    },
    {
      latitude: searchWK.searchW,
      longitude: searchWK.searchK,
    }
  );
  console.log(WKdata);

  return (
    <div>
      <div
        id="myMap"
        style={{
          width: "500px",
          height: "500px",
          display: "none",
        }}
      ></div>
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
              // display: "none",
            }}
            level={3} // 지도의 확대 레벨
          >
            {!state.isLoading && (
              // MapMapker는 kakao 라이브러리, 마커를 생성.
              <MapMarker
                position={state.center}
                content="현위치"
                // style={{
                //   // ,
                // }}
              >
                <div
                  style={{
                    // border: "1px solid green",
                    color: "pink",
                  }}
                >
                  {state.errMsg ? state.errMsg : "현위치입니다"}
                </div>
              </MapMarker>
            )}
          </Map>
        </div>
        <>{/* <Main /> */}</>
        {/* <MapContainer
          // currSpot={state}
          // searchWK={searchWK}
          // setSearchWK={setSearchWK}
          className="hidden"
        /> */}
      </div>
    </div>
  );
};

export default MapContainer;
