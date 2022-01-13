import React, { useState, Fragment, useEffect } from "react";
import Admin from "../admin/Admin";
import AttendanceOfficer from "../attendanceOfficer/Attendanceofficer";

const apiUrl = process.env.API_URL;
var { ipcRenderer } = require("electron");

const HomePage = (props) => {
  const [loading, setLoading] = useState(false);

  const logoutWithRedirect = () => {
    localStorage.removeItem("token");
    ipcRenderer.send("login");
  };

  return <Admin logoutWithRedirect={logoutWithRedirect} />;
};
export default HomePage;
