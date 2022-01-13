import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import printJS from "print-js";
import ConfirmModal from "../common/ConfirmModal";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../common/Loading";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
const apiUrl = process.env.API_URL;

// var { ipcRenderer } = require("electron");

function Reports({ sideBarShow, institutes, institute }) {
  const [data, setData] = useState({
    students: [],
    attendance: [],
    total_students: "",
    page: 1,
  });
  const [searchedData, setSearchedData] = useState({
    students: [],
    attendance: [],
    total_students: "",
    page: 1,
  });
  const [confirmModal, setConfirmModal] = useState({
    visbile: false,
    index: 0,
    student_attendance_id: 0,
    attended: 0,
  });
  const [searchType, setSearchType] = useState("0");
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [searchInstitute, setSearchInstitute] = useState("0");
  const [loading, setLoading] = useState(true);

  const getAttendance = async (page, institute_id = "0") => {
    try {
      let rr = ``;
      if (institute_id != "0") {
        rr = `${apiUrl}/students-attendance?page=${page}&institute_id=${institute_id}`;
        if (searchType != "0") {
          rr = `${apiUrl}/students-attendance?page=${page}&institute_id=${institute_id}&search_type=${searchType}&search1=${search1}&search2=${search2}`;
        }
      } else {
        if (searchType != "0") {
          rr = `${apiUrl}/students-attendance?page=${page}&search_type=${searchType}&search1=${search1}&search2=${search2}`;
        }
      }
      const response = await fetch(
        rr != `` ? rr : `${apiUrl}/students-attendance?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        }
      );
      const responseData = await response.json();
      // if (searchType != "0" || institute_id != "0") {
      //   if (page == 1) {
      //     setSearchedData({
      //       students: responseData.students,
      //       attendance: responseData.attendance,
      //       total_students: responseData.total_students,
      //       page: responseData.page,
      //     });
      //   } else {
      //     setSearchedData({
      //       students: data.students.concat(responseData.students),
      //       attendance: responseData.attendance,
      //       total_students: responseData.total_students,
      //       page: responseData.page,
      //     });
      //   }
      // } else {
      //   if (page == 1) {
      //     setData({
      //       students: responseData.students,
      //       attendance: responseData.attendance,
      //       total_students: responseData.total_students,
      //       page: responseData.page,
      //     });
      //     setSearchedData({
      //       students: responseData.students,
      //       attendance: responseData.attendance,
      //       total_students: responseData.total_students,
      //       page: responseData.page,
      //     });
      //   } else {
      //     setData({
      //       students: data.students.concat(responseData.students),
      //       attendance: responseData.attendance,
      //       total_students: responseData.total_students,
      //       page: responseData.page,
      //     });
      //   }
      // }
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    setSearchInstitute(institute);
    if (institute != "0") {
      getAttendance(1, institute);
    } else {
      getAttendance(1);
    }
  }, []);
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  const handleSearch1Change = (e) => {
    setSearch1(e.target.value);
  };
  const handleSearch2Change = (e) => {
    setSearch2(e.target.value);
  };
  const handleInstituteChange = (e) => {
    if (e.target.value != "0") {
      setSearchInstitute(e.target.value);
      getAttendance(1, e.target.value);
    } else {
      setSearchInstitute("0");
    }
  };

  const handleSearchButton = (e) => {
    e.preventDefault();
    setLoading(true);
    getAttendance(1, searchInstitute);
  };

  const printTable = () => {
    // let divToPrint = document.getElementById("print-table");
    // newWin = window.open("");
    // newWin.document.write(divToPrint.outerHTML);
    // newWin.print();
    // newWin.close();
    printJS({
      printable: "print-table",
      type: "html",
    });
    // window.print();
  };

  const searchBar = () => {
    if (searchType == "0") {
      return (
        <div className="col-7">
          <p className="form-control text">بحث حسب </p>
        </div>
      );
    } else if (searchType == "1") {
      return (
        <div className="col-7">
          <input
            type="text"
            className="form-control text"
            id="searchStudent"
            onChange={handleSearch1Change}
            placeholder="ابحث"
          ></input>
        </div>
      );
    } else if (searchType == "2") {
      return (
        <Fragment>
          <div className="col-5 offset-2 col-md-3 offset-md-0 order-0 order-md-2">
            <input
              type="date"
              className="form-control text"
              id="searchDate"
              onChange={handleSearch1Change}
            ></input>
          </div>
          <p
            className="col-2 col-md-1 order-1 order-md-3 text-white"
            style={{ fontSize: "20px" }}
          >
            من
          </p>
          <div className="col-5 offset-5 col-md-3 offset-md-0 order-2 order-md-0">
            <input
              type="date"
              className="form-control text"
              id="searchDate"
              onChange={handleSearch2Change}
            ></input>
          </div>
          <p
            className="col-2 col-md-1 order-3 order-md-1 text-white"
            style={{ fontSize: "20px" }}
          >
            الى
          </p>
        </Fragment>
      );
    } else if (searchType == "3") {
      return (
        <Fragment>
          <div className="col-5 offset-2 col-md-3 offset-md-0 order-0 order-md-2">
            <input
              type="time"
              className="form-control text"
              id="searchDate"
              onChange={handleSearch1Change}
            ></input>
          </div>
          <p
            className="col-2 col-md-1 order-1 order-md-3 text-white"
            style={{ fontSize: "20px" }}
          >
            من
          </p>
          <div className="col-5 offset-5 col-md-3 offset-md-0 order-2 order-md-0">
            <input
              type="time"
              className="form-control text"
              id="searchDate"
              onChange={handleSearch2Change}
            ></input>
          </div>
          <p
            className="col-2 col-md-1 order-3 order-md-1 text-white"
            style={{ fontSize: "20px" }}
          >
            الى
          </p>
        </Fragment>
      );
    }
  };
  const render_table = () => {
    if (searchType != "0" || searchInstitute != "0") {
      const render_data = searchedData.students.map((student, index) => {
        return (
          <tr
            key={student.id}
            className="font-weight-bold text-white"
            className="d-flex"
          >
            <td className="t-id">{index + 1}</td>
            <td className="t-name">{student.name}</td>
          </tr>
        );
      });
      return (
        <table
          className="table table-dark table-striped table-bordered table-hover text"
          dir="rtl"
          border="1"
          id="print-table"
        >
          <thead className="thead-dark">
            <tr className="d-flex">
              <th className="t-id">ت</th>
              <th className="t-name">الاسم</th>
            </tr>
          </thead>
          <tbody>{render_data}</tbody>
        </table>
      );
    } else {
      const render_data = data.students.map((student, index) => {
        return (
          <tr
            key={student.id}
            className="font-weight-bold text-white"
            className="d-flex"
          >
            <td className="t-id">{index + 1}</td>
            <td className="t-name">{student.name}</td>
          </tr>
        );
      });
      return (
        <table
          className="table table-dark table-striped table-bordered table-hover text"
          dir="rtl"
          border="1"
          id="print-table"
        >
          <thead className="thead-dark">
            <tr className="d-flex">
              <th className="t-id">ت</th>
              <th className="t-name">الاسم</th>
            </tr>
          </thead>
          <tbody>{render_data}</tbody>
        </table>
      );
    }
  };
  return (
    <section className="main">
      <div className="row pt-5 m-0">
        <div
          className={
            sideBarShow
              ? "width-others-wide mr-auto main-view"
              : "width-others-narrow mr-auto main-view"
          }
          id="main-view"
        >
          <div className="row mt-2">
            <div className="col-12 top-bg">
              <h5 className="text-end">التقارير</h5>
            </div>
          </div>
          <div className="row pt-md-3 pr-2 pl-2 mt-md-3 mb-5">
            <div className="col-12">
              <div className="row mt-3">
                <div className="col-8">
                  <form onSubmit={handleSearchButton}>
                    <div className="form-group row mt-1">
                      <div className="col-2 text">
                        <button
                          type="submit"
                          className="btn btn-secondary btn-sm mt-1"
                        >
                          ابحث
                        </button>
                      </div>
                      <div className="col-3 col-sm-2">
                        <select
                          id="searchType"
                          onChange={handleSearchTypeChange}
                          className="form-select"
                          dir="rtl"
                        >
                          <option value="0" defaultValue>
                            الكل
                          </option>
                          <option value="1">الاسم</option>
                          <option value="2">التاريخ</option>
                          <option value="3">رقم الوصل</option>
                        </select>
                      </div>
                      {searchBar()}
                    </div>
                  </form>
                </div>
                <div className="col-1 pt-1">
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-secondary"
                    table="print-table"
                    filename="الحضور"
                    sheet="الحضور"
                    buttonText="طباعة"
                  />
                </div>
                <div className="col-1 pt-1">
                  <select
                    id="institute"
                    onChange={handleInstituteChange}
                    className="form-select"
                    dir="rtl"
                    value={searchInstitute}
                  >
                    <option value="0" defaultValue>
                      المناطق
                    </option>
                    {/* {institutes.map((institute) => (
                      <option key={institute.id} value={institute.id}>
                        {institute.name}
                      </option>
                    ))} */}
                  </select>
                </div>
              </div>
            </div>
            <ConfirmModal
              show={confirmModal.visbile}
              onHide={() =>
                setConfirmModal({ ...confirmModal, visbile: false })
              }
              // handleToggleButton={handleAttendanceToggleButton}
              index={confirmModal.index}
              student_id={confirmModal.student_attendance_id}
              done={confirmModal.attended}
            />
            <div className="col-12">
              {loading ? (
                <Loading />
              ) : (
                <InfiniteScroll
                  dataLength={
                    searchType != "0" || searchInstitute != "0"
                      ? searchedData.page * 100
                      : data.page * 100
                  } //This is important field to render the next data
                  next={() =>
                    getAttendance(
                      searchType != "0" || searchInstitute != "0"
                        ? searchedData.page + 1
                        : data.page + 1,
                      searchType != "0" || searchInstitute != "0"
                        ? searchInstitute
                        : "0"
                    )
                  }
                  hasMore={
                    searchType != "0" || searchInstitute != "0"
                      ? searchedData.total_students !=
                        searchedData.students.length
                      : data.total_students != data.students.length
                  }
                  loader={<Loading />}
                  endMessage={
                    <p className="pb-3 pt-3 text-center text-white">
                      <b>هذه جميع النتائج</b>
                    </p>
                  }
                  // below props only if you need pull down functionality
                  // refreshFunction={this.refresh}
                  // pullDownToRefresh
                  // pullDownToRefreshThreshold={50}
                  // pullDownToRefreshContent={
                  //   <h3 style={{ textAlign: "center" }}>
                  //     &#8595; Pull down to refresh
                  //   </h3>
                  // }
                  // releaseToRefreshContent={
                  //   <h3 style={{ textAlign: "center" }}>
                  //     &#8593; Release to refresh
                  //   </h3>
                  // }
                >
                  <div className="table-responsive">{render_table()}</div>
                </InfiniteScroll>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Reports;
