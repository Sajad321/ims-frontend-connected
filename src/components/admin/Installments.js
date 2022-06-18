import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import InfiniteScroll from "react-infinite-scroll-component";

const apiUrl = process.env.API_URL;

function Installments({
  sideBarShow,
  selectedState,
  add,
  edit,
  setSyncOp,
  syncOp,
}) {
  const [data, setData] = useState({
    installments: [],
    total_installments: "",
    page: 1,
  });
  const [loading, setLoading] = useState(true);

  const getInstallments = async () => {
    try {
      const response = await fetch(`${apiUrl}/installments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseData = await response.json();

      setData({
        installments: responseData.installments,
        total_installments: 4,
        page: 1,
      });
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getInstallments();
  }, []);

  const handleEditButton = (installment) => {
    edit({ ...installment });
  };

  const render_table = () => {
    let render_data = data.installments.map((installment, index) => {
      return (
        <tr
          key={installment.id}
          className="font-weight-bold"
          onClick={() => handleEditButton(installment)}
        >
          <td className="">{index + 1}</td>
          <td className="">{installment.name}</td>
          <td className="">{installment.date}</td>
        </tr>
      );
    });

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
            <th className="">التاريخ</th>
          </tr>
        </thead>
        <tbody>{render_data}</tbody>
      </table>
    );
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
          <div className="row mt-3">
            <div className="col-12">
              <h4 className="text-center">الاقساط</h4>
            </div>
          </div>
          <div className="row pr-2 pl-2 mb-5">
            <div className="col-12" dir="rtl">
              {loading ? (
                <Loading />
              ) : (
                <InfiniteScroll
                  dataLength={data.page * 100} //This is important field to render the next data
                  next={() => {}}
                  hasMore={false}
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

export default Installments;
