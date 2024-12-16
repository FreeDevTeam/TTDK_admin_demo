import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { injectIntl } from "react-intl";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import AdminService from "../../../services/adminService";

function ResetPasswordUser({ intl, item, toggleSidebar, open }) {
  const [newPassword, setNewPassword] = useState("");

  const newPasswordChangeHandler = (event) => {
    setNewPassword(event.target.value);
  };
  const { register, errors } = useForm({
  });
  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    try {
      const params = {
        username: item.username,
        newPassword: newPassword,
      };
      await AdminService.ResetPasswordUser(params)
      toast.success(
        intl.formatMessage(
          { id: "actionSuccess" },
          { action: intl.formatMessage({ id: "resetPass" }) }
        )
      );
      toggleSidebar()
    } catch (error) {
      toast.warn(
        intl.formatMessage(
          { id: "actionFailed" },
          { action: intl.formatMessage({ id: "resetPass" }) }
        )
      );
    }

  };

  return (
    <Modal
      isOpen={open}
      toggle={toggleSidebar}
      className={`modal-dialog-centered `}
    >
      <ModalHeader toggle={toggleSidebar}>
        {intl.formatMessage({ id: "resetPass" })}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleUpdatePassword}>
          <FormGroup>
            <Label for="newPassword">
              {intl.formatMessage({ id: "newPassword" })}
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              required
              innerRef={register({ required: true })}
              invalid={errors.newPassword && true}
              placeholder="123456789"
              value={newPassword}
              onChange={newPasswordChangeHandler}
            />
          </FormGroup>
          <FormGroup className="d-flex mb-0">
            <Button.Ripple
              className="mr-1"
              color="primary"
              type="submit"
            >
              {intl.formatMessage({ id: "update" })}
            </Button.Ripple>
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default injectIntl(ResetPasswordUser);
