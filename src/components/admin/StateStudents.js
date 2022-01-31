import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Pagination from "@mui/material/Pagination";
import TablePagination from "@mui/material/TablePagination";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

const apiUrl = process.env.API_URL;

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      dir="ltr"
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

function Students({ sideBarShow, selectedState, add, edit }) {
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "id", headerName: "ت" },
    { field: "name", headerName: "الاسم" },
    { field: "school", headerName: "المدرسة" },
    { field: "governorate_v", headerName: "المحافظة" },
    { field: "branch_v", headerName: "الفرع" },
    { field: "institute_v", headerName: "المعهد" },
    { field: "first_phone", headerName: "رقم الهاتف الاول", flex: 1 },
    { field: "second_phone", headerName: "رقم الهاتف الثاني", flex: 1 },
    { field: "poster_v", headerName: "ملصق" },
    { field: "telegram_username", headerName: "المعرف" },
    { field: "code", headerName: "الكود" },
    { field: "total_amount", headerName: "المبلغ الكلي" },
    { field: "first_installment", headerName: "القسط الاول" },
    { field: "second_installment", headerName: "القسط الثاني" },
    { field: "third_installment", headerName: "القسط الثالث" },
    { field: "forth_installment", headerName: "القسط الرابع" },
    { field: "remaining_amount", headerName: "المبلغ المتبقي" },
    { field: "notes", headerName: "الملاحظات" },
    {
      field: "delete",
      headerName: "الاجراء",
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <button
            className="btn btn-danger"
            onClick={() => handleDeleteButton(params.id)}
          >
            حذف
          </button>
        );
      },
    },
  ];

  const getStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/students`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseData = await response.json();

      responseData.students.map((s) => {
        s["governorate_v"] = s.governorate.name;
        s["branch_v"] = s.branch.name;
        s["institute_v"] = s.institute.name;
        s["poster_v"] = s.poster.name;
        s["first_installment"] = s.installments[0].amount;
        s["second_installment"] = s.installments[1].amount;
        s["third_installment"] = s.installments[2].amount;
        s["forth_installment"] = s.installments[3].amount;
      });

      setData({
        students: responseData.students.filter(
          (s) => s.state.id == selectedState.id
        ),
      });
      setSearchedData({
        students: responseData.students.filter(
          (s) => s.state.id == selectedState.id
        ),
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

  const handleEditButton = (student, photo) => {
    edit({ ...student, photo });
  };

  const handleDelete = (id) => {
    let searchedIndex = [...searchedData.searchedStudents].findIndex(
      (i) => i.id == id
    );
    let neeSerached = [...searchedData.searchedStudents];
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
    toast.success("تم حذف الطالب");
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
          <div className="row mt-2">
            <div className="col-12 top-bg">
              <h5 className="text-end">الطلاب</h5>
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
                <div className="col-1 offset-3 ">
                  <button className="btn btn-primary m-2" onClick={add}>
                    اضافة
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12" dir="rtl">
              <div className="row m-0">
                {loading ? (
                  <Loading />
                ) : (
                  <DataGrid
                    rows={search != "" ? searchedData.students : data.students}
                    columns={columns}
                    pageSize={90}
                    rowsPerPageOptions={[5]}
                    autoHeight={true}
                    disableColumnMenu={true}
                    disableSelectionOnClick={true}
                    disableExtendRowFullWidth={true}
                    components={{ Pagination: CustomPagination }}
                  />
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
