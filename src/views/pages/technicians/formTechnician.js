import React, { Fragment, useState, memo, useEffect } from "react";
import { ChevronLeft } from "react-feather";
import { injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  CardHeader,
  CardBody,
  CardImg,
  CardText,
} from "reactstrap";
import { useForm } from "react-hook-form";
import Service from "../../../services/request";
import { toast } from "react-toastify";
import { MoreVertical, Edit, Lock, Shield, RotateCcw } from "react-feather";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";
import RegistrationHistory from "./registrationHistory";
import Job from "./job";

const FormTechnician = ({ intl }) => {
  const location = useLocation();
  const history = useHistory();
  const { userAvatar, username, appUserId, firstName, email, phoneNumber } =
    location.state;

  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  });
  const [userData, setUserData] = useState({});
  const [userDataTouched, setUserDataTouched] = useState({});
  const [paramsFilter, setParamsFilter] = useState();
  const [total, setTotal] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [idTrans, setIdTrans] = useState(null);
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const getDetailUserById = (appUserId) => {
    Service.send({
      method: "POST",
      path: "AppUsers/getDetailUserById",
      data: {
        id: appUserId
      },
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message, data } = res;
        if (statusCode === 200) {
          setUserData(data);
        }
      }
    });
  }

  function handleUpdateData(data) {
    Service.send({
      method: "POST",
      path: "AppUsers/updateUserById",
      data: data,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;
        if (statusCode === 200) {
          // setUserData({});
          getDetailUserById(appUserId)
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "update" }) }
            )
          );
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "update" }) }
            )
          );
        }
      }
    });
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value,
    });
    setUserDataTouched({
      ...userDataTouched,
      [name]: value,
    })
  };

  useEffect(() => {
    getDetailUserById(appUserId)
  }, []);

  return (
    <Fragment>
      <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: "goBack" })}
      </div>
      <Row>
        <Col className="col-sm-4" xs='12'>
          <Card className="mt-4">
            <CardHeader className="justify-content-center flex-column">
              <CardText className="mt-2 h3">{intl.formatMessage({ id: "personal_information" })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit((data) => {
                  handleUpdateData({
                    id: appUserId,
                    data: userDataTouched
                  });
                })}
              >
                <FormGroup>
                  <Label for="firstName">
                    {intl.formatMessage({ id: "firstName" })}
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={userData.firstName || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="email">
                    {intl.formatMessage({ id: "email" })}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={userData.email || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="username">
                    {intl.formatMessage({ id: "username" })}
                  </Label>
                  <Input
                    id="username"
                    disabled
                    name="username"
                    value={userData.username || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="phoneNumber">
                    {intl.formatMessage({ id: "phoneNumber" })}
                  </Label>
                  <Input
                    name="phoneNumber"
                    options={{ phone: true, phoneRegionCode: "VI" }}
                    value={userData.phoneNumber || ""}
                    disabled
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup className="d-flex mb-0 justify-content-center">
                  <Button.Ripple className="mr-1" color="primary" type="submit">
                    {intl.formatMessage({ id: "submit" })}
                  </Button.Ripple>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
          <Job appUserId={appUserId} />
        </Col>
        <Col className="col-sm-7" xs='12'>
          <Card className="mt-4 col-xs-12">
            <CardHeader>
              <CardText className="mt-0 h3">
                {intl.formatMessage({ id: "registration_history" })}
              </CardText>
            </CardHeader>
            <RegistrationHistory appUserId={appUserId} />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default injectIntl(memo(FormTechnician));
