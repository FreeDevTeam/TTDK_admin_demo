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
import ListSchedule  from "./listSchedule";
import ListVehicle  from "./listVehicle";
import UserService from '../../../services/userService'

const FormUser = ({ intl }) => {
  const location = useLocation();
  const history = useHistory();
  const { userAvatar, username, appUserId, firstName, email, phoneNumber } =
    location.state;
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });
  const [userData, setUserData] = useState({});

const getDetailUserById = (appUserId) =>{
  UserService.getDetailUserById({
    id : appUserId
  },).then((res) => {
    if (res) {
      const { statusCode, message, data } = res;
      if (statusCode === 200) {
        setUserData(data);
      } 
    }
  });
}

  function handleUpdateData(data) {
    UserService.updateUserById(data).then((res) => {
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
  };

  useEffect(() => {
    getDetailUserById(appUserId)
  }, []);

  const onKeyDown = (e) =>{
    let key = e.keyCode
    if((key >= 48 && key <= 59) || (key >= 96 && key <= 105)){
       e.preventDefault()
    }
  }
  
  return (
    <Fragment>
      <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: "goBack" })}
      </div>
      <Row>
        <Col className="col-sm-4 col-xs-12">
          <Card className="mt-4">
            <CardHeader className="justify-content-center flex-column">
              <CardImg
                className="mt-3"
                src={userData.userAvatar}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <CardText className="mt-2 h3">{userData.firstName}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit((data) => {
                  handleUpdateData({
                    id: appUserId,
                    data,
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
                    innerRef={register()}
                    invalid={errors.firstName && true}
                    value={userData.firstName || ""}
                    onKeyDown={(e) => onKeyDown(e)}
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
                    innerRef={register()}
                    invalid={errors.email && true}
                    value={userData.email || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="companyName">
                    {intl.formatMessage({ id: "companyName" })}
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    innerRef={register()}
                    invalid={errors.companyName && true}
                    value={userData.companyName || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="classify">
                    {intl.formatMessage({ id: "classify" })}
                  </Label>
                  <Input
                    id="appUserCategory"
                    name="appUserCategory"
                    type="select"
                    innerRef={register()}
                    invalid={errors.appUserCategory && true}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  >
                     <option
                            selected={
                              userData.appUserCategory?.toString() === '1'
                            }
                            value = '1'
                          >
                            {intl.formatMessage({ id: "personal" })}
                          </option>
                          <option
                            selected={
                              userData.appUserCategory?.toString() === '2'
                            }
                            value= '2'
                          >
                            {intl.formatMessage({ id: "company" })}
                          </option>
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="username">
                    {intl.formatMessage({ id: "username" })}
                  </Label>
                  <Input
                    id="username"
                    disabled
                    name="username"
                    innerRef={register({ required: true })}
                    invalid={errors.username && true}
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
                    innerRef={register()}
                    invalid={errors.phoneNumber && true}
                    name="phoneNumber"
                    options={{ phone: true, phoneRegionCode: "VI" }}
                    value={userData.phoneNumber || ""}
                    type='number'
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
        </Col>
        <Col className="col-sm-7 col-xs-12">
          <Card className="mt-4 col-xs-12">
              <ListSchedule appUserId={appUserId}/>
              <ListVehicle appUserId={appUserId}/>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default injectIntl(memo(FormUser));
