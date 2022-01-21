import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { AddModal, StudentsModal } from "../common/Modal";
import { Dropdown } from "react-bootstrap";
import SettingsModal from "./SettingsModal";
import profile from "../../assets/svg/profile.png";

function AdminHeader(props) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [settingsModalShow, setSettingsModalShow] = useState(false);
  return (
    <nav className="navbar navbar-dark navbar-expand-md">
      {/* <AddModal
        show={addModalShow}
        onHide={() => setAddModalShow(false)}
        AddStudentButton={props.AddStudentButton}
        AddInstituteButton={props.AddInstituteButton}
        AddInstallmentButton={props.AddInstallmentButton}
      /> */}
      <SettingsModal
        show={settingsModalShow}
        onHide={() => setSettingsModalShow(false)}
        logoutWithRedirect={props.logoutWithRedirect}
      />
      <div className="row">
        <div className="width-others-wide fixed-top me-auto logo" id="top-bar">
          <div className="row justify-content-center pt-3">
            <div className="col-auto">
              <Dropdown alignRight>
                <Dropdown.Toggle
                  className="nav-link count-indicator"
                  bsPrefix="nn"
                >
                  <div className="nav-profile-img">
                    <img
                      alt="profile"
                      src={profile}
                      width={30}
                      className="me-2"
                    />
                  </div>
                  <div className="nav-profile-text">
                    <p className="mb-1 text-black">
                      <p>سجاد</p>
                    </p>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="preview-list navbar-dropdown"
                  id="dd-m"
                >
                  <div className="p-2">
                    <Dropdown.Item
                      className="dropdown-item d-flex align-items-center justify-content-between"
                      href="!#"
                      onClick={(evt) => evt.preventDefault()}
                    >
                      <span>
                        <p>Log Out</p>
                      </span>
                      <i className="mdi mdi-logout ml-1"></i>
                    </Dropdown.Item>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div
          className="width-sidebar-wide sidebar rightfixed p-0"
          id="side-bar"
        >
          <div className="r-navbar" id="nav-bar" dir="rtl">
            <nav className="nav">
              <div>
                <a
                  href="#"
                  className="nav_logo"
                  onClick={() => {
                    props.sideEvent();
                    props.setSideBarShow(!props.sideBarShow);
                  }}
                >
                  <FontAwesomeIcon
                    icon="bars"
                    className="nav_logo-icon"
                    color="white"
                    size="2x"
                  />
                  <span className="nav_logo-name" id="nav-text">
                    الاقساط
                  </span>
                </a>
                <div className="nav_list">
                  <a
                    href="#"
                    className={"nav_link " + props.Active.Manage}
                    onClick={props.handleManageButton}
                  >
                    <FontAwesomeIcon
                      icon="user-cog"
                      className={"nav_logo-icon " + props.Active.Manage}
                      color="white"
                      size="2x"
                    />
                    <span
                      className={"nav_name " + props.Active.Manage}
                      id="nav-text"
                    >
                      الادارة
                    </span>
                  </a>
                  <a
                    href="#"
                    className={"nav_link " + props.Active.States}
                    onClick={props.MainButton}
                  >
                    <FontAwesomeIcon
                      icon="home"
                      className={"nav_logo-icon " + props.Active.States}
                      color="white"
                      size="2x"
                    />
                    <span
                      className={"nav_name " + props.Active.States}
                      id="nav-text"
                    >
                      المناطق
                    </span>
                  </a>
                  <a
                    href="#"
                    className={"nav_link " + props.Active.Reports}
                    onClick={props.ReportsButton}
                  >
                    <FontAwesomeIcon
                      icon="exclamation-circle"
                      className={"nav_logo-icon " + props.Active.Reports}
                      color="white"
                      size="2x"
                    />
                    <span
                      className={"nav_name " + props.Active.Reports}
                      id="nav-text"
                    >
                      التقارير
                    </span>
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminHeader;
