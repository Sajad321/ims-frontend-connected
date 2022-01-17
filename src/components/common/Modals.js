import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

export function AddStateModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      dir="rtl"
      className=""
    >
      <Modal.Header closeButton>
        <Modal.Title>اضافة</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-right">
        <input
          id="name"
          type="text"
          placeholder="الاسم"
          className="form-control text"
          //   onChange={handleNameChange}
          //   value={dataToSend.name}
          required
        ></input>
      </Modal.Body>
      <Modal.Footer className="m-0">
        <div className="">
          <Button
            onClick={() => {
              props.AddStudentButton();
              props.onHide();
            }}
            className="btn btn-danger"
          >
            غلق
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              props.AddInstallmentButton();
              props.onHide();
            }}
            className="btn btn-primary"
          >
            انشاء
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
