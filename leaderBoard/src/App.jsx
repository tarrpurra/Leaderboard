import "./App.css";
import MainPage from "./components/Mainpage";
import Topnav from "./components/topnav";
import Profile from "./components/Profile";
import History from "./components/History";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Topnav />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;
