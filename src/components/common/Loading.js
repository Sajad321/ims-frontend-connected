import React from "react";
import loading from "../../assets/svg/loading.svg";

const Loading = () => (
  <div className="row justify-content-center m-0">
    <div className="spinner col-1">
      <img src={loading} alt="Loading" />
    </div>
  </div>
);

export default Loading;
