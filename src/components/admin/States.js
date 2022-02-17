import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddStateModal } from "../common/Modals";
import { toast } from "react-toastify";
import ConfirmModal from "../common/ConfirmModal";
const apiUrl = process.env.API_URL;

function States({
  sideBarShow,
  getStates,
  data,
  setSelectedState,
  handleStateStudentsButton,
  setShowSync,
}) {
  const [addStateModal, setAddStateModal] = useState({
    show: false,
    state: {
      id: "",
      name: "",
    },
    users: null,
  });
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    id: "",
  });

  const [users, setUsers] = useState([]);
  const getUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseData = await response.json();

      setUsers(responseData.users.filter((user) => user.super != 1));
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const deleteState = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/states/${id}`, {
        method: "DELETE",
      });
      const responseData = await response.json();

      toast.success("تم حذف المنطقة");
      getStates();
    } catch (error) {
      console.log(error.message);
      toast.error("فشل الحذف");
    }
  };
  return (
    <section className="">
      <AddStateModal
        show={addStateModal.show}
        onHide={() =>
          setAddStateModal({
            ...addStateModal,
            show: false,
            state: {
              id: "",
              name: "",
            },
            users: null,
          })
        }
        getStates={getStates}
        state={addStateModal.state}
        selectedUsers={addStateModal.users}
        getUsers={getUsers}
        users={users}
        setShowSync={setShowSync}
      />
      <ConfirmModal
        show={confirmModal.show}
        onHide={() =>
          setConfirmModal({
            ...confirmModal,
            show: false,
            id: "",
          })
        }
        confirm={deleteState}
        id={confirmModal.id}
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
          <div className="d-flex w-100 mt-3" dir="ltr">
            <div className="col-2 offset-1">
              <button
                className="btn btn-primary text-white"
                onClick={() =>
                  setAddStateModal({
                    ...addStateModal,
                    show: true,
                    state: {
                      id: "",
                      name: "",
                    },
                    users: null,
                  })
                }
              >
                اضافة منطقة
              </button>
            </div>
            <h4 className="col-6 text-center">المناطق</h4>
          </div>

          <div className="row pe-2 ps-2 mb-5">
            {data.states.map((state) => {
              return (
                <div key={state.id} className="col-sm-3 p-2">
                  <div
                    className="card card-common"
                    style={{ border: 0 }}
                    onClick={() => {
                      setSelectedState(state);
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
                      <button
                        className="col-6 btn btn-secondary"
                        style={{ borderRadius: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddStateModal({
                            ...addStateModal,
                            show: true,
                            state: state,
                            users: users.filter((user) => {
                              return (
                                user.authority.filter((authority) => {
                                  return authority.id == state.id;
                                }).length != 0
                              );
                            }),
                          });
                        }}
                      >
                        تعديل
                      </button>
                      <button
                        className="col-6 btn btn-danger"
                        style={{ borderRadius: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmModal({
                            ...confirmModal,
                            show: true,
                            id: state.id,
                          });
                        }}
                      >
                        حذف
                      </button>
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
