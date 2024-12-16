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


const FormUser = ({ intl }) => {
  const location = useLocation();
  const history = useHistory();
  const { stationDocumentId, documentTitle, documentContent, documentCategory, documentPublishedDay, documentExpireDay, documentPublisherName } =
    location.state;
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });
  const [userData, setUserData] = useState({});
  const [paramsFilter, setParamsFilter] = useState();
  const [total, setTotal] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [idTrans, setIdTrans] = useState(null);
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

const getDetailById = (stationDocumentId) =>{
  Service.send({
    method: "POST",
    path: "StationDocument/findById",
    data: {
      id : stationDocumentId
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

  function updateStationDocumentById(data) {
    Service.send({
      method: "POST",
      path: "StationDocument/updateById",
      data: data,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;
        if (statusCode === 200) {
          // setUserData({});
          getDetailById(stationDocumentId)
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
    getDetailById(stationDocumentId)
  }, []);

  return (
    <Fragment>
      <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: "goBack" })}
      </div>
      <Row>
        <Col className="col-sm-12 col-xs-12">
          <Card className="mt-4">
            <CardHeader className="justify-content-center flex-column">
              <CardText className="mt-2 h2">{intl.formatMessage({ id: "detail-documentary" })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit((data) => {
                  updateStationDocumentById({
                    id: stationDocumentId,
                    data,
                  });
                })}
              >
                <FormGroup>
                  <Label for="documentTitle">
                    {intl.formatMessage({ id: "documentTitle" })}
                  </Label>
                  <Input
                    id="documentTitle"
                    name="documentTitle"
                    innerRef={register({ required: true })}
                    invalid={errors.documentTitle && true}
                    value={userData.documentTitle || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                    className='col-sm-9'
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="documentCode">
                    {intl.formatMessage({ id: "documentCode" })}
                  </Label>
                  <Input
                    id="documentCode"
                    name="documentCode"
                    innerRef={register({ required: true })}
                    invalid={errors.documentCode && true}
                    value={userData.documentCode || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                    className='col-sm-9'
                    disabled
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="documentContent">
                    {intl.formatMessage({ id: "documentContent" })}
                  </Label>
                  <Input
                    id="documentContent"
                    name="documentContent"
                    innerRef={register({ required: true })}
                    invalid={errors.documentContent && true}
                    value={userData.documentContent || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                    className='col-sm-9'
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="documentCategory">
                    {intl.formatMessage({ id: "documentCategory" })}
                  </Label>
                  <Input
                    id="documentCategory"
                    name="documentCategory"
                    innerRef={register({ required: true })}
                    invalid={errors.documentCategory && true}
                    value={userData.documentCategory || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                    className='col-sm-9'
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="documentPublisherName">
                    {intl.formatMessage({ id: "documentPublisherName" })}
                  </Label>
                  <Input
                    id="documentPublisherName"
                    name="documentPublisherName"
                    innerRef={register({ required: true })}
                    invalid={errors.documentPublisherName && true}
                    value={userData.documentPublisherName || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                    className='col-sm-9'
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="documentPublishedDay">
                    {intl.formatMessage({ id: "documentPublishedDay" })}
                  </Label>
                  <Input
                    id="documentPublishedDay"
                    name="documentPublishedDay"
                    innerRef={register({ required: true })}
                    invalid={errors.documentPublishedDay && true}
                    value={userData.documentPublishedDay || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                    className='col-sm-9'
                    disabled
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="documentExpireDay">
                    {intl.formatMessage({ id: "documentExpireDay" })}
                  </Label>
                  <Input
                    id="documentExpireDay"
                    name="documentExpireDay"
                    innerRef={register({ required: true })}
                    invalid={errors.documentExpireDay && true}
                    value={userData.documentExpireDay || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                    className='col-sm-9'
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
      </Row>
    </Fragment>
  );
};

export default injectIntl(memo(FormUser));

