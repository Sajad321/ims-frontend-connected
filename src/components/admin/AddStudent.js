import React, { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
const apiUrl = process.env.API_URL;

function AddStudent({ page, dataToChange, sideBarShow }) {
  const [dataToSend, setDataToSend] = useState({
    id: "",
    name: "",
    school: "",
    governorate_id: "",
    branch_id: "",
    institute: "",
    poster_id: "",
    code: "",
    confirmatory_code: "",
    telegram_username: "",
    first_phone: "",
    second_phone: "",
    total_amount: "",
    installments: [
      {
        id: 1,
        date: null,
        amount: "",
        invoice: "",
        installment_id: 1,
        installment_name: "القسط الاول",
      },
      {
        id: 2,
        date: null,
        amount: "",
        invoice: "",
        installment_id: 2,
        installment_name: "القسط الثاني",
      },
    ],
    remaining_amount: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [governorates, setGovenorates] = useState([]);
  const [branches, setBranches] = useState([]);
  const [posters, setPosters] = useState([]);
  useEffect(() => {
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
    getPosters();
    if (Object.keys(dataToChange).length != 0) {
      setDataToSend(dataToChange);
    }
  }, []);
  const handleNameChange = (e) =>
    setDataToSend({ ...dataToSend, name: e.target.value });
  const handleSchoolChange = (e) => {
    setDataToSend({ ...dataToSend, school: e.target.value });
  };
  const handleBranchChange = (e) => {
    setDataToSend({ ...dataToSend, branch_id: e.target.value });
  };
  const handleGovernorateChange = (e) => {
    setDataToSend({ ...dataToSend, governorate: e.target.value });
  };
  const handleInstituteChange = (e) => {
    setDataToSend({ ...dataToSend, institute: e.target.value });
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
  const handleCodeChange = (e) =>
    setDataToSend({ ...dataToSend, code: e.target.value });
  const handleCodeCoChange = (e) =>
    setDataToSend({ ...dataToSend, confirmatory_code: e.target.value });
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
      total -= e.target.value;
    }
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
  const handleInstallmentDateChange = (e, index) => {
    const installments = [...dataToSend.installments];
    installments[index].date = e.target.value;
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
      const response = await fetch(`${apiUrl}/students`, {
        method: dataToSend.id != "" ? "PATCH" : "POST",

        body: dataToSend,
      });
      const responseData = await response.json();

      toast.success("تم حفظ الطالب");
      page();
    } catch (error) {
      console.log(error.message);
      setSaving(false);
      toast.error("فشل الحفظ");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    saveStudent();
  };
  return (
    <section className="">
      <div className="row padding-form m-0">
        <div
          className={
            sideBarShow
              ? "width-others-wide mr-auto main-view"
              : "width-others-narrow mr-auto main-view"
          }
          id="main-view"
        >
          <div className="row pt-md-3 pr-2 pl-2 mt-md-3 mb-5 text-white">
            <div className="col-8 p-2 offset-3">
              <form onSubmit={handleSubmit}>
                <div className="mb-3 row">
                  <div className="col-7 offset-1">
                    <input
                      id="name"
                      type="text"
                      placeholder="الاسم"
                      className="form-control text"
                      onChange={handleNameChange}
                      value={dataToSend.name}
                      required
                    ></input>
                  </div>
                  <label
                    htmlFor="name"
                    className="col-2 form-label text-center bg-danger p-2"
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
                    ></input>
                  </div>
                  <label
                    htmlFor="school"
                    className="col-2 form-label text-center bg-warning  p-2"
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
                    className="col-2 form-label text-center bg-success p-2"
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
                    className="col-2 form-label text-center bg-info p-2"
                  >
                    المحافظة
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-7 offset-1">
                    <input
                      id="institute"
                      type="text"
                      placeholder="المعهد"
                      onChange={handleInstituteChange}
                      className="form-control text"
                      value={dataToSend.institute}
                    ></input>
                  </div>
                  <label
                    htmlFor="institute"
                    className="col-2 form-label text-center bg-secondary p-2"
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
                        ></input>
                      </div>
                    </div>
                  </div>
                  <label
                    htmlFor="phone"
                    className="col-2 form-label text-center bg-danger p-2"
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
                      <option selected>اختر</option>
                      {posters.map((poster) => (
                        <option key={poster.id} value={poster.id}>
                          {poster.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label
                    htmlFor="poster"
                    className="col-2 form-label text-center bg-dark p-2"
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
                          placeholder="تأكيد الكود"
                          onChange={handleCodeChange}
                          className="form-control text"
                          value={dataToSend.code}
                        ></input>
                      </div>
                      <div className="col-4">
                        <input
                          id="code"
                          type="text"
                          placeholder="الكود"
                          onChange={handleCodeCoChange}
                          className="form-control text"
                          value={dataToSend.confirmatory_code}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <label
                    htmlFor="code"
                    className="col-2 form-label text-center bg-primary p-2"
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
                    className="col-2 form-label text-center bg-warning p-2"
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
                    ></input>
                  </div>
                  <label
                    htmlFor="total_amount"
                    className="col-2 form-label text-center bg-info p-2"
                  >
                    المبلغ الكلي
                  </label>
                </div>

                {dataToSend.installments.map((installment, index) => {
                  return (
                    <div className="mb-3 row" key={installment.id}>
                      <div className="col-7 offset-1">
                        <div className="row">
                          <div className="col-4 position-relative">
                            <input
                              id={`${installment.installment_name}-date`}
                              type="date"
                              onChange={(e) =>
                                handleInstallmentDateChange(e, index)
                              }
                              className="form-control text"
                              value={dataToSend.date}
                            ></input>
                          </div>
                          <label
                            htmlFor={`${installment.installment_name}-date`}
                            className="col-2 form-label text-center bg-success p-2"
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
                              value={dataToSend.invoice}
                            ></input>
                          </div>
                          <label
                            htmlFor={`${installment.installment_name}-invoice`}
                            className="col-2 form-label text-center bg-success p-2"
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
                        className="col-2 form-label text-center bg-success p-2"
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
                    className="col-2 form-label text-center bg-secondary p-2"
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
                    className="col-2 form-label text-center bg-danger p-2"
                  >
                    الملاحظات
                  </label>
                </div>

                <div className="mb-3 row">
                  <div className="col-2 offset-3 mt-3">
                    <button className="btn btn-danger btn-block w-100">
                      الغاء
                    </button>
                  </div>
                  <div className="col-2 mt-3">
                    {!saving ? (
                      <button
                        type="submit"
                        className="btn btn-success btn-block w-100"
                      >
                        حفظ الطالب
                      </button>
                    ) : (
                      <button
                        disabled
                        className="btn btn-success btn-block w-100"
                      >
                        يتم الارسال
                      </button>
                    )}
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
