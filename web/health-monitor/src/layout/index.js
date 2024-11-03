import React from "react";
import "./styles.css";
import { FaHouseChimney, FaCalendarDay, FaGear } from "react-icons/fa6";
import logo from "../assets/Frame.png";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="appContainer">
      <div className="sidebar">
        <div className="logo">
          <img className="imgLogo" src={logo} alt="imagem logo" />
        </div>
        <div className="divIcons">
          <div className="icon">
            <FaHouseChimney style={{ color: "#707070" }} />
          </div>
          <div className="icon">
            <FaCalendarDay style={{ color: "#707070" }} />
          </div>
          <div className="icon">
            <FaGear style={{ color: "#707070" }} />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Layout;
