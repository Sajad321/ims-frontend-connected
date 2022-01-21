import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Pagination from "@mui/material/Pagination";
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

const columns = [
  { field: "id", headerName: "ت" },
  { field: "name", headerName: "الاسم" },
  { field: "school", headerName: "المدرسة" },
  { field: "govenorate", headerName: "المحافظة" },
  { field: "branch", headerName: "الفرع" },
  { field: "institute", headerName: "المعهد" },
  { field: "first_phone", headerName: "رقم الهاتف الاول", flex: 1 },
  { field: "second_phone", headerName: "رقم الهاتف الثاني", flex: 1 },
  { field: "poster", headerName: "ملصق" },
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
      return <button className="btn btn-danger">حذف</button>;
    },
  },
];

const rows = [
  { id: 1, name: "Snow", school: "Jon", code: 35 },
  { id: 2, name: "Lannister", school: "Cersei", code: 42 },
  { id: 3, name: "Lannister", school: "Jaime", code: 45 },
  { id: 4, name: "Stark", school: "Arya", code: 16 },
  { id: 5, name: "Targaryen", school: "Daenerys", code: null },
  { id: 6, name: "Melisandre", school: null, code: 150 },
  { id: 7, name: "Clifford", school: "Ferrara", code: 44 },
  { id: 8, name: "Frances", school: "Rossini", code: 36 },
  { id: 9, name: "Roxie", school: "Harvey", code: 65 },
];
function Students({ sideBarShow, add, edit }) {
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
  const [searchType, setSearchType] = useState("0");
  const [search, setSearch] = useState("");
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
      setData({
        students: responseData.students,
      });
      setSearchedData({
        students: responseData.students,
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
                    rows={rows}
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
