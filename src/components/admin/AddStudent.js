import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import SavingModal from "../common/SavingModal";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
const apiUrl = process.env.API_URL;

function AddStudent({
  page,
  dataToChange,
  sideBarShow,
  selectedState,
  handleStateStudentsButton,
  students,
  getStudents,
  setSyncOp,
  syncOP,
}) {
  function pad(x, width = 2, char = "0") {
    return String(x).padStart(width, char);
  }
  function toLocalISOString(dt) {
    const offset = dt.getTimezoneOffset();
    const absOffset = Math.abs(offset);
    const offHours = Math.floor(absOffset / 60);
    const offStr = pad(offHours) + ":" + pad(absOffset - offHours * 60);
    return [
      String(dt.getFullYear()),
      "-",
      pad(dt.getMonth() + 1),
      "-",
      pad(dt.getDate()),
      "T",
      pad(dt.getHours()),
      ":",
      pad(dt.getMinutes()),
      ":",
      pad(dt.getSeconds()),
      ".",
      dt.getMilliseconds(),
      offset <= 0 ? "+" : "-",
      offStr,
    ].join("");
  }

  const [date, setDate] = useState(toLocalISOString(new Date()).slice(0, 10));
  const [savingModal, setSavingModal] = useState({
    show: false,
  });
  const [dataToSend, setDataToSend] = useState({
    id: "",
    name: "",
    school: "",
    state_id: selectedState.id,
    governorate_id: 1,
    branch_id: 1,
    institute_id: "",
    poster_id: null,
    code_1: null,
    code_2: null,
    telegram_username: null,
    first_phone: null,
    second_phone: null,
    total_amount: "",
    installments: [
      {
        install_id: 1,
        date: date,
        amount: null,
        invoice: null,
        installment_name: "القسط الاول",
      },
      {
        install_id: 2,
        date: date,
        amount: null,
        invoice: null,
        installment_name: "القسط الثاني",
      },
      {
        install_id: 3,
        date: date,
        amount: null,
        invoice: null,
        installment_name: "القسط الثالث",
      },
      {
        install_id: 4,
        date: date,
        amount: null,
        invoice: null,
        installment_name: "القسط الرابع",
      },
    ],
    remaining_amount: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [governorates, setGovenorates] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [posters, setPosters] = useState([]);
  const [searched, setSearched] = useState([]);
  const [search, setSearch] = useState(false);
  useEffect(() => {
    const getInstitutes = async () => {
      try {
        const response = await fetch(`${apiUrl}/institutes`, {
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
    const getGovenorates = async () => {
      try {
        const response = await fetch(`${apiUrl}/governorates`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });

        const responseData = await response.json();
        setGovenorates(responseData.governorates);
      } catch (error) {
        console.log(error.message);
      }
    };
    const getBranches = async () => {
      try {
        const response = await fetch(`${apiUrl}/branches`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });

        const responseData = await response.json();
        setBranches(responseData.branches);
      } catch (error) {
        console.log(error.message);
      }
    };
    const getPosters = async () => {
      try {
        const response = await fetch(`${apiUrl}/posters`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });

        const responseData = await response.json();
        setPosters(responseData.posters);
      } catch (error) {
        console.log(error.message);
      }
    };
    getGovenorates();
    getBranches();
    getInstitutes();
    getPosters();
    setSearched(students.slice(0, 100));
    if (Object.keys(dataToChange).length != 0) {
      setDataToSend(dataToChange);
    }
  }, []);
  const handleNameChange = (e) => {
    setDataToSend({ ...dataToSend, name: e.target.value });
    const reg = new RegExp(e.target.value, "i");
    setSearched(
      students.filter((student) => student.name.match(reg)).slice(0, 100)
    );
  };
  const handleSchoolChange = (e) => {
    setDataToSend({ ...dataToSend, school: e.target.value });
  };
  const handleBranchChange = (e) => {
    setDataToSend({ ...dataToSend, branch_id: e.target.value });
  };
  const handleGovernorateChange = (e) => {
    setDataToSend({ ...dataToSend, governorate_id: e.target.value });
  };
  const handleInstituteChange = (e) => {
    setDataToSend({ ...dataToSend, institute_id: e.target.value });
  };
  const handleFirstPhoneChange = (e) =>
    setDataToSend({
      ...dataToSend,
      first_phone: e.target.value,
    });
  const handleSecondPhoneChange = (e) =>
    setDataToSend({
      ...dataToSend,
      second_phone: e.target.value,
    });
  const handlePosterChange = (e) => {
    setDataToSend({ ...dataToSend, poster_id: e.target.value });
  };
  const handleCode1Change = (e) =>
    setDataToSend({ ...dataToSend, code_1: e.target.value });
  const handleCode2Change = (e) =>
    setDataToSend({ ...dataToSend, code_2: e.target.value });
  const handleTelegramChange = (e) =>
    setDataToSend({ ...dataToSend, telegram_username: e.target.value });
  const handleTotalAmountChange = (e) => {
    let total = e.target.value;
    for (let i = 0; i < dataToSend.installments.length; i++) {
      total -= dataToSend.installments[i].amount;
    }
    if (total < 0) {
      setDataToSend({
        ...dataToSend,
        total_amount: e.target.value,
        remaining_amount: 0,
      });
    } else {
      setDataToSend({
        ...dataToSend,
        total_amount: e.target.value,
        remaining_amount: total,
      });
    }
  };
  const handleInstallmentAmountChange = (e, index) => {
    const installments = [...dataToSend.installments];
    installments[index].amount = e.target.value;
    let total = dataToSend.total_amount;
    for (let i = 0; i < dataToSend.installments.length; i++) {
      total -= dataToSend.installments[i].amount;
    }
    // total -= e.target.value;
    if (total < 0) {
      setDataToSend({
        ...dataToSend,
        installments,
        remaining_amount: 0,
      });
    } else {
      setDataToSend({
        ...dataToSend,
        installments,
        remaining_amount: total,
      });
    }
  };
  const handleInstallmentInvoiceChange = (e, index) => {
    const installments = [...dataToSend.installments];
    installments[index].invoice = e.target.value;
    setDataToSend({
      ...dataToSend,
      installments,
    });
  };
  const handleInstallmentDateChange = (date, index) => {
    const installments = [...dataToSend.installments];
    installments[index].date = toLocalISOString(date).slice(0, 10);
    setDataToSend({
      ...dataToSend,
      installments,
    });
  };
  const handleNoteChange = (e) =>
    setDataToSend({ ...dataToSend, note: e.target.value });

  const saveStudent = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `${apiUrl}/students${dataToSend.id != "" ? `/` + dataToSend.id : ""}`,
        {
          method: dataToSend.id != "" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },

          body: JSON.stringify(dataToSend),
        }
      );
      const responseData = await response.json();
      if (responseData.detail) {
        throw new Error(responseData.status);
      }

      toast.success("تم حفظ الطالب");
      setSyncOp({ ...syncOP, showSync: true });
      handleStateStudentsButton();
    } catch (error) {
      console.log(error.message);
      setSaving(false);
      toast.error("فشل الحفظ");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    saveStudent();
    getStudents();
  };
  return (
    <section className="">
      <div className="row pt-5 mt-4 m-0">
        <SavingModal
          show={savingModal.show}
          onHide={() =>
            setSavingModal({
              ...savingModal,
              show: false,
            })
          }
          save={saveStudent}
          page={handleStateStudentsButton}
        />
        <div
          className={
            sideBarShow
              ? "width-others-wide mr-auto main-view"
              : "width-others-narrow mr-auto main-view"
          }
          id="main-view"
        >
          <div className="d-flex w-100" dir="rtl">
            <div className="col-2">
              <button
                className="btn btn-secondary w-100"
                onClick={() =>
                  setSavingModal({
                    ...savingModal,
                    show: true,
                  })
                }
              >
                <FontAwesomeIcon icon="arrow-right" />
              </button>
            </div>
            <h2 className="col-8 text-center">الطالب</h2>
          </div>
          <div className="row pt-md-3 pr-2 pl-2 mb-5">
            <div className="col-8 p-2 offset-3">
              <form onSubmit={handleSubmit}>
                <div className="mb-3 row position-relative">
                  <div className="col-7 offset-1" dir="rtl">
                    <input
                      id="name"
                      type="text"
                      placeholder="الاسم"
                      className="form-control text"
                      onChange={handleNameChange}
                      value={dataToSend.name}
                      onFocus={() => setSearch(true)}
                      onBlur={() => setSearch(false)}
                      required
                    ></input>
                    {search ? (
                      <div
                        className="position-absolute ms-5 mt-2 pt-2 border-1 border-black border w-50 overflow-auto bg-white"
                        style={{ height: "250px" }}
                      >
                        {searched.map((student) => {
                          return (
                            <p dir="rtl" className="pe-3">
                              {student.name}
                            </p>
                          );
                        })}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <label
                    htmlFor="name"
                    className="col-2 form-label text-center p-2"
                  >
                    اسم الطالب/ة
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-7 offset-1">
                    <input
                      id="school"
                      type="text"
                      placeholder="المدرسة"
                      onChange={handleSchoolChange}
                      className="form-control text"
                      value={dataToSend.school}
                      required
                    ></input>
                  </div>
                  <label
                    htmlFor="school"
                    className="col-2 form-label text-center p-2"
                  >
                    المدرسة
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-7 offset-1">
                    <select
                      id="branch"
                      onChange={handleBranchChange}
                      className="form-select"
                      dir="rtl"
                      value={dataToSend.branch_id}
                      required
                    >
                      <option selected>اختر</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label
                    htmlFor="branch"
                    className="col-2 form-label text-center p-2"
                  >
                    الفرع
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-7 offset-1">
                    <select
                      id="governorate"
                      onChange={handleGovernorateChange}
                      className="form-select"
                      dir="rtl"
                      value={dataToSend.governorate_id}
                      required
                    >
                      <option selected>اختر</option>
                      {governorates.map((governorate) => (
                        <option key={governorate.id} value={governorate.id}>
                          {governorate.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label
                    htmlFor="governorate"
                    className="col-2 form-label text-center p-2"
                  >
                    المحافظة
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-7 offset-1">
                    <select
                      id="institute"
                      onChange={handleInstituteChange}
                      className="form-select"
                      dir="rtl"
                      value={dataToSend.institute_id}
                      required
                    >
                      <option selected>اختر</option>
                      {institutes.map((institute) => (
                        <option key={institute.id} value={institute.id}>
                          {institute.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label
                    htmlFor="institute"
                    className="col-2 form-label text-center p-2"
                  >
                    المعهد
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-6 offset-2">
                    <div className="row">
                      <div className="col-4 offset-4">
                        <input
                          id="phone"
                          type="text"
                          placeholder="الثاني"
                          onChange={handleSecondPhoneChange}
                          className="form-control text"
                          value={dataToSend.second_phone}
                        ></input>
                      </div>
                      <div className="col-4">
                        <input
                          id="phone"
                          type="text"
                          placeholder="الاول"
                          onChange={handleFirstPhoneChange}
                          className="form-control text"
                          value={dataToSend.first_phone}
                          required
                        ></input>
                      </div>
                    </div>
                  </div>
                  <label
                    htmlFor="phone"
                    className="col-2 form-label text-center p-2"
                  >
                    رقم الهاتف
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-7 offset-1">
                    <select
                      id="poster"
                      onChange={handlePosterChange}
                      className="form-select"
                      dir="rtl"
                      value={dataToSend.poster_id}
                      required
                    >
                      <option selected value={0}>
                        بدون
                      </option>
                      {posters.map((poster) => (
                        <option key={poster.id} value={poster.id}>
                          {poster.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label
                    htmlFor="poster"
                    className="col-2 form-label text-center p-2"
                  >
                    الملصق
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-6 offset-2">
                    <div className="row">
                      <div className="col-4 offset-4">
                        <input
                          id="code"
                          type="text"
                          placeholder="الكود الثاني"
                          onChange={handleCode2Change}
                          className="form-control text"
                          value={dataToSend.code_2}
                        ></input>
                      </div>
                      <div className="col-4">
                        <input
                          id="code"
                          type="text"
                          placeholder="الكود الاول"
                          onChange={handleCode1Change}
                          className="form-control text"
                          value={dataToSend.code_1}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <label
                    htmlFor="code"
                    className="col-2 form-label text-center p-2"
                  >
                    الكود
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-7 offset-1">
                    <input
                      id="telegram_username"
                      type="text"
                      placeholder="المعرف"
                      onChange={handleTelegramChange}
                      className="form-control text"
                      value={dataToSend.telegram_username}
                    ></input>
                  </div>
                  <label
                    htmlFor="telegram_username"
                    className="col-2 form-label text-center p-2"
                  >
                    المعرف
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-7 offset-1">
                    <input
                      id="total_amount"
                      type="number"
                      placeholder="0"
                      onChange={handleTotalAmountChange}
                      className="form-control text"
                      value={dataToSend.total_amount}
                      required
                    ></input>
                  </div>
                  <label
                    htmlFor="total_amount"
                    className="col-2 form-label text-center p-2"
                  >
                    المبلغ الكلي
                  </label>
                </div>

                {dataToSend.installments.map((installment, index) => {
                  return (
                    <div className="mb-3 row" key={installment.install_id}>
                      <div className="col-7 offset-1">
                        <div className="row">
                          <div className="col-4 position-relative">
                            <DatePicker
                              id={`${installment.installment_name}-date`}
                              // selected={date}
                              className="form-control text"
                              onChange={(date) =>
                                handleInstallmentDateChange(date, index)
                              }
                              dateFormat="yyyy/MM/dd"
                              value={installment.date}
                            />
                          </div>
                          <label
                            htmlFor={`${installment.installment_name}-date`}
                            className="col-2 form-label text-center p-2"
                          >
                            التاريخ
                          </label>
                          <div className="col-2">
                            <input
                              id={`${installment.installment_name}-invoice`}
                              type="number"
                              placeholder="رقم الوصل"
                              onChange={(e) =>
                                handleInstallmentInvoiceChange(e, index)
                              }
                              className="form-control text"
                              value={installment.invoice}
                            ></input>
                          </div>
                          <label
                            htmlFor={`${installment.installment_name}-invoice`}
                            className="col-2 form-label text-center p-2"
                          >
                            رقم الوصل
                          </label>
                          <div className="col-2">
                            <input
                              id={installment.installment_name}
                              type="number"
                              placeholder="المبلغ"
                              onChange={(e) => {
                                handleInstallmentAmountChange(e, index);
                              }}
                              className="form-control text"
                              value={installment.amount}
                            ></input>
                          </div>
                        </div>
                      </div>
                      <label
                        htmlFor={installment.installment_name}
                        className="col-2 form-label text-center p-2"
                      >
                        {installment.installment_name}
                      </label>
                    </div>
                  );
                })}

                <div className="mb-3 row">
                  <div className="col-7 offset-1">
                    <input
                      id="remaining_amount"
                      type="number"
                      placeholder="0"
                      className="form-control text"
                      value={dataToSend.remaining_amount}
                      disabled
                    ></input>
                  </div>
                  <label
                    htmlFor="remaining_amount"
                    className="col-2 form-label text-center p-2"
                  >
                    المبلغ المتبقي
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-7 offset-1">
                    <textarea
                      class="form-control"
                      id="note"
                      onChange={handleNoteChange}
                      placeholder="الملاحظات"
                      className="form-control text"
                      value={dataToSend.note}
                      rows="3"
                    ></textarea>
                  </div>
                  <label
                    htmlFor="note"
                    className="col-2 form-label text-center p-2"
                  >
                    الملاحظات
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-2 offset-2 mt-3">
                    {!saving ? (
                      <button
                        type="submit"
                        className="btn btn-success btn-block w-100"
                      >
                        {dataToSend.id != "" ? "تحديث" : "حفظ"} الطالب
                      </button>
                    ) : (
                      <button
                        disabled
                        type="button"
                        className="btn btn-success btn-block w-100"
                      >
                        يتم الارسال
                      </button>
                    )}
                  </div>
                  <div className="col-2 offset-1 mt-3">
                    <button
                      type="button"
                      className="btn btn-danger btn-block w-100"
                      onClick={handleStateStudentsButton}
                    >
                      الغاء
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddStudent;
