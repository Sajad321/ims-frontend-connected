import React, { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const { ipcRenderer } = require("electron");
const apiUrl = process.env.API_URL;

async function loginUser(credentials) {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((data) => data.json())
    .catch((error) => {
      console.log(error);
      toast.error("اسم المستخدم او كلمة المرور خاطئة");
    });
}
export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    if (token != undefined) {
      setToken(token.token);
      localStorage.setItem("Biotime", token.biotime);
      localStorage.setItem("token", JSON.stringify(token));
      if (token.token) {
        ipcRenderer.send("finished-login");
      }
      if (token.success == false) {
        toast.error("اسم المستخدم او كلمة المرور خاطئة");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center main pb-5">
      <form onSubmit={handleSubmit} className="w-50" dir="rtl">
        <h3 className="text-center mb-3">تسجيل الدخول</h3>

        <div className="form-group mb-3">
          <label className="form-label">اسم المستخدم</label>
          <input
            type="username"
            className="form-control"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label className="form-label">كلمة المرور</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block w-100">
          سجل الدخول
        </button>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
