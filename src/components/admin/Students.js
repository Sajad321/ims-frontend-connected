import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StudentsInfoModal } from "../../common/Modal";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../common/Loading";
const apiUrl = process.env.API_URL;

function Students({ sideBarShow, edit }) {
  const [data, setData] = useState({
    students: [],
    total_students: "",
    page: "",
  });
  const [searchedData, setSearchedData] = useState({
    students: [],
    total_students: "",
    page: "",
  });
  const [institutes, setInstitutes] = useState([]);
  const [searchType, setSearchType] = useState("0");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchInstitute, setSearchInstitute] = useState("0");
  const [studentsInfoModal, setStudentsInfoModal] = useState({
    index: 0,
    visible: false,
    id: "",
    name: "",
    institute: "",
    phone: "",
    dob: "",
    student: {},
    banned: "",
  });
  const [qr, setQr] = useState({});
  const [photo, setPhoto] = useState({});
  const getQr = async (student_id) => {
    try {
      const response = await fetch(`${apiUrl}/qr?student_id=${student_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseQr = await response.blob();
      setQr(new Blob([responseQr], { type: "image/png" }));
    } catch (error) {
      console.log(error.message);
    }
  };
  const getPhoto = async (student_id) => {
    try {
      const response = await fetch(`${apiUrl}/photo?student_id=${student_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responsePhoto = await response.blob();
      setPhoto(new Blob([responsePhoto], { type: "image/jpeg" }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const getStudents = async (page, institute_id = "0") => {
    try {
      let rr = ``;
      if (institute_id != "0") {
        rr = `${apiUrl}/students?page=${page}&institute_id=${institute_id}`;
        if (searchType != "0") {
          rr = `${apiUrl}/students?page=${page}&institute_id=${institute_id}&search=${search}`;
        }
      } else {
        if (searchType != "0") {
          rr = `${apiUrl}/students?page=${page}&search=${search}`;
        }
      }
      const response = await fetch(
        rr != `` ? rr : `${apiUrl}/students?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        }
      );

      const responseData = await response.json();
      if (searchType != "0" || institute_id != "0") {
        if (page == 1) {
          setSearchedData({
            students: responseData.students,
            total_students: responseData.total_students,
            page: responseData.page,
          });
        } else {
          setSearchedData({
            students: data.students.concat(responseData.students),
            total_students: responseData.total_students,
            page: responseData.page,
          });
        }
      } else {
        if (page == 1) {
          setData({
            students: responseData.students,
            total_students: responseData.total_students,
            page: responseData.page,
          });
          setSearchedData({
            students: responseData.students,
            total_students: responseData.total_students,
            page: responseData.page,
          });
        } else {
          setData({
            students: data.students.concat(responseData.students),
            total_students: responseData.total_students,
            page: responseData.page,
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
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
    getStuff();
    getStudents(1);
  }, []);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearchButton = (e) => {
    e.preventDefault();
    setLoading(true);
    getStudents(1, searchInstitute);
  };
  const handleInstituteChange = (e) => {
    if (e.target.value != "0") {
      setSearchInstitute(e.target.value);
      getStudents(1, e.target.value);
    } else {
      setSearchInstitute("0");
    }
  };
  const handleEditButton = (student, photo) => {
    edit({ ...student, photo });
  };
  const handleDelete = (id) => {
    let searchedIndex = [...searchedStudents].findIndex((i) => i.id == id);
    let neeSerached = [...searchedStudents];
    neeSerached = neeSerached.filter((s, i) => i != searchedIndex);
    setSearchedData({ ...searchedData, students: neeSerached });
    let index = [...students].findIndex((i) => i.id == id);
    let nee = [...students];
    nee = nee.filter((s, i) => i != index);
    setData({ ...data, students: nee });
  };
  const handleDeleteButton = (index, id) => {
    const handleStudentDelete = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/student?student_id=${Number(id)}`,
          {
            method: "DELETE",
          }
        );

        const responseData = await response.json();
      } catch (error) {
        console.log(error.message);
        toast.warn("حصل خطأ");
      }
    };
    handleStudentDelete();
    handleDelete(id);
    toast.success("تم حذف الطالب");
  };
  const handleBanningToggle = (studentIndex, banned) => {
    setStudentsInfoModal({ ...studentsInfoModal, banned: banned });
    if ((searchType != "0") | (searchInstitute != "0")) {
      let neeSerached = searchedData.students;
      neeSerached[studentIndex].banned = banned;
      setSearchedData({ ...searchedData, students: neeSerached });
    } else if (searchType == "0") {
      let nee = data.students;
      nee[studentIndex].banned = banned;
      setData({ ...data, students: nee });
    }
  };
  const handleStudentDismiss = async (index, id) => {
    try {
      const response = await fetch(
        `${apiUrl}/banned?student_id=${Number(id)}&ban=${1}`,
        {
          method: "PATCH",
        }
      );

      const responseData = await response.json();
    } catch (error) {
      console.log(error.message);
      toast.warn("حصل خطأ");
    }
    handleBanningToggle(index, 1);
    toast.success("تم فصل الطالب");
  };
  const handleStudentReturn = async (index, id) => {
    try {
      const response = await fetch(
        `${apiUrl}/banned?student_id=${Number(id)}&ban=${0}`,
        {
          method: "PATCH",
        }
      );

      const responseData = await response.json();
    } catch (error) {
      console.log(error.message);
      toast.warn("حصل خطأ");
    }
    handleBanningToggle(index, 0);
    toast.success("تم ارجاع الطالب");
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
              <h5 className="">الطلاب</h5>
            </div>
          </div>
          <div className="row pt-md-2 pr-2 pl-2 mt-md-3 mb-5">
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
                      <div className="col-7">
                        <input
                          type="text"
                          className="form-control text"
                          id="searchStudent"
                          onChange={handleSearchChange}
                          placeholder="ابحث"
                        ></input>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <StudentsInfoModal
              show={studentsInfoModal.visible}
              onHide={() =>
                setStudentsInfoModal({
                  ...studentsInfoModal,
                  visible: false,
                })
              }
              index={studentsInfoModal.index}
              id={studentsInfoModal.id}
              name={studentsInfoModal.name}
              institute={studentsInfoModal.institute}
              phone={studentsInfoModal.phone}
              dob={studentsInfoModal.dob}
              student={studentsInfoModal.student}
              banned={studentsInfoModal.banned}
              qr={qr}
              photo={photo}
              handleEditButton={handleEditButton}
              handleStudentDismiss={handleStudentDismiss}
              handleStudentReturn={handleStudentReturn}
              handleDeleteButton={handleDeleteButton}
            />
            <div className="col-12" dir="rtl">
              <div className="row">
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
                      getStudents(
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
                    {(searchType != "0") | (searchInstitute != "0")
                      ? searchedData.students.map((student, index) => {
                          return (
                            <div
                              className="col-12 p-2 m-0"
                              key={student.id}
                              dir="rtl"
                            >
                              <div className="row m-0">
                                <div
                                  className="col-4 mr-3 ml-3 card card-common card-height"
                                  onClick={() => {
                                    getQr(student.id);
                                    getPhoto(student.id);
                                    setStudentsInfoModal({
                                      ...studentsInfoModal,
                                      index: index,
                                      visible: true,
                                      id: student.id,
                                      name: student.name,
                                      institute: student.institute,
                                      phone: student.phone,
                                      dob: student.dob,
                                      student: student,
                                      banned: student.banned,
                                    });
                                  }}
                                >
                                  <div className="card-body p-3">
                                    <div className="row d-flex align-content-center justify-content-center">
                                      <div className="col-12 text-right text-white">
                                        <p className="mb-0" dir="rtl">
                                          {index + 1} {" - "} {student.name}{" "}
                                          <b style={{ color: "#e30b37" }}>
                                            {student.banned == 1
                                              ? " (مفصول)"
                                              : ""}
                                          </b>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4 card card-common card-height">
                                  <div className="card-body p-3">
                                    <div className="row d-flex align-content-center justify-content-center">
                                      <div className="col-12 text-right text-white">
                                        <p className="mb-0" dir="rtl">
                                          <b>{student.institute}</b>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      : data.students.map((student, index) => {
                          return (
                            <div
                              className="col-12 p-2 m-0"
                              key={student.id}
                              dir="rtl"
                            >
                              <div className="row m-0">
                                <div
                                  className="col-4 mr-3 ml-3 card card-common card-height"
                                  onClick={() => {
                                    getQr(student.id);
                                    getPhoto(student.id);
                                    setStudentsInfoModal({
                                      ...studentsInfoModal,
                                      index: index,
                                      visible: true,
                                      id: student.id,
                                      name: student.name,
                                      institute: student.institute,
                                      phone: student.phone,
                                      dob: student.dob,
                                      student: student,
                                      banned: student.banned,
                                    });
                                  }}
                                >
                                  <div className="card-body p-3">
                                    <div className="row d-flex align-content-center justify-content-center">
                                      <div className="col-12 text-right text-white">
                                        <p className="mb-0" dir="rtl">
                                          {index + 1} {" - "} {student.name}{" "}
                                          <b style={{ color: "#e30b37" }}>
                                            {student.banned == 1
                                              ? " (مفصول)"
                                              : ""}
                                          </b>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4 card card-common card-height">
                                  <div className="card-body p-3">
                                    <div className="row d-flex align-content-center justify-content-center">
                                      <div className="col-12 text-right text-white">
                                        <p className="mb-0" dir="rtl">
                                          <b>{student.institute}</b>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </InfiniteScroll>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Students;
