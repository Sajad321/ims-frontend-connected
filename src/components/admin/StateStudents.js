import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import InfiniteScroll from "react-infinite-scroll-component";
import ConfirmModal from "../common/ConfirmModal";

const apiUrl = process.env.API_URL;

function Students({
  sideBarShow,
  selectedState,
  add,
  edit,
  setSyncOp,
  syncOp,
}) {
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    id: "",
  });
  const [data, setData] = useState({
    students: [],
    total_students: "",
    page: 1,
  });
  const [searchedData, setSearchedData] = useState({
    students: [],
    total_students: "",
    page: 1,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getStudents = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/states/${selectedState.id}/students`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        }
      );

      const responseData = await response.json();

      responseData.students.map((s) => {
        if (s.governorate) {
          s["governorate_id"] = s.governorate.id;
          s["governorate_v"] = s.governorate.name;
        }
        if (s.branch) {
          s["branch_id"] = s.branch.id;
          s["branch_v"] = s.branch.name;
        }
        if (s.institute) {
          s["institute_id"] = s.institute.id;
          s["institute_v"] = s.institute.name;
        }
        if (s.poster) {
          s["poster_id"] = s.poster.id;
          s["poster_v"] = s.poster.name;
        }
        s["state_id"] = s.state.id;
        s["first_installment"] = s.installments[0].amount;
        s["second_installment"] = s.installments[1].amount;
        s["third_installment"] = s.installments[2].amount;
        s["forth_installment"] = s.installments[3].amount;
      });

      setData({
        students: responseData.students.filter(
          (s) => s.state.id == selectedState.id
        ),
        page: 1,
      });
      setSearchedData({
        students: responseData.students.filter(
          (s) => s.state.id == selectedState.id
        ),
        page: 1,
      });
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearchButton = (e) => {
    e.preventDefault();
    setLoading(true);
    const reg = new RegExp(search, "i");
    setSearchedData({
      ...data,
      students: data.students.filter((student) => student.name.match(reg)),
    });
    setLoading(false);
  };

  const handleEditButton = (student) => {
    edit({ ...student });
  };

  const handleDelete = (id) => {
    let searchedIndex = [...searchedData.students].findIndex((i) => i.id == id);
    let neeSerached = [...searchedData.students];
    neeSerached = neeSerached.filter((s, i) => i != searchedIndex);
    setSearchedData({ ...searchedData, students: neeSerached });
    let index = [...data.students].findIndex((i) => i.id == id);
    let nee = [...data.students];
    nee = nee.filter((s, i) => i != index);
    setData({ ...data, students: nee });
  };

  const handleDeleteButton = (id) => {
    const handleStudentDelete = async () => {
      try {
        const response = await fetch(`${apiUrl}/students/${Number(id)}`, {
          method: "DELETE",
        });

        const responseData = await response.json();
      } catch (error) {
        console.log(error.message);
        toast.warn("حصل خطأ");
      }
    };
    handleStudentDelete();
    handleDelete(id);
    setSyncOp({ ...syncOp, showSync: true });
    toast.success("تم حذف الطالب");
  };

  const deleteStudent = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/students/${id}`, {
        method: "DELETE",
      });
      const responseData = await response.json();

      toast.success("تم حذف الطالب");
      getStudents();
    } catch (error) {
      console.log(error.message);
      toast.error("فشل الحذف");
    }
  };
  const render_table = () => {
    let render_data = [];
    if (search != "") {
      render_data = searchedData.students
        .slice(0, searchedData.page * 100)
        .map((student, index) => {
          return (
            <tr
              key={student.id}
              className="font-weight-bold"
              onClick={() => handleEditButton(student)}
            >
              <td className="">{index + 1}</td>
              <td className="">{student.name}</td>
              <td className="">{student.school}</td>
              <td className="">{student.governorate_v}</td>
              <td className="">{student.institute_v}</td>
              <td className="">{student.branch_v}</td>
              <td className="">{student.first_phone}</td>
              <td className="">{student.second_phone}</td>
              <td className="">{student.telegram_username}</td>
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
              <td className="">
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmModal({
                      ...confirmModal,
                      show: true,
                      id: student.id,
                    });
                  }}
                >
                  حذف
                </button>
              </td>
            </tr>
          );
        });
    } else {
      render_data = data.students
        .slice(0, data.page * 100)
        .map((student, index) => {
          return (
            <tr
              key={student.id}
              className="font-weight-bold"
              onClick={() => handleEditButton(student)}
            >
              <td className="">{index + 1}</td>
              <td className="">{student.name}</td>
              <td className="">{student.school}</td>
              <td className="">{student.governorate_v}</td>
              <td className="">{student.institute_v}</td>
              <td className="">{student.branch_v}</td>
              <td className="">{student.first_phone}</td>
              <td className="">{student.second_phone}</td>
              <td className="">{student.telegram_username}</td>
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
              <td className="">
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmModal({
                      ...confirmModal,
                      show: true,
                      id: student.id,
                    });
                  }}
                >
                  حذف
                </button>
              </td>
            </tr>
          );
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
            <th className="">الفرع</th>
            <th className="">رقم الهاتف الاول</th>
            <th className="">رقم الهاتف الثاني</th>
            <th className="">المعرف</th>
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
            <th className="">الاجراء</th>
          </tr>
        </thead>
        <tbody>{render_data}</tbody>
      </table>
    );
  };
  return (
    <section className="">
      <div className="row pt-5 m-0">
        <ConfirmModal
          show={confirmModal.show}
          onHide={() =>
            setConfirmModal({
              ...confirmModal,
              show: false,
              id: "",
            })
          }
          confirm={handleDeleteButton}
          id={confirmModal.id}
        />
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
              <h4 className="text-center">الطلاب</h4>
            </div>
          </div>
          <div className="row pr-2 pl-2 mb-5">
            <div className="col-12 mb-2">
              <form onSubmit={handleSearchButton}>
                <div className="form-group row justify-content-center m-1 ">
                  <div className="col-1 text">
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={add}
                    >
                      اضافة
                    </button>
                  </div>
                  <div className="col-1 text">
                    <button type="submit" className="btn btn-secondary">
                      ابحث
                    </button>
                  </div>
                  <div className="col-5">
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

            <div className="col-12" dir="rtl">
              {loading ? (
                <Loading />
              ) : (
                <InfiniteScroll
                  dataLength={
                    search != "" ? searchedData.page * 100 : data.page * 100
                  } //This is important field to render the next data
                  next={() =>
                    search != ""
                      ? setSearchedData({
                          ...searchedData,
                          page: searchedData.page + 1,
                        })
                      : setData({ ...data, page: data.page + 1 })
                  }
                  hasMore={
                    search != ""
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

export default Students;
