import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import printJS from "print-js";
import ConfirmModal from "../common/ConfirmModal";
import Loading from "../common/Loading";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import InfiniteScroll from "react-infinite-scroll-component";

const apiUrl = process.env.API_URL;

function Reports({ sideBarShow, states }) {
  const [data, setData] = useState({
    students: [],
    total_students: "",
    total_installments: "",
    total_first_installment: "",
    total_second_installment: "",
    total_third_installment: "",
    total_forth_installment: "",
    total_remaining: "",
    page: 1,
  });
  const [searchedData, setSearchedData] = useState({
    students: [],
    total_students: "",
    total_installments: "",
    total_first_installment: "",
    total_second_installment: "",
    total_third_installment: "",
    total_forth_installment: "",
    total_remaining: "",
    page: 1,
  });

  const [searchType, setSearchType] = useState("0");
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [searchState, setSearchState] = useState("0");
  const [loading, setLoading] = useState(true);

  const getStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/students`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseData = await response.json();
      let ss =
        JSON.parse(localStorage.getItem("token")).super == 1
          ? responseData.students
          : responseData.students.filter((student) => {
              return JSON.parse(localStorage.getItem("token"))
                .authority.map((auth) => {
                  return auth.id;
                })
                .includes(student.state.id);
            });
      let total_installments = 0;
      let total_first_installment = 0;
      let total_second_installment = 0;
      let total_third_installment = 0;
      let total_forth_installment = 0;
      let total_remaining = 0;
      ss.map((s) => {
        if (s.governorate) {
          s["governorate_v"] = s.governorate.name;
        }
        if (s.branch) {
          s["branch_v"] = s.branch.name;
        }
        if (s.institute) {
          s["institute_v"] = s.institute.name;
        }
        if (s.poster) {
          s["poster_v"] = s.poster.name;
        }
        if (s.installments[0]) {
          let first_installment = s.installments.filter(
            (install) => install.install_id == 1
          )[0];
          let second_installment = s.installments.filter(
            (install) => install.install_id == 2
          )[0];
          let third_installment = s.installments.filter(
            (install) => install.install_id == 3
          )[0];
          let forth_installment = s.installments.filter(
            (install) => install.install_id == 4
          )[0];
          s["first_installment"] = first_installment.amount;
          s["second_installment"] = second_installment.amount;
          s["third_installment"] = third_installment.amount;
          s["forth_installment"] = forth_installment.amount;
          total_installments += s.total_amount;
          total_first_installment += first_installment.amount;
          total_second_installment += second_installment.amount;
          total_third_installment += third_installment.amount;
          total_forth_installment += forth_installment.amount;
          total_remaining += s.remaining_amount;
        } else {
          console.log(s.name);
        }
      });

      setData({
        students: ss.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }),
        total_installments,
        total_first_installment,
        total_second_installment,
        total_third_installment,
        total_forth_installment,
        total_remaining,
        page: 1,
      });
      setSearchedData({
        students: ss.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }),
        total_installments,
        total_first_installment,
        total_second_installment,
        total_third_installment,
        total_forth_installment,
        total_remaining,
        page: 1,
      });
      setLoading(false);
      ss = [];
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getStudents();
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

  const handleStateChange = (e) => {
    let total_installments = 0;
    let total_first_installment = 0;
    let total_second_installment = 0;
    let total_third_installment = 0;
    let total_forth_installment = 0;
    let total_remaining = 0;
    if (e.target.value != "0") {
      setSearchState(e.target.value);
      setSearchedData({
        ...data,
        students: data.students
          .filter((student) => student.state.id == e.target.value)
          .map((s) => {
            total_installments += s.total_amount;
            total_first_installment += s.installments[0].amount;
            total_second_installment += s.installments[1].amount;
            total_third_installment += s.installments[2].amount;
            total_forth_installment += s.installments[3].amount;
            total_remaining += s.remaining_amount;
            return s;
          }),
        total_installments,
        total_first_installment,
        total_second_installment,
        total_third_installment,
        total_forth_installment,
        total_remaining,
        page: 1,
      });
    } else {
      setSearchState("0");
      setSearchedData(data);
    }
  };

  const handleSearchButton = (e) => {
    e.preventDefault();
    setLoading(true);
    const reg = new RegExp(search1, "i");
    let total_installments = 0;
    let total_first_installment = 0;
    let total_second_installment = 0;
    let total_third_installment = 0;
    let total_forth_installment = 0;
    let total_remaining = 0;
    let ss = data.students;
    ss.map((s) => {
      let first_installment = s.installments.filter(
        (install) => install.install_id == 1
      )[0];
      let second_installment = s.installments.filter(
        (install) => install.install_id == 2
      )[0];
      let third_installment = s.installments.filter(
        (install) => install.install_id == 3
      )[0];
      let forth_installment = s.installments.filter(
        (install) => install.install_id == 4
      )[0];
      s.installments[0] = first_installment;
      s.installments[1] = second_installment;
      s.installments[2] = third_installment;
      s.installments[3] = forth_installment;
    });
    if (searchState != "0") {
      if (searchType == "1") {
        setSearchedData({
          ...data,
          students: ss
            .filter(
              (student) =>
                student.state.id == searchState && student.name.match(reg)
            )
            .map((s) => {
              total_installments += s.total_amount;
              total_first_installment += s.installments[0].amount;
              total_second_installment += s.installments[1].amount;
              total_third_installment += s.installments[2].amount;
              total_forth_installment += s.installments[3].amount;
              total_remaining += s.remaining_amount;
              return s;
            }),
          total_installments,
          total_first_installment,
          total_second_installment,
          total_third_installment,
          total_forth_installment,
          total_remaining,
          page: 1,
        });
      } else if (searchType == "2") {
        setSearchedData({
          ...data,
          students: ss
            .filter(
              (student) =>
                ((student.installments[0].date <= search2 &&
                  student.installments[0].date >= search1) ||
                  (student.installments[1].date <= search2 &&
                    student.installments[1].date >= search1) ||
                  (student.installments[2].date <= search2 &&
                    student.installments[2].date >= search1) ||
                  (student.installments[3].date <= search2 &&
                    student.installments[3].date >= search1)) &&
                student.state.id == searchState
            )
            .map((s) => {
              total_installments += s.total_amount;
              total_first_installment += s.installments[0].amount;
              total_second_installment += s.installments[1].amount;
              total_third_installment += s.installments[2].amount;
              total_forth_installment += s.installments[3].amount;
              total_remaining += s.remaining_amount;
              return s;
            }),
          total_installments,
          total_first_installment,
          total_second_installment,
          total_third_installment,
          total_forth_installment,
          total_remaining,
          page: 1,
        });
      } else if (searchType == "3") {
        setSearchedData({
          ...data,
          students: ss
            .filter(
              (student) =>
                ((student.installments[0].invoice <= search2 &&
                  student.installments[0].invoice >= search1) ||
                  (student.installments[1].invoice <= search2 &&
                    student.installments[1].invoice >= search1) ||
                  (student.installments[2].invoice <= search2 &&
                    student.installments[2].invoice >= search1) ||
                  (student.installments[3].invoice <= search2 &&
                    student.installments[3].invoice >= search1)) &&
                student.state.id == searchState
            )
            .map((s) => {
              total_installments += s.total_amount;
              total_first_installment += s.installments[0].amount;
              total_second_installment += s.installments[1].amount;
              total_third_installment += s.installments[2].amount;
              total_forth_installment += s.installments[3].amount;
              total_remaining += s.remaining_amount;
              return s;
            }),
          total_installments,
          total_first_installment,
          total_second_installment,
          total_third_installment,
          total_forth_installment,
          total_remaining,
          page: 1,
        });
      }
    } else {
      if (searchType == "1") {
        setSearchedData({
          ...data,
          students: ss
            .filter((student) => student.name.match(reg))
            .map((s) => {
              total_installments += s.total_amount;
              total_first_installment += s.installments[0].amount;
              total_second_installment += s.installments[1].amount;
              total_third_installment += s.installments[2].amount;
              total_forth_installment += s.installments[3].amount;
              total_remaining += s.remaining_amount;
              return s;
            }),
          total_installments,
          total_first_installment,
          total_second_installment,
          total_third_installment,
          total_forth_installment,
          total_remaining,
          page: 1,
        });
      } else if (searchType == "2") {
        setSearchedData({
          ...data,
          students: ss
            .filter(
              (student) =>
                (student.installments[0].date <= search2 &&
                  student.installments[0].date >= search1) ||
                (student.installments[1].date <= search2 &&
                  student.installments[1].date >= search1) ||
                (student.installments[2].date <= search2 &&
                  student.installments[2].date >= search1) ||
                (student.installments[3].date <= search2 &&
                  student.installments[3].date >= search1)
            )
            .map((s) => {
              total_installments += s.total_amount;
              total_first_installment += s.installments[0].amount;
              total_second_installment += s.installments[1].amount;
              total_third_installment += s.installments[2].amount;
              total_forth_installment += s.installments[3].amount;
              total_remaining += s.remaining_amount;
              return s;
            }),
          total_installments,
          total_first_installment,
          total_second_installment,
          total_third_installment,
          total_forth_installment,
          total_remaining,
          page: 1,
        });
      } else if (searchType == "3") {
        setSearchedData({
          ...data,
          students: ss
            .filter(
              (student) =>
                (student.installments[0].invoice <= search2 &&
                  student.installments[0].invoice >= search1) ||
                (student.installments[1].invoice <= search2 &&
                  student.installments[1].invoice >= search1) ||
                (student.installments[2].invoice <= search2 &&
                  student.installments[2].invoice >= search1) ||
                (student.installments[3].invoice <= search2 &&
                  student.installments[3].invoice >= search1)
            )
            .map((s) => {
              total_installments += s.total_amount;
              total_first_installment += s.installments[0].amount;
              total_second_installment += s.installments[1].amount;
              total_third_installment += s.installments[2].amount;
              total_forth_installment += s.installments[3].amount;
              total_remaining += s.remaining_amount;
              return s;
            }),
          total_installments,
          total_first_installment,
          total_second_installment,
          total_third_installment,
          total_forth_installment,
          total_remaining,
          page: 1,
        });
      }
    }
    setLoading(false);
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
          <div className="col-5 offset-2 col-md-3 offset-md-0 order-0 order-md-2 position-relative">
            <input
              type="date"
              className="form-control text"
              id="searchDate"
              onChange={handleSearch1Change}
            ></input>
          </div>
          <p
            className="col-2 col-md-1 order-1 order-md-3"
            style={{ fontSize: "20px" }}
          >
            من
          </p>
          <div className="col-5 offset-5 col-md-3 offset-md-0 order-2 order-md-0 position-relative">
            <input
              type="date"
              className="form-control text"
              id="searchDate"
              onChange={handleSearch2Change}
            ></input>
          </div>
          <p
            className="col-2 col-md-1 order-3 order-md-1"
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
              type="number"
              className="form-control text"
              id="searchDate"
              onChange={handleSearch1Change}
            ></input>
          </div>
          <p
            className="col-2 col-md-1 order-1 order-md-3"
            style={{ fontSize: "20px" }}
          >
            من
          </p>
          <div className="col-5 offset-5 col-md-3 offset-md-0 order-2 order-md-0">
            <input
              type="number"
              className="form-control text"
              id="searchDate"
              onChange={handleSearch2Change}
            ></input>
          </div>
          <p
            className="col-2 col-md-1 order-3 order-md-1"
            style={{ fontSize: "20px" }}
          >
            الى
          </p>
        </Fragment>
      );
    }
  };

  const render_table = () => {
    let render_data = [];
    if (searchType != "0" || searchState != "0") {
      render_data = searchedData.students
        .slice(0, searchedData.page * 100)
        .map((student, index) => {
          if (student.installments[0]) {
            return (
              <tr key={student.id} className="font-weight-bold">
                <td className="">{index + 1}</td>
                <td className="">{student.name}</td>
                <td className="">{student.school}</td>
                <td className="">{student.governorate_v}</td>
                <td className="">{student.institute_v}</td>
                <td className="">{student.poster_v}</td>
                <td className="">{student.code_1}</td>
                <td className="">{student.code_2}</td>
                <td className="">{student.total_amount}</td>
                <td className="">{student.first_installment}</td>
                <td className="">{student.second_installment}</td>
                <td className="">{student.third_installment}</td>
                <td className="">{student.forth_installment}</td>
                <td className="">{student.remaining_amount}</td>
                <td className="">{student.note}</td>
              </tr>
            );
          } else {
            return <></>;
          }
        });
    } else {
      render_data = data.students
        .slice(0, data.page * 100)
        .map((student, index) => {
          if (student.installments[0]) {
            return (
              <tr key={student.id} className="font-weight-bold">
                <td className="">{index + 1}</td>
                <td className="">{student.name}</td>
                <td className="">{student.school}</td>
                <td className="">{student.governorate_v}</td>
                <td className="">{student.institute_v}</td>
                <td className="">{student.poster_v}</td>
                <td className="">{student.code_1}</td>
                <td className="">{student.code_2}</td>
                <td className="">{student.total_amount}</td>
                <td className="">{student.first_installment}</td>
                <td className="">{student.second_installment}</td>
                <td className="">{student.third_installment}</td>
                <td className="">{student.forth_installment}</td>
                <td className="">{student.remaining_amount}</td>
                <td className="">{student.note}</td>
              </tr>
            );
          } else {
            return <></>;
          }
        });
    }
    return (
      <table
        className="table table-striped table-bordered table-hover text"
        dir="rtl"
        border="1"
        id="print-table"
      >
        <thead className="thead-dark">
          <tr className="">
            <th className="">ت</th>
            <th className="">الاسم</th>
            <th className="">المدرسة</th>
            <th className="">المحافظة</th>
            <th className="">المعهد</th>
            <th className="">ملصق</th>
            <th className="">الكود الاول</th>
            <th className="">الكود الثاني</th>
            <th className="">المبلغ الكلي</th>
            <th className="">القسط الاول</th>
            <th className="">القسط الثاني</th>
            <th className="">القسط الثالث</th>
            <th className="">القسط الرابع</th>
            <th className="">المبلغ المتبقي</th>
            <th className="">الملاحظات</th>
          </tr>
        </thead>
        <tbody>{render_data}</tbody>
      </table>
    );
  };

  return (
    <section className="">
      <div className="row pt-5 m-0">
        <div
          className={
            sideBarShow
              ? "width-others-wide mr-auto main-view"
              : "width-others-narrow mr-auto main-view"
          }
          id="main-view"
        >
          <div className="row mt-3">
            <div className="col-12">
              <h4 className="text-center">التقارير</h4>
            </div>
          </div>
          <div className="row pt-md-3 pr-2 pl-2 mb-5">
            <div className="col-12">
              <div className="row">
                <div className="col-9">
                  <form onSubmit={handleSearchButton}>
                    <div className="form-group row">
                      <div className="col-2 text">
                        <button type="submit" className="btn btn-secondary">
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
                <div className="col-1">
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-secondary"
                    table="print-table"
                    filename="الاقساط"
                    sheet="الاقساط"
                    buttonText="طباعة"
                  />
                </div>
                <div className="col-1">
                  <select
                    id="state"
                    onChange={handleStateChange}
                    className="form-select"
                    dir="rtl"
                    value={searchState}
                  >
                    <option value="0" defaultValue>
                      كل المناطق
                    </option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12" dir="rtl">
              <div className="row">
                <div className="col-2">
                  <div className="row">
                    <label
                      htmlFor="total_installments"
                      className="form-label text-center col-6"
                    >
                      المجموع الكلي للأقساط
                    </label>
                    <div className="col-6 mt-1">
                      <input
                        id="total_installments"
                        className="form-control"
                        type="text"
                        value={
                          searchType != "0" || searchState != "0"
                            ? searchedData.total_installments
                            : data.total_installments
                        }
                        aria-label="readonly input example"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <div className="row">
                    <label
                      htmlFor="total_first_installment"
                      className="form-label text-center col-6"
                    >
                      مجموع القسط الأول
                    </label>
                    <div className="col-6 mt-1">
                      <input
                        id="total_first_installment"
                        className="form-control"
                        type="text"
                        value={
                          searchType != "0" || searchState != "0"
                            ? searchedData.total_first_installment
                            : data.total_first_installment
                        }
                        aria-label="readonly input example"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <div className="row">
                    <label
                      htmlFor="total_second_installment"
                      className="form-label text-center col-6"
                    >
                      مجموع القسط الثاني
                    </label>
                    <div className="col-6 mt-1">
                      <input
                        id="total_second_installment"
                        className="form-control"
                        type="text"
                        value={
                          searchType != "0" || searchState != "0"
                            ? searchedData.total_second_installment
                            : data.total_second_installment
                        }
                        aria-label="readonly input example"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <div className="row">
                    <label
                      htmlFor="total_third_installment"
                      className="form-label text-center col-6"
                    >
                      مجموع القسط الثالث
                    </label>
                    <div className="col-6 mt-1">
                      <input
                        id="total_third_installment"
                        className="form-control"
                        type="text"
                        value={
                          searchType != "0" || searchState != "0"
                            ? searchedData.total_third_installment
                            : data.total_third_installment
                        }
                        aria-label="readonly input example"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <div className="row">
                    <label
                      htmlFor="total_forth_installment"
                      className="form-label text-center col-6"
                    >
                      مجموع القسط الرابع
                    </label>
                    <div className="col-6 mt-1">
                      <input
                        id="total_forth_installment"
                        className="form-control"
                        type="text"
                        value={
                          searchType != "0" || searchState != "0"
                            ? searchedData.total_forth_installment
                            : data.total_forth_installment
                        }
                        aria-label="readonly input example"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <div className="row">
                    <label
                      htmlFor="total_remaining"
                      className="form-label text-center pt-2 col-6"
                    >
                      مجموع المتبقي
                    </label>
                    <div className="col-6 mt-1">
                      <input
                        id="total_remaining"
                        className="form-control"
                        type="text"
                        value={
                          searchType != "0" || searchState != "0"
                            ? searchedData.total_remaining
                            : data.total_remaining
                        }
                        aria-label="readonly input example"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12" dir="rtl">
              {loading ? (
                <Loading />
              ) : (
                <InfiniteScroll
                  dataLength={
                    searchType != "0" || searchState != "0"
                      ? searchedData.page * 100
                      : data.page * 100
                  } //This is important field to render the next data
                  next={() =>
                    searchType != "0" || searchState != "0"
                      ? setSearchedData({
                          ...searchedData,
                          page: searchedData.page + 1,
                        })
                      : setData({ ...data, page: data.page + 1 })
                  }
                  hasMore={
                    searchType != "0" || searchState != "0"
                      ? searchedData.students.slice(0, searchedData.page * 100)
                          .length != searchedData.students.length
                      : data.students.slice(0, data.page * 100).length !=
                        data.students.length
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
