import * as React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/base/Header";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import ConfigPage from "./pages/ConfigPage";
import RegisterPage from "./pages/RegisterPage";
import WelcomePage from "./pages/WelcomePage";
import { State } from "./redux/interfaces";

export default function App() {
  const user = useSelector((state: State) => state.user);
  return (
    <>
      <Router>
        <Header {...user} />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/my-grades" element={<MyPage />} />
          <Route path="/browse" element={<ConfigPage />} />
          <Route path="/feedback" element={<></>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}
