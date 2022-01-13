import React from "react";

function AdminFooter({ sideBarShow }) {
  return (
    <footer>
      <div
        className={
          sideBarShow
            ? "width-others-wide fixed-bottom mr-auto bottom-bar"
            : "width-others-wide fixed-bottom mr-auto bottom-bar"
        }
        id="bottom-bar"
      >
        <div className="row justify-content-center mt-3">
          <div className="col-auto">
            <p className="text-center">
              Copyright &copy; 2022 by BeSmarty inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
