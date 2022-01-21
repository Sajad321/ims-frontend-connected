import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddStateModal } from "../common/Modals";
const apiUrl = process.env.API_URL;

function States({
  sideBarShow,
  data,
  state,
  setSelecedState,
  handleStateStudentsButton,
}) {
  const [addStateModalShow, setAddStateModalShow] = useState(false);

  return (
    <section className="">
      <AddStateModal
        show={addStateModalShow}
        onHide={() => setAddStateModalShow(false)}
        state={state}
      />
      <div className="row pt-5 m-0" dir="rtl">
        <div
          className={
            sideBarShow
              ? "width-others-wide me-auto main-view mb-2"
              : "width-others-narrow me-auto main-view mb-2"
          }
          id="main-view"
        >
          <div className="row mt-3">
            <div className="col-12 top-bg">
              <h5 className="">المناطق</h5>
            </div>
          </div>
          <div className="row pe-2 ps-2 mb-5">
            <div className="col-12 mt-3 mb-1">
              <button
                className="btn btn-info text-white"
                onClick={() => setAddStateModalShow(true)}
              >
                اضافة منطقة
              </button>
            </div>

            {data.states.map((state) => {
              return (
                <div key={state.id} className="col-sm-3 p-2">
                  <div
                    className="card card-common"
                    onClick={() => {
                      setSelecedState(state);
                      handleStateStudentsButton();
                    }}
                  >
                    <div className="card-body" dir="ltr">
                      <div className="d-flex justify-content-between">
                        <FontAwesomeIcon
                          icon="house-user"
                          color="white"
                          size="3x"
                        />
                        <div className="text-right text-white">
                          <h5>{state.name}</h5>
                        </div>
                      </div>
                    </div>
                    <div className="row m-0">
                      <button className="col-6 btn btn-secondary">تعديل</button>
                      <button className="col-6 btn btn-danger">حذف</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default States;
