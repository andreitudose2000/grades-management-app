import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/base/Header";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import PublicConfigPage from "./pages/PublicConfigPage";
import RegisterPage from "./pages/RegisterPage";
import { store } from "./redux/store";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Header />
          <Routes>
            <Route path="/my-grades" element={<MyPage />} />
            <Route path="/browse" element={<PublicConfigPage />} />
            <Route path="/feedback" element={<></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}
