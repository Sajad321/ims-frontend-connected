import React, { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
const apiUrl = process.env.API_URL;

function AddStudent({ page, dataToChange, sideBarShow }) {
  const [data, setData] = useState({
    institutes: [],
  });
  const [dataToSend, setDataToSend] = useState({
    id: "",
    name: "",
    dob: "",
    institute_id: "",
    phone: "",
    note: "",
    photo: null,
  });
  const [saving, setSaving] = useState(false);
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
        setData(responseData);
      } catch (error) {
        console.log(error.message);
      }
    };
    getStuff();
    if (Object.keys(dataToChange).length != 0) {
      setDataToSend(dataToChange);
    }
    // console.log(document.getElementById("myimage").src);
  }, []);
  const handleNameChange = (e) =>
    setDataToSend({ ...dataToSend, name: e.target.value });
  const handleInstituteChange = (e) => {
    setDataToSend({ ...dataToSend, institute_id: Number(e.target.value) });
  };
  const handleDateChange = (e) =>
    setDataToSend({ ...dataToSend, dob: e.target.value });
  const handlePhoneChange = (e) =>
    setDataToSend({ ...dataToSend, phone: Number(e.target.value) });
  const handleNoteChange = (e) =>
    setDataToSend({ ...dataToSend, note: e.target.value });
  const handlePhotoChange = (e) => {
    setDataToSend({
      ...dataToSend,
      photo: new Blob([e.target.files[0]], { type: "image/jpeg" }),
    });
    var fr = new FileReader();
    fr.onload = function (event) {
      document.getElementById("myimage").src = event.target.result;
    };
    fr.readAsDataURL(e.target.files[0]);
  };
  if (dataToSend.photo != null) {
    var fr = new FileReader();
    fr.onload = function (event) {
      document.getElementById("myimage").src = event.target.result;
    };
    fr.readAsDataURL(dataToSend.photo);
  }
  const saveStudent = async () => {
    try {
      setSaving(true);
      let formData = new FormData();
      // for (let name in dataToSend) {
      //   formData.append(name, dataToSend[name]);
      // }
      // formData.append("name", dataToSend.name);
      formData.append("photo", dataToSend.photo);
      // for (var key of formData.entries()) {
      //   console.log(key[0] + ", " + key[1]);
      // }
      const response = await fetch(
        `${apiUrl}/student` +
          `${
            dataToSend.id != ""
              ? `?student_id=${Number(dataToSend.id)}&name=${
                  dataToSend.name
                }&dob=${dataToSend.dob}&institute_id=${
                  dataToSend.institute_id
                }&phone=${dataToSend.phone}&note=${dataToSend.note}`
              : `?name=${dataToSend.name}&dob=${dataToSend.dob}&institute_id=${dataToSend.institute_id}&phone=${dataToSend.phone}&note=${dataToSend.note}`
          }`,
        {
          method: dataToSend.id != "" ? "PATCH" : "POST",
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
          body: dataToSend.photo != null ? formData : null,
          // JSON.stringify({
          //   ...dataToSend,
          //   institute_id: Number(dataToSend.institute_id),
          //   phone: Number(dataToSend.phone),
          // }),
        }
      );
      if (
        (document.getElementById("myimage").src !=
          "http://localhost:8080/index.html") &
        (dataToSend.id != "")
      ) {
        let imgData = new FormData();

        imgData.append("photo", dataToSend.photo);
        const responseImg = await fetch(
          `${apiUrl}/photo?student_id=${Number(dataToSend.id)}`,
          { method: "PATCH", body: imgData }
        );
        const responseBlob = await responseImg.blob();
      }
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
    <section className="main">
      <div className="row padding-form m-0">
        <div
          className={
            sideBarShow
              ? "width-others-wide mr-auto main-view"
              : "width-others-narrow mr-auto main-view"
          }
          id="main-view"
        >
          <div className="row pt-md-3 pr-2 pl-2 mt-md-3 mb-5">
            <div className="col-5">
              <div className="col-2 offset-6 order-last order-md-first mt-5">
                {dataToSend.photo ? (
                  <img id="myimage" className="img-student-attendance" />
                ) : (
                  <img src="" id="myimage" className="img-student-attendance" />
                )}
              </div>
            </div>
            <div className="col-7 p-2">
              <form onSubmit={handleSubmit}>
                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
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
                    className="col-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    اسم الطالب
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <select
                      id="institute"
                      onChange={handleInstituteChange}
                      className="form-control"
                      dir="rtl"
                      value={dataToSend.institute_id}
                      required
                    >
                      <option selected>اختر</option>
                      {data.institutes.map((institute) => (
                        <option key={institute.id} value={institute.id}>
                          {institute.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label
                    htmlFor="institute"
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    المعهد
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <input
                      id="phone"
                      type="text"
                      placeholder="07XX-XXXXXXX"
                      onChange={handlePhoneChange}
                      className="form-control text"
                      value={dataToSend.phone}
                    ></input>
                  </div>
                  <label
                    htmlFor="phone"
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    رقم الهاتف
                  </label>
                </div>

                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <input
                      id="date"
                      type="date"
                      className="form-control text"
                      onChange={handleDateChange}
                      value={dataToSend.dob}
                      // required
                    ></input>
                  </div>
                  <label
                    htmlFor="date"
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    تاريخ الميلاد
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <input
                      id="note"
                      type="text"
                      onChange={handleNoteChange}
                      placeholder="الملاحظات"
                      className="form-control text"
                      value={dataToSend.note}
                      // required
                    ></input>
                  </div>
                  <label
                    htmlFor="note"
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    الملاحظات
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <input
                      id="photo"
                      type="file"
                      onChange={handlePhotoChange}
                      className="form-control text"
                      accept=".jpg,.jpeg"
                      // required
                    ></input>
                  </div>
                  <label
                    htmlFor="photo"
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    الصورة
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-3 offset-2 mt-3">
                    {!saving ? (
                      <button
                        type="submit"
                        className="btn btn-success btn-block"
                      >
                        حفظ الطالب
                      </button>
                    ) : (
                      <button disabled className="btn btn-success btn-block">
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
