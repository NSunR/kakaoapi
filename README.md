# 챕터 6

## 9기 실전프로젝트, 항해 99

### 프론트끼리 같이 해보자 했지만 바쁘신 것 같아 따로 구현해봤다. 리더분이 한 번 해보시겠나해서 해본 것도 있고..

### 개발한 것 :
- 목적 : 현재 위치 좌표, 인풋값에 입력되는 동시에 입력된 해당 지역 좌표 가져와서 거리 계산해서 지하철역과 가까이 있는 지 알아보기 위함.
- 사용 언어와 라이브러리 및 프레임워크 : javasrcript, React, 카카오 api, geolib
1. 현재 위치 - 지도에 표기, 좌표값 가져오기
2. 인풋값에 입력되는 동시에 지역 위치 가져오기

### 구현 순서
1. 현재 위치 지도에 표시하기, 좌표 console로 찍기, 해당 위치 북마크 띄우기
2. 검색어 javascript 코드에 직접 적을 시 해당 위치 지도에 표시
3. 검색버튼 추가해서 인풋에 입력된 지역 검색해서 찾기
4. 검색버튼 없이 인풋에 입력되는 동시에 지역 좌표가져오기
5. 현재 위치와 인풋값에 적힌 위치 좌표 동시에 가져오기
6. 해당 좌표 거리 간의 오차범위 계산 
   (Feat. 좌표거리 계산(직선거리 반경 m) 라이브러리 geolib 이용)
