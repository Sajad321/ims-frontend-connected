import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

const apiUrl = process.env.API_URL;

function SettingsModal(props) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    id: "",
    name: "",
    username: "",
    password: "",
    auth: "",
  });
  const [settingsPage, setSettingsPage] = useState("UsersPage");

  const getUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: "GET",
      });
      const responseData = await response.json();
      setUsers(
        [...responseData.users].filter(
          (u) =>
            u.username != JSON.parse(localStorage.getItem("token")).username
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const UsersPage = () => {
    return (
      <div className="form-group row mb-0 mt-2" dir="rtl">
        <table className="table table-dark table-bordered table-striped table-hover text-white text-right m-3">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>اسم المستخدم</th>
              <th>&nbsp;</th>
              {/* <th>&nbsp;</th> */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>
                    <button
                      onClick={() => {
                        setUser({
                          id: user.id,
                          name: user.name,
                          username: user.username,
                          password: user.password,
                          auth: user.auth,
                        });
                        setSettingsPage("AddPage");
                      }}
                      className="btn btn-secondary text-white"
                    >
                      تعديل
                    </button>
                  </td>
                  {/* <td>
                    <button
                      onClick={() => {}}
                      className="btn btn-secondary text-white"
                    >
                      حذف
                    </button>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const [saving, setSaving] = useState(false);
  const saveUser = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `${apiUrl}/` +
          `${
            user.id != ""
              ? `user?user_id=${Number(user.id)}&name=${user.name}&username=${
                  user.username
                }&password=${Number(user.password)}&auth=${Number(user.auth)}`
              : `register?name=${user.name}&username=${
                  user.username
                }&password=${Number(user.password)}&auth=${Number(user.auth)}`
          }`,
        {
          method: user.id != "" ? "PATCH" : "POST",
        }
      );

      const responseData = await response.json();

      toast.success("تم حفظ المستخدم");
      getUsers();
      setUser({
        id: "",
        name: "",
        username: "",
        password: "",
        auth: "",
      });
      setSettingsPage("UsersPage");
      setSaving(false);
    } catch (error) {
      console.log(error.message);
      setSaving(false);
      toast.error("فشل الحفظ");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    saveUser();
  };

  const AddPage = () => {
    const handleNameChange = (e) => {
      setUser({ ...user, name: e.target.value });
    };
    const handleUsernameChange = (e) => {
      setUser({ ...user, username: e.target.value });
    };
    const handlePasswordChange = (e) => {
      setUser({ ...user, password: e.target.value });
    };
    const handleAuthChange = (e) => {
      setUser({ ...user, auth: e.target.value });
    };
    return (
      <div
        className="pt-3 pr-2 pl-2 mt-3 mb-1 d-flex justify-content-center align-items-center"
        dir="ltr"
      >
        <div className="p-2">
          <form onSubmit={handleSubmit}>
            <div className="form-group row">
              <div className="">
                <input
                  type="text"
                  placeholder="الاسم"
                  className="form-control text"
                  onChange={handleNameChange}
                  value={user.name}
                  required
                ></input>
              </div>
              <label
                htmlFor="name"
                className="ml-4 col-form-label text-center text-white"
              >
                الاسم
              </label>
            </div>
            <div className="form-group row">
              <div className="">
                <input
                  type="text"
                  placeholder="اسم المستخدم"
                  className="form-control text"
                  onChange={handleUsernameChange}
                  value={user.username}
                  required
                ></input>
              </div>
              <label
                htmlFor="username"
                className="ml-4 col-form-label text-center text-white"
              >
                اسم المستخدم
              </label>
            </div>
            <div className="form-group row">
              <div className="">
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  className="form-control text"
                  onChange={handlePasswordChange}
                  value={user.password}
                  required
                ></input>
              </div>
              <label
                htmlFor="password"
                className="ml-4 col-form-label text-center text-white"
              >
                كلمة المرور
              </label>
            </div>
            <div className="form-group row">
              <div className="">
                <select
                  id="auth"
                  onChange={handleAuthChange}
                  className="form-control text"
                  dir="rtl"
                  value={user.auth}
                  required
                >
                  <option selected>اختر</option>
                  <option value="1">كامل الصلاحيات</option>
                  <option value="2">مسؤول الحضور</option>
                </select>
              </div>
              <label
                htmlFor="auth"
                className="ml-4 col-form-label text-center text-white"
              >
                الصلاحية
              </label>
            </div>
            <div className="form-group">
              <div className="mt-4 align-self-center">
                {!saving ? (
                  <button type="submit" className="btn btn-success btn-block">
                    حفظ المستخدم
                  </button>
                ) : (
                  <button disabled className="btn btn-success btn-block">
                    يتم الارسال
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };
  const pageToReturn = () => {
    if (settingsPage == "UsersPage") {
      return UsersPage();
    } else if (settingsPage == "AddPage") {
      return AddPage();
    }
  };
  return (
    <Modal
      show={props.show}
      onHide={() => {
        props.onHide();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dir="rtl"
      className="my-modal text-white"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          الاعدادات مرحبا{" "}
          {localStorage.getItem("token") != undefined
            ? JSON.parse(localStorage.getItem("token")).name
            : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{pageToReturn()}</Modal.Body>
      <Modal.Footer
        className="m-0 align-items-center justify-content-center"
        dir="ltr"
      >
        <div className="">
          <Button
            onClick={() => {
              props.onHide();
              props.logoutWithRedirect();
            }}
            className="modal-add-nav btn-danger"
          >
            تسجيل الخروج
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              setUser({
                id: "",
                name: "",
                username: "",
                password: "",
                auth: "",
              });
              setSettingsPage("AddPage");
            }}
            className="modal-add-nav btn-success"
          >
            اضافة مستخدم
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              setUser({
                id: JSON.parse(localStorage.getItem("token")).id,
                name: JSON.parse(localStorage.getItem("token")).name,
                username: JSON.parse(localStorage.getItem("token")).username,
                password: JSON.parse(localStorage.getItem("token")).password,
                auth: JSON.parse(localStorage.getItem("token")).auth,
              });
              setSettingsPage("AddPage");
            }}
            className="modal-add-nav"
          >
            تعديل حسابك
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              setUser({
                id: "",
                name: "",
                username: "",
                password: "",
              });
              setSettingsPage("UsersPage");
            }}
            className="modal-add-nav"
          >
            المستخدمين
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default SettingsModal;
