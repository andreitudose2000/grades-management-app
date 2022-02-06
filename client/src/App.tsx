import * as React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/base/Header";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import PublicConfigPage from "./pages/PublicConfigPage";
import RegisterPage from "./pages/RegisterPage";
import { State } from "./redux/interfaces";

export default function App() {
  const user = useSelector((state: State) => state.user);
  return (
    <>
      <Router>
        <Header {...user} />
        <Routes>
          <Route path="/my-grades" element={<MyPage />} />
          <Route path="/browse" element={<PublicConfigPage />} />
          <Route path="/feedback" element={<></>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}
