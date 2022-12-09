import React, { useEffect } from "react";
import { useMemo } from "react";

const { kakao } = window;

const MapContainer = ({ searchPlace, setPlace, onChange01 }) => {
  useEffect(() => {
    console.log(1);
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    const container = document.getElementById("myMap");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    const ps = new kakao.maps.services.Places();
    console.log(0);
    ps.keywordSearch(onChange01, placesSearchCB);

    console.log("searchPlace console", 2);
    console.log(searchPlace); //키워드로 장소검색하기로
    //굳이 마운트 될 때가 아니라

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();
        console.log(bounds);

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        console.log(data);

        map.setBounds(bounds);
      }
    }
    console.log(3);
    const displayMarker = (place) => {
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
    };
  }, [searchPlace, setPlace, onChange01]);

  return (
    <div
      id="myMap"
      style={{
        width: "500px",
        height: "500px",
        // display: "none",
      }}
    ></div>
  );
};

export default MapContainer;
