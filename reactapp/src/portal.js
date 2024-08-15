import { HashRouter, Routes, Route } from "react-router-dom";
import WeatherApp from "./Dashboard";
import Header from "./header";


const Portal = () => {
  return (
    <HashRouter>
      <Header />
      <Routes>
       <Route exact path="/" element={<WeatherApp />} />
       
      </Routes>
    </HashRouter>
  );
};

export default Portal;
