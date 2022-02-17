import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

export default function SavingModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dir="rtl"
      className=""
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">تأكيد</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-right">
        <h4>هل انت متأكد ؟</h4>
      </Modal.Body>
      <Modal.Footer
        className="m-0 align-items-center justify-content-center"
        dir="ltr"
      >
        <div className="">
          <Button
            onClick={() => {
              props.save();
              props.page();
              props.onHide();
            }}
            className="btn btn-success"
          >
            حفظ التغييرات
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              props.page();
              props.onHide();
            }}
            className="btn btn-danger"
          >
            عدم الحفظ
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              props.onHide();
            }}
            className="btn btn-secondary"
          >
            البقاء
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
