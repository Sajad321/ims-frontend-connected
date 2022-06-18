import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import SavingModal from "../common/SavingModal";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
const apiUrl = process.env.API_URL;

function AddInstallment({
  page,
  dataToChange,
  sideBarShow,
  setSyncOp,
  syncOP,
  getStudents,
  handleStatesButton,
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
    institute_id: "",
    date: "",
  });
  const [saving, setSaving] = useState(false);
  const [institutes, setInstitutes] = useState([]);
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
    getInstitutes();
    if (Object.keys(dataToChange).length != 0) {
      setDataToSend(dataToChange);
    }
  }, []);
  const handleNameChange = (e) => {
    setDataToSend({ ...dataToSend, name: e.target.value });
  };
  const handleInstituteChange = (e) => {
    setDataToSend({ ...dataToSend, institute_id: e.target.value });
  };
  const handleInstallmentDateChange = (date) => {
    setDataToSend({
      ...dataToSend,
      date: toLocalISOString(date).slice(0, 10),
    });
  };
  const saveInstallment = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `${apiUrl}/installments${`/` + dataToSend.id}?date=${dataToSend.date}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({
            ...dataToSend,
            token: localStorage.getItem("Biotime"),
          }),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.detail) {
        throw new Error(responseData.detail);
      }
      toast.success("تم حفظ القسط");
      setSyncOp({ ...syncOP, showSync: true });
      page();
    } catch (error) {
      console.log(error.message);
      setSaving(false);
      toast.error("فشل الحفظ");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    saveInstallment();
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
          save={saveInstallment}
          page={handleStatesButton}
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
            <h2 className="col-8 text-center">القسط</h2>
          </div>
          <div className="row pt-md-3 pr-2 pl-2 mb-5">
            <div className="col-8 offset-3 p-2">
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
                      required
                    ></input>
                  </div>
                  <label
                    htmlFor="name"
                    className="col-2 form-label text-center p-2"
                  >
                    اسم القسط
                  </label>
                </div>

                <div className="row">
                  <div className="col-4 offset-4 position-relative">
                    <DatePicker
                      id={`installment-date`}
                      // selected={date}
                      className="form-control text"
                      onChange={(date) => handleInstallmentDateChange(date)}
                      dateFormat="yyyy/MM/dd"
                      value={dataToSend.date}
                    />
                  </div>
                  <label
                    htmlFor={`installment-date`}
                    className="col-2 form-label text-center p-2"
                  >
                    التاريخ
                  </label>
                </div>
                <div className="mb-3 row">
                  <div className="col-2 offset-2 mt-3">
                    {!saving ? (
                      <button
                        type="submit"
                        className="btn btn-success btn-block w-100"
                      >
                        تعديل القسط
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
                      onClick={handleStatesButton}
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

export default AddInstallment;
