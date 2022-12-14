////src/Redux/Modules/Instance.js
import axios from "axios";
import { Cookies, useCookies } from "react-cookie";
import { removeCookie, setCookie } from "../../MyTools/Hooks/MyCookie";

const token = document.cookie.replace("token=", "");
console.log(token);
const cookies = new Cookies();
// const code = new URL(window.location.href).searchParams.get("code");
// console.log("인가코드", code);
//instance 불러 쓸 때 브라우저쪽에 headers 일일이 안 넣어줘도 되지만,
//axios로 따로 써줄 경우는 header 매번 넣어줘야 함.
//인스턴스 - api 전역관리
const hURL = process.env.REACT_APP_TH_HOST;

//일반데이터 Instance
const instance = axios.create({
  baseURL: `${hURL}`,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
//폼데이터 Instance
const instanceF = axios.create({
  baseURL: `${hURL}`,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
});

//폼데이터 api
export const trainApi2 = {
  //signup
  postForm: (payload) => instanceF.post("/user", payload),
  postProficForm: (payload) => instanceF.post("/profile", payload),
  postProfile: (payload) => instanceF.post("/profile", payload),
  // post: (payload) => instance.post("/url", payload),
  // get: () => instance.put("/url"),
  // delete: () => instance.delete("/url"),
};

//일반데이터api
export const trainApi = {
  // getLogin: () => instance.get(`/auth/kakao/callback?code=${code}`),
  postAuthCode: (payload) => instance.post("/auth2/compare", payload),
  postAuthName: (payload) => instance.post("/user/check", payload),
  postAuthPhone: (payload) => instance.post("/auth2/phone", payload),
  postSubSign: (payload) => instance.post("/user/signup", payload),
  postUserId: (payload) => instance.post("/user/checkid", payload),
  postSignIn: (payload) => instance.post("/user/login", payload),
  postMapInfo: (payload) => instance.post("/user/where", payload),

  // post: (payload) => instance.post("/url", payload),
  // get: () => instance.get("/url"),
  // get: () => instance.put("/url"),
  // delete: () => instance.delete("/url"),
};

//인스턴스 사용예제
//ex)
//trainApi2.postForm('/user', payload)
//.then((res) => console.log(res) //response값 처리)
//.catch((err) => console.log(err) //error값 처리)

//=======================

//인터셉터로 갱신된 토큰 교환
instance.interceptors.request.use(
  async (config) => {
    // const token = cookies.get("token");
    // // 요청 성공 직전 수행할 일
    // console.log("일반데이터 인터셉터정보 65줄", config); //여기부터 요청시작
    // console.log("현재장착된 토큰", config.headers);
    // console.log(config.headers.Authorization); //

    // config.headers["Authorization"] = `Bearer ${token}`;
    // console.log("토큰 여기까지 찍혀 62줄", token);

    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
/*
  2. 응답 인터셉터 추가 2개의 콜백 함수를 받음.
*/
instance.interceptors.response.use(
  //response 받기 전 가공해서 넘기는 거 맞아
  (config) => {
    return config;
  },
  (error) => {
    /*
    http status가 401 경우 응답 에러 직전 호출.
    .catch() 으로 이어짐.
    */
    //폼데이터 response 400대 혹은 그 외 에러
    console.log("일반데이터 res 에러 처리 110줄");
    console.log(error); //400에러 지나감
    console.log(error.response.status); //status(400)에러

    const newToken = error.response.data.newJwtToken;
    const ok = error.response.data.ok;
    const statusValue = error.response.status;

    if (statusValue === 401 && ok !== 6) {
      console.log("status 401찍혀 105줄");
      alert("비정상적인 활동이 감지되어 로그인 화면으로 이동합니다.");
      removeCookie("token", { path: "/" });
      window.location.replace("/");
    } else if (statusValue === 401 && ok === 6) {
      //토큰 만료됐을 때
      console.log("401에러-만료되서 새 토큰 발행하는겨");
      console.log("새토큰으로 교체!", newToken);

      setCookie("token", newToken, { path: "/" }); //1.새토큰세팅하고
      return axios({
        ...error.config,
        headers: {
          Authorization: `Bearer ${newToken}`, //2.새토큰장착
        },
      });
    }

    return Promise.reject(error);
  }
);

//폼데이터 인터셉터
instanceF.interceptors.request.use(
  async (config) => {
    const token = cookies.get("token");
    // 요청 성공 직전 수행할 일
    console.log("일반데이터 인터셉터정보 131줄", config); //여기부터 요청시작
    console.log("현재장착된 토큰", config.headers);
    console.log(config.headers.Authorization); //

    config.headers["Authorization"] = `Bearer ${token}`;
    console.log("토큰 여기까지 찍혀 137줄", token);

    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
/*
  2. 응답 인터셉터 추가
  2개의 콜백 함수를 받음.
*/ //참고로 instanceF는 FormData용
instanceF.interceptors.response.use(
  //response 받기 전 가공해서 response로 내보내는 게 맞음
  (config) => {
    return config;
  },
  (error) => {
    /*
    http status가 401 경우 응답 에러 직전 호출.
    .catch() 으로 이어짐.
    */
    //폼데이터 response 400대 혹은 그 외 에러
    console.log("폼데이터 res 에러 처리 162줄");
    console.log(error); //400에러 지나감
    console.log(error.response.status); //status(400)대에러
    // console.log(error.response.data); //백에서보낸errorbody값
    console.log("새토큰들어왔다", error.response.data.newJwtToken);
    const newToken = error.response.data.newJwtToken;
    const ok = error.response.data.ok;
    const statusValue = error.response.status;

    if (statusValue === 401 && ok !== 6) {
      console.log("status 401찍혀 210줄");
      alert("비정상적인 활동이 감지되어 로그인 화면으로 이동합니다.");
      removeCookie("token", { path: "/" });
      window.location.replace("/"); //이부분은 필요시 사용. useNavigate()대체함수
    } else if (statusValue === 401 && ok === 6) {
      //만료됐을 때
      console.log("새토큰장착", newToken);
      setCookie("token", newToken, { path: "/" }); //1.새토큰세팅하고
      return axios({
        ...error.config,
        headers: {
          Authorization: `Bearer ${newToken}`, //2.새토큰장착
        },
      });
    }

    return Promise.reject(error);
  }
);
