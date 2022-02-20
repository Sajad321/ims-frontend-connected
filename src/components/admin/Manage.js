import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { AddUserModal } from "../common/Modals";
import ConfirmModal from "../common/ConfirmModal";
import InfiniteScroll from "react-infinite-scroll-component";

const apiUrl = process.env.API_URL;

function Manage({ sideBarShow, edit, states, setSyncOp, syncOp }) {
  const [data, setData] = useState({
    users: [
      {
        id: 1,
        username: "krvhrv",
        authority: [
          {
            authority_id: 1,
            name: "الكويت",
            id: 1,
          },
        ],
      },
    ],
    total_users: "",
    page: "",
  });
  const [searchedData, setSearchedData] = useState({
    users: [],
    total_users: "",
    page: "",
  });
  const [addUserModal, setAddUserModal] = useState({
    show: false,
    user: {
      id: "",
      name: "",
      username: "",
      authority: [],
      password: "",
      super: 0,
    },
  });
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    id: "",
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseData = await response.json();
      responseData.users.map((user) => {
        user["authority_v"] = user.super
          ? "كل الصلاحيات"
          : [
              user.authority
                .map((s) => {
                  return s.name;
                })
                .toString(),
            ];
        user["password"] = "";
      });
      setData({
        users: responseData.users,
        page: 1,
      });
      setSearchedData({
        users: responseData.users,
        page: 1,
      });
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUsers();
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
      users: data.users.filter((user) => user.name.match(reg)),
    });
    setLoading(false);
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/users/${id}`, {
        method: "DELETE",
      });
      const responseData = await response.json();

      toast.success("تم حذف المستخدم");
      setSyncOp({ ...syncOp, showSync: true });

      getUsers();
    } catch (error) {
      console.log(error.message);
      toast.error("فشل الحذف");
    }
  };

  const render_table = () => {
    let render_data = [];
    if (search != "") {
      render_data = searchedData.users
        .slice(0, searchedData.page * 100)
        .map((user, index) => {
          return (
            <tr
              key={user.id}
              className="font-weight-bold"
              onClick={() =>
                setAddUserModal({
                  ...addUserModal,
                  show: true,
                  user: user,
                })
              }
            >
              <td className="">{index + 1}</td>
              <td className="">{user.name}</td>
              <td className="">{user.username}</td>
              <td className="">{user.authority_v}</td>
              <td className="">
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmModal({
                      ...confirmModal,
                      show: true,
                      id: user.id,
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
      render_data = data.users.slice(0, data.page * 100).map((user, index) => {
        return (
          <tr
            key={user.id}
            className="font-weight-bold"
            onClick={() =>
              setAddUserModal({
                ...addUserModal,
                show: true,
                user: user,
              })
            }
          >
            <td className="">{index + 1}</td>
            <td className="">{user.name}</td>
            <td className="">{user.username}</td>
            <td className="">{user.authority_v}</td>
            <td className="">
              <button
                className="btn btn-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmModal({
                    ...confirmModal,
                    show: true,
                    id: user.id,
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
            <th className="">البريد الالكتروني</th>
            <th className="">الصلاحية</th>
            <th className="">الاجراء</th>
          </tr>
        </thead>
        <tbody>{render_data}</tbody>
      </table>
    );
  };

  return (
    <section className="">
      <AddUserModal
        show={addUserModal.show}
        onHide={() =>
          setAddUserModal({
            ...addUserModal,
            show: false,
            user: {
              id: "",
              name: "",
              username: "",
              authority: [],
              password: "",
              super: 0,
            },
          })
        }
        getUsers={getUsers}
        user={addUserModal.user}
        states={states}
        setSyncOp={setSyncOp}
        syncOp={syncOp}
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
        confirm={deleteUser}
        id={confirmModal.id}
      />
      <div className="row pt-5 m-0">
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
              <h4 className="text-center">المستخدمين</h4>
            </div>
          </div>
          <div className="row pr-2 pl-2 mb-5">
            <div className="col-12 mb-2">
              <form onSubmit={handleSearchButton}>
                <div className="form-group row justify-content-center m-1 ">
                  <div className="col-1 text">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() =>
                        setAddUserModal({
                          ...addUserModal,
                          show: true,
                          user: {
                            id: "",
                            name: "",
                            username: "",
                            authority: [],
                            password: "",
                            super: 0,
                          },
                        })
                      }
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
              <div className="row m-0">
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
                        ? searchedData.users.slice(0, searchedData.page * 100)
                            .length != searchedData.users.length
                        : data.users.slice(0, data.page * 100).length !=
                          data.users.length
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
      </div>
    </section>
  );
}

export default Manage;
