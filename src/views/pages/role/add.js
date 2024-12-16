import React from "react";
import { Card, Col, Label, Input, Button } from "reactstrap";
import Select, { components } from "react-select";
import { selectThemeColors } from "@utils";
import { useForm } from "react-hook-form";
import { injectIntl } from "react-intl";
import Request from "../../../services/request";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

function RoleAdd({ intl }) {
  const history = useHistory();

  const [data, setData] = React.useState([]);
  const [role, setRole] = React.useState("");
  const [pems, setPems] = React.useState([]);

  const permissions = [
    { value: "MANAGE_DASHBOARD", label: "MANAGE_DASHBOARD" },
    { value: "MANAGE_STATION", label: "MANAGE_STATION" },
    { value: "MANAGE_STAFF", label: "MANAGE_STAFF" },
    { value: "MANAGE_USER", label: "MANAGE_USER" },
    { value: "MANAGE_DEVICE", label: "MANAGE_DEVICE" },
    { value: "MANAGE_SMS", label: "MANAGE_SMS" },
    {
      value: "MANAGE_SYSTEM_CONFIGURATION",
      label: "MANAGE_SYSTEM_CONFIGURATION",
    },
    { value: "MANAGE_ADS", label: "MANAGE_ADS" },
  ];

  function fetchData() {
    Request.send({
      method: "POST",
      path: "Permission/getList",
    }).then((result) => {
      if (result && result.statusCode === 200) {
        const { data } = result;
        setData(data);
      }
    });
  }

  function addRole() {
    Request.send({
      method: "POST",
      path: "Role/insert",
      data: {
        roleName: role,
        permissions: pems.join(",")
      }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;

        history.push("/pages/account-admin");
        // if (statusCode === 200) {
        // } else {
        //   toast.warn(
        //     intl.formatMessage(
        //       { id: "actionFailed" },
        //       { action: intl.formatMessage({ id: "fetchData" }) }
        //     )
        //   );
        // }
      }
    });
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Card className="px-2 pb-2">
        <center>
          <h3 className="pt-2">Thêm vai trò</h3>
        </center>
        <Col className="mb-1" md="12" sm="12">
          <Label>Tên vai trò</Label>
          <Input
            id="pricePerTenant"
            name="pricePerTenant"
            placeholder={"Nhập tên vai trò"}
            type="text"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          />
        </Col>
        <Col className="mb-1" md="12" sm="12">
          <Label>Quyền</Label>
          <Select
            isClearable={false}
            theme={selectThemeColors}
            isMulti
            name="permissions"
            options={permissions}
            className="react-select"
            classNamePrefix="select"
            placeholder="Chọn quyền"
            onChange={(e) => {
              setPems(e.map(per => per.value))
            }}
          />
        </Col>

        <Col className="mb-1" md="2" sm="2">
          <Button.Ripple
            disabled={!role}
            className="mr-1"
            color="primary"
            type="button"
            onClick={addRole}
          >
            {intl.formatMessage({ id: "submit" })}
          </Button.Ripple>
        </Col>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(RoleAdd);
