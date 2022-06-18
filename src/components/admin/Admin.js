import React, { Fragment, useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import States from "./States";
import Reports from "./Reports";
import StateStudents from "./StateStudents";
import AddStudent from "./AddStudent";
import Manage from "./Manage";
import { toast } from "react-toastify";
import AddInstallment from "./AddInstallment";
import Installments from "./Installments";
const apiUrl = process.env.API_URL;

function Admin(props) {
  const [page, setPage] = useState("States");

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

  const [states, setStates] = useState({
    total_states: "",
    states: [],
  });
  const [selectedState, setSelectedState] = useState({});
  const [students, setStudents] = useState([]);
  const [syncOp, setSyncOp] = useState({ showSync: true, syncing: false });
  const goSync = async () => {
    try {
      setSyncOp({ ...syncOp, syncing: true });
      const response = await fetch(`${apiUrl}/sync`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseData = await response.json();
      toast.success("تمت المزامنة بنجاح");
      setSyncOp({ showSync: false, syncing: false });
    } catch (error) {
      console.log(error.message);
      toast.error("فشلت المزامنة");
      setSyncOp({ showSync: true, syncing: false });
    }
  };
  const getStates = async () => {
    try {
      const response = await fetch(`${apiUrl}/states`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseData = await response.json();
      setStates({
        ...states,
        states:
          JSON.parse(localStorage.getItem("token")).super == 1
            ? responseData.states
            : responseData.states.filter((state) => {
                return JSON.parse(localStorage.getItem("super"))
                  .authority.map((auth) => {
                    return auth.id;
                  })
                  .includes(state.id);
              }),
        total_states: responseData.states.length,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const getStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/students-names`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseData = await response.json();
      setStudents(responseData.students);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getStates();
    getStudents();
  }, []);

  const AdminHeaderFunction = (Act) => {
    return (
      <AdminHeader
        logoutWithRedirect={props.logoutWithRedirect}
        Active={Act}
        MainButton={handleStatesButton}
        handleManageButton={handleManageButton}
        ReportsButton={handleReportsButton}
        InstallmentsButton={handleInstallmentsButton}
        AddInstallmentButton={handleAddInstallmentButton}
        sideEvent={sideEvent}
        sideBarShow={sideBarShow}
        setSideBarShow={setSideBarShow}
        goSync={goSync}
        syncOp={syncOp}
      />
    );
  };

  const handleStatesButton = () => {
    getStates();
    setPage("States");
    setDataToChange({});
  };

  const handleReportsButton = () => {
    setPage("Reports");
    setDataToChange({});
  };

  const handleInstallmentsButton = () => {
    setPage("Installments");
    setDataToChange({});
  };

  const handleStateStudentsButton = () => {
    setPage("StateStudents");
    setDataToChange({});
  };

  const handleManageButton = () => {
    setPage("Manage");
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

  const handleAddInstallmentButton = () => {
    setPage("AddInstallment");
    setDataToChange({});
  };

  const handleEditInstallmentButton = (installment) => {
    setDataToChange(installment);
    setPage("AddInstallment");
  };

  console.log(states);
  if (page == "States") {
    return (
      <Fragment>
        {AdminHeaderFunction({ States: "active" })}
        {/* End of Navbar */}

        {/* States */}
        <States
          sideEvent={sideEvent}
          sideBarShow={sideBarShow}
          getStates={getStates}
          data={states}
          setSelectedState={setSelectedState}
          handleStateStudentsButton={handleStateStudentsButton}
          setSyncOp={setSyncOp}
          syncOp={syncOp}
        />
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
          states={states.states}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "Installments") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Installments: "active" })}
        {/* End of Navbar */}
        {/* Reports */}
        <Installments
          sideEvent={sideEvent}
          sideBarShow={sideBarShow}
          edit={handleEditInstallmentButton}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "Manage") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Manage: "active" })}
        {/* End of Navbar */}
        {/* Manage */}
        <Manage
          sideEvent={sideEvent}
          sideBarShow={sideBarShow}
          edit={handleEditStudentButton}
          states={states.states}
          setSyncOp={setSyncOp}
          syncOp={syncOp}
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
          page={handleStatesButton}
          sideBarShow={sideBarShow}
          selectedState={selectedState}
          add={handleAddStudentButton}
          edit={handleEditStudentButton}
          setSyncOp={setSyncOp}
          syncOp={syncOp}
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
          page={handleStatesButton}
          dataToChange={dataToChange}
          selectedState={selectedState}
          sideBarShow={sideBarShow}
          handleStateStudentsButton={handleStateStudentsButton}
          setSyncOp={setSyncOp}
          syncOp={syncOp}
          students={students}
          getStudents={getStudents}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "AddInstallment") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Add: "active" })}
        {/* End of Navbar */}
        {/* AddInstallment */}
        <AddInstallment
          page={handleStatesButton}
          dataToChange={dataToChange}
          sideBarShow={sideBarShow}
          setSyncOp={setSyncOp}
          syncOp={syncOp}
          getStudents={getStudents}
          handleStatesButton={handleStatesButton}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  }
}

export default Admin;
