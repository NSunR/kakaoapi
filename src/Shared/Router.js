import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import GoogleLogin from "../Pages/GoogleLogin";
import KakaoLogin from "../Pages/KakaoLogin";
import NaverLogin from "../Pages/NaverLogin";
import ChatPage from "../Pages/ChatPage";
import MyPage from "../Components/Profile/Mypage";
import ProfilePic from "../Components/Profile/ProfilePic";
import Disclaimer from "../Components/Agreement/Disclaimer";
import ConversPage from "../Pages/ConversPage";
import ChattingPage from "../Pages/ChattingPage";
import SubwayPage from "../Pages/SubwayPage";
import AuthCode from "../Pages/AuthCode";
import AddInfo from "../Pages/AddInfo";
import SubSign from "../Pages/SubSign";
import Kakaospot from "../Components/Kakaospot/Kakaospot";
import KakaoSearch from "../Components/Kakaospot/KakaoSearch.jsx";
import Timer from "../Components/Timer/Timer";
import MapContainer from "../Components/Kakaospot/MapContainer";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/subsign" element={<SubSign />} />
        <Route path="/authcode" element={<AuthCode />} />
        <Route path="/addinfo" element={<AddInfo />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="profilepic" element={<ProfilePic />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/auth/kakao/callback" element={<KakaoLogin />} />
        <Route path="/auth/google/callback" element={<GoogleLogin />} />
        <Route path="/auth/naver/callback" element={<NaverLogin />} />
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/converspage" element={<ConversPage />} />
        <Route path="/chattingpage" element={<ChattingPage />} />
        <Route path="/subwaypage" element={<SubwayPage />} />
        <Route path="/kakaospot" element={<Kakaospot />} />
        <Route path="/kakaosearch" element={<KakaoSearch />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/kakaosearch" element={<KakaoSearch />} />
        <Route path="/MapContainer" element={<MapContainer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
