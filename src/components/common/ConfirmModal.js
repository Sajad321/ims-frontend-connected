import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

export default function ConfirmModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dir="rtl"
      className="text-white"
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
              props.onHide();
            }}
            className="modal-add-nav"
          >
            لا
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              props.handleToggleButton(
                props.index,
                props.student_id,
                props.done
              );
              props.onHide();
            }}
            className="modal-add-nav"
          >
            نعم
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
