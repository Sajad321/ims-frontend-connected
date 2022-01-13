import React, { Fragment, useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import States from "./States";
import Reports from "./Reports";
import AddStudent from "./AddStudent";
const apiUrl = process.env.API_URL;

function Admin(props) {
  const [page, setPage] = useState("Reports");

  const [sideBarShow, setSideBarShow] = useState(true);

  const sideEvent = () => {
    let nav = document.querySelectorAll("#nav-text");
    let sideBar = document.getElementById("side-bar");
    let topBar = document.getElementById("top-bar");
    let bottomBar = document.getElementById("bottom-bar");
    let mainView = document.getElementById("main-view");
    if (!sideBarShow) {
      // console.log("showed");
      for (let i = 0; i < nav.length; i++) {
        nav[i].style.display = "block";
      }
      sideBar.className = "width-sidebar-wide sidebar rightfixed p-0";
      topBar.className =
        "width-others-wide fixed-top mr-auto admin-nav-bg top-navbar top-height logo";
      bottomBar.className =
        "width-others-wide fixed-bottom mr-auto admin-nav-bg bottom-bar";
      mainView.className = "width-others-wide mr-auto main-view";
    } else {
      // console.log("cut");
      for (let i = 0; i < nav.length; i++) {
        nav[i].style.display = "none";
      }
      sideBar.className = "width-sidebar-narrow sidebar rightfixed p-0";
      topBar.className =
        "width-others-narrow fixed-top mr-auto admin-nav-bg top-navbar top-height logo";
      bottomBar.className =
        "width-others-narrow fixed-bottom mr-auto admin-nav-bg bottom-bar";
      mainView.className = "width-others-narrow mr-auto main-view";
    }
  };
  const [dataToChange, setDataToChange] = useState({});
  const [attendanceStartData, setAttendanceStartData] = useState({
    institute_id: "",
    date: "",
  });

  const [institutes, setInstitutes] = useState([]);
  const [institute, setInstitute] = useState("0");

  const getStuff = async () => {
    try {
      const response = await fetch(`${apiUrl}/institute`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseData = await response.json();
      setInstitutes(responseData.institutes);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getStuff();
  }, []);

  const AdminHeaderFunction = (Act) => {
    return (
      <AdminHeader
        logoutWithRedirect={props.logoutWithRedirect}
        Active={Act}
        MainButton={handleStatesButton}
        ReportsButton={handleReportsButton}
        AddStudentButton={handleAddStudentButton}
        sideEvent={sideEvent}
        sideBarShow={sideBarShow}
        setSideBarShow={setSideBarShow}
      />
    );
  };

  const handleStatesButton = () => {
    setPage("States");
    setDataToChange({});
    getStuff();
  };

  const handleReportsButton = () => {
    setPage("Reports");
    setDataToChange({});
  };

  const handleStateStudentsButton = (institute_id) => {
    setInstitute(institute_id);
    setPage("StateStudents");
    setDataToChange({});
  };

  const handleUsersButton = (institute_id) => {
    setInstitute(institute_id);
    setPage("Users");
    setDataToChange({});
  };

  const handleAddStudentButton = () => {
    setPage("AddStudent");
    setDataToChange({});
  };

  const handleEditStudentButton = (student) => {
    setDataToChange(student);
    setPage("AddStudent");
  };

  if (page == "States") {
    return (
      <Fragment>
        {AdminHeaderFunction({ States: "active" })}
        {/* End of Navbar */}

        {/* States */}
        <States sideEvent={sideEvent} sideBarShow={sideBarShow} />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "Reports") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Reports: "active" })}
        {/* End of Navbar */}
        {/* Reports */}
        <Reports
          sideEvent={sideEvent}
          sideBarShow={sideBarShow}
          edit={handleEditStudentButton}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "Users") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Users: "active" })}
        {/* End of Navbar */}
        {/* Users */}
        <Users
          sideEvent={sideEvent}
          sideBarShow={sideBarShow}
          edit={handleEditStudentButton}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "StateStudents") {
    return (
      <Fragment>
        {AdminHeaderFunction({ States: "active" })}
        {/* End of Navbar */}
        {/* StateStudents */}
        <StateStudents
          edit={handleEditInstallmentButton}
          page={handleMainButton}
          sideBarShow={sideBarShow}
          institutes={institutes}
          institute={institute}
          edit={handleEditStudentButton}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "AddStudent") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Add: "active" })}
        {/* End of Navbar */}
        {/* AddStudent */}
        <AddStudent
          page={handleMainButton}
          dataToChange={dataToChange}
          sideBarShow={sideBarShow}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  }
}

export default Admin;
