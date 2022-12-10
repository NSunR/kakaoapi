//위치정보를 가져와서 좌표를 찍어주는 로직
import { data } from "autoprefixer";
import React, { useEffect, useState } from "react";

const { kakao } = window;

const MapContainer = ({ searchPlace }) => {
  const [Data, setData] = useState({});
  useEffect(() => {
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    const container = document.getElementById("myMap");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchPlace, placesSearchCB);

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();
        console.log(data); //검색한 데이터가
        console.log(bounds);
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        console.log("bounds 위도 경도 생성", bounds);
        map.setBounds(bounds);
      }
      console.log(data);
      setData(data);
    }
    const 데이터값 = data;
    console.log(Data);

    function displayMarker(place) {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "click", function () {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent(
          '<div style="padding:5px;font-size:12px;">' +
            place.place_name +
            "</div>"
        );
        infowindow.open(map, marker);
      });
    }
  }, [searchPlace]);

  return (
    <div
      id="myMap"
      style={{
        width: "500px",
        height: "500px",
        display: "none",
      }}
    ></div>
  );
};

export default MapContainer;
