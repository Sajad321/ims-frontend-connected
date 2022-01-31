import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";

const apiUrl = process.env.API_URL;

const colourOptions = [
  { value: "ocean1", label: "كل الصلاحيات" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "forest", label: "Forest" },
  { value: "slate", label: "Slate" },
  { value: "silver", label: "Silver" },
];
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

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};
export function AddUserModal(props) {
  const [dataToSend, setDataToSend] = useState({
    id: "",
    authority: null,
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (selected) => {
    setDataToSend({ ...dataToSend, authority: selected });
  };
  const handleNameChange = (e) => {
    setDataToSend({ ...dataToSend, name: e.target.value });
  };
  const handleEmailChange = (e) => {
    setDataToSend({ ...dataToSend, email: e.target.value });
  };
  const handlePasswordChange = (e) => {
    setDataToSend({ ...dataToSend, password: e.target.value });
  };

  const saveUser = async () => {
    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: dataToSend.id != "" ? "PATCH" : "POST",
        body: dataToSend,
      });
      const responseData = await response.json();

      toast.success("تم حفظ الطالب");
    } catch (error) {
      console.log(error.message);
      toast.error("فشل الحفظ");
    }
  };
  const handleSubmit = (e) => {
    saveUser();
  };
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      className=""
      dir="rtl"
    >
      <Modal.Header closeButton>
        <Modal.Title>اضافة</Modal.Title>
      </Modal.Header>
      <Modal.Body className="row">
        <div className="input-group mb-3">
          <input
            id="name"
            type="text"
            placeholder="name"
            className="form-control "
            onChange={handleNameChange}
            value={dataToSend.name}
            required
          ></input>
        </div>
        <div className="input-group mb-3">
          <input
            id="email"
            type="text"
            placeholder="email"
            className="form-control "
            onChange={handleEmailChange}
            value={dataToSend.email}
            required
          ></input>
        </div>
        <div className="input-group mb-3">
          <input
            id="password"
            type="password"
            placeholder="password"
            className="form-control"
            onChange={handlePasswordChange}
            value={dataToSend.password}
            required
          ></input>
        </div>
        <div className="col-12">
          <span
            className="d-inline-block w-100"
            data-toggle="popover"
            data-trigger="focus"
            data-content="Please selecet account(s)"
          >
            <ReactSelect
              options={colourOptions}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                Option,
              }}
              onChange={handleChange}
              allowSelectAll={true}
              value={dataToSend.authority}
              placeholder="الصلاحية"
            />
          </span>
        </div>
      </Modal.Body>
      <Modal.Footer className="m-0">
        <div className="">
          <Button
            onClick={() => {
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
              handleSubmit();
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
