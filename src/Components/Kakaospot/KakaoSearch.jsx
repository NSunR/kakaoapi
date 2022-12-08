import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";
import useInput from "../../MyTools/Hooks/UseInput";

const KakaoSearch = () => {
  const { kakao } = window;
  //검색 장소의 위치 초기값들
  const [state, setState] = useState({
    addr: "",
    center: {
      lat: 33.450701, //지도상의 내 위치의 위도
      lng: 126.570667, //지도상의 내 위치의 경도
    },
    errMsg: null,
    isLoading: true,
  });
  const stationRef = useRef();
  const [name, setName, onChangeValue, reset] = useInput({
    // station: "",
  });
  const [info, setInfo] = useInput();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();

  // useEffect(
  //   () => {

  const onStationHandle = (e) => {
    e.preventDefault();
    if (!map) return;
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(info.station, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();
        let markers = [];
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
  };

  // [map]
  // );
  console.log(markers);
  return (
    <div>
      <Map // 로드뷰를 표시할 Container
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{
          width: "100%",
          height: "350px",
        }}
        level={3}
        onCreate={setMap}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info && info.content === marker.content && (
              <div style={{ color: "#000" }}>{marker.content}</div>
            )}
          </MapMarker>
        ))}
      </Map>
      <div>
        <StationName>
          <form>
            <div>
              <div>
                <label>출발역</label>
                <NameInput
                  type="text"
                  name="station"
                  id="station"
                  value={name.station}
                  onChange={onChangeValue}
                />
              </div>
              <button onClick={(e) => onStationHandle(info.station)}>
                매칭
              </button>
            </div>
          </form>
        </StationName>
      </div>
    </div>
  );
};

export default KakaoSearch;

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
