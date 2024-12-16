import React, { Fragment, useState, memo, useEffect, useRef } from "react";
import { ChevronLeft, Square } from "react-feather";
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
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from "moment";
// import FileUpload from '../../forms/form-elements/file-uploader/FileUpload'
// import FileUploadMultiple from '../../forms/form-elements/file-uploader/FileUploadMultiple'


const AddDocument = ({ intl }) => {
  const history = useHistory();

  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });
  const [userData, setUserData] = useState({});
  const [items, setItems] = useState();
  const [total, setTotal] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [idTrans, setIdTrans] = useState(null);
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState('');

  const location = useLocation();

    function insertDocument(data) {
      Service.send({
        method: "POST",
        path: "StationDocument/insert",
        data: data,
        query: null,
      }).then((res) => {
        if (res) {
          const { statusCode, message } = res;
          if (statusCode === 200) {
            toast.success(
              intl.formatMessage(
                { id: "actionSuccess" },
                { action: intl.formatMessage({ id: "add_new" }) }
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

  const dataUpload = (link) =>{
    setItems(link)
  }


  return (
    <Fragment>
      <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: "goBack" })}
      </div>
      <Row>
        <Col className="col-sm-6 col-xs-6">
          <Card className="mt-4">
            <CardHeader className="justify-content-center flex-column">
              {location.state === undefined ? 
              <CardText className="mt-2 h2">{intl.formatMessage({ id: "add_document" })}</CardText>
            : <CardText className="mt-2 h2">{intl.formatMessage({ id: "detail-documentary" })}</CardText>}
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit((data) => {
                  // onSubmit(data)
                  insertDocument({
                    ...data,
                    documentPublishedDay : date
                  });
                })}
              >
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
                    className='col-sm-12'
                  />
                </FormGroup>

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
                    className='col-sm-12'
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="documentPublishedDay">
                    {intl.formatMessage({ id: "documentPublishedDay" })}
                  </Label>
                  <Flatpickr
                   id='documentPublishedDay'
                   name="documentPublishedDay"
                   value={userData.documentPublishedDay || ""}
                   options={{ mode : 'single', dateFormat: 'd/m/Y' }}
                   placeholder={intl.formatMessage({ id: "release-date" })}
                   className='form-control col-sm-12'
                   onChange={(date) => {
                       const newDateObj = date.toString()
                       const newDate = moment(newDateObj).format("DD/MM/YYYY")
                       setDate(newDate);
                    }}
              />
                </FormGroup>

                <FormGroup>
                   {/* <FileUploadMultiple onData={dataUpload}/> */}
                   {/* <FileUpload onData={dataUpload}/> */}
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

export default injectIntl(memo(AddDocument));

