import React from "react";
import { Card, Col, Label, Input, Button } from "reactstrap";
import Select, { components } from "react-select";
import { selectThemeColors } from "@utils";
import { useForm } from "react-hook-form";
import { injectIntl } from "react-intl";
import Request from "../../../services/request";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

function RoleAdd({ intl }) {
  const history = useHistory();
  const { state } = useLocation();

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

  function updateRole() {
    Request.send({
      method: "POST",
      path: "Role/updateById",
      data: {
        id: state?.data?.roleId,
        data: {
            roleName: role,
            permissions: pems.join(",")
        }
      }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;

        history.push("/pages/account-admin");
      }
    });
  }

  React.useEffect(() => {
    if(!state || !state.data) {
        history.push("/pages/account-admin");
    }

    fetchData();

    setPems(state?.data?.permissions.split(","))
    setRole(state?.data?.roleName)
    console.log(state)
  }, []);



  return (
    <React.Fragment>
      <Card className="px-2 pb-2">
        <center>
          <h3 className="pt-2">Sửa vai trò</h3>
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
            defaultValue={pems}
            value={pems.map(p => {
                return {value: p, label: p}
            })}
          />
        </Col>

        <Col className="mb-1" md="2" sm="2">
          <Button.Ripple
            disabled={!role}
            className="mr-1"
            color="primary"
            type="button"
            onClick={updateRole}
          >
            {intl.formatMessage({ id: "submit" })}
          </Button.Ripple>
        </Col>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(RoleAdd);
