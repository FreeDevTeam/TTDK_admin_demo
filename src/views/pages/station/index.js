// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";
import { Plus, Download } from "react-feather";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Input,
  Label,
  Col,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  FormGroup,
  Form,
  InputGroup,
  InputGroupButtonDropdown,
} from "reactstrap";
import FileUploaderBasic from "../../forms/form-elements/file-uploader/FileUploaderBasic";
import { injectIntl } from "react-intl";
import GeneralStationInfo, { ListCamera } from "./stationDetail";
import "./index.scss";

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc",
  },
};

const ListStations = ({ items, generalId, setGeneralId, Paging }) => (
  <div id="list-stations">
    {items.map((item) => {
      let isSelected = generalId === item.stationsId;
      return (
        <Card
          id="station-card"
          data-choosen={isSelected}
          onClick={() => setGeneralId(item.stationsId)}
        >
          <CardBody>
            <CardTitle id="card-title" data-choosen={isSelected}>
              {item.stationsName}
            </CardTitle>
            <CardText id="card-text">Địa chỉ: {item.stationsAddress}</CardText>
            <CardText id="card-text">Tel: {item.stationsHotline}</CardText>
          </CardBody>
        </Card>
      );
    })}
    <Paging />
  </div>
);

const List_Search_Filter = ["stationsName", "stationUrl", "stationsEmail"];
const StationPage = ({ intl }) => {
  // ** Store Vars
  const history = useHistory();

  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [previewArr, setPreviewArr] = useState([]);
  // ** States
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(20);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState("stationsName");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [generalId, setGeneralId] = useState(0);

  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });
  const [userData, setUserData] = useState({});

  function getData(params, isNoLoading) {
    const newParams = {
      ...params,
    };
    if (!isNoLoading) {
      setIsLoading(true);
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === "") {
        delete newParams.filter[key];
      }
    });

    Service.send({
      method: "POST",
      path: "Stations/getList",
      data: newParams,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data, message } = res;
        setParamsFilter(newParams);
        if (statusCode === 200) {
          setTotal(data.total);
          setItems(data.data);
          setGeneralId(data.data[0].stationsId);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "fetchData" }) }
            )
          );
        }
      } else {
        setTotal(1);
        setItems([]);
        setGeneralId(0);
      }
      if (!isNoLoading) {
        setIsLoading(false);
      }
    });
  }

  function handleUpdateData(item, messageSuccess) {
    Service.send({
      method: "POST",
      path: "Stations/updateById",
      data: item,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;
        if (statusCode === 200) {
          toast.success(messageSuccess || "Action update successful!");
          getData(paramsFilter);
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

  function handleAddStation(item) {
    Service.send({
      method: "POST",
      path: "Stations/insert",
      data: item,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;
        console.log(res);
        if (statusCode === 200) {
          toast.success("Action successful!");
          getData(paramsFilter);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "add" }) }
            )
          );
        }
      }
    });
  }

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter);
  }, []);

  // ** Function to handle filter

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit,
    };
    getData(newParams);
    setCurrentPage(page.selected + 1);
  };

  // ** Function to handle per page

  const handleChangeSearchField = (filed) => {
    const newParams = {
      ...paramsFilter,
      skip: 0,
    };
    List_Search_Filter.forEach((text) => {
      delete newParams.filter[text];
    });
    newParams.filter[filed] = "";
    setSearchValue("");
    setSearchField(filed);
    getData(newParams);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0));

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={
          "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
        }
      />
    );
  };

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <Fragment>
      <div id="page-header">
        <div>
          <span id="page-title">Thông tin các trạm đăng kiểm</span>
          <span id="number-station">Tổng cộng: {total} trạm</span>
        </div>
        <div className="d-flex">
          <Col className="d-flex align-items-center">
            <InputGroup className="input-search-group">
              <InputGroupButtonDropdown
                isOpen={dropdownOpen}
                toggle={toggleDropDown}
              >
                <DropdownToggle caret outline>
                  {intl.formatMessage({ id: searchField })}
                </DropdownToggle>
                <DropdownMenu>
                  {List_Search_Filter.map((text) => (
                    <DropdownItem
                      className="dropdownItem-search"
                      value={text}
                      onClick={() => {
                        handleChangeSearchField(text);
                      }}
                      key={intl.formatMessage({ id: text })}
                    >
                      {intl.formatMessage({ id: text })}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </InputGroupButtonDropdown>
            </InputGroup>
          </Col>
          <Col>
            <Button color="primary" outline id="action-button">
              Tải File <Download className="pointer" size={14} />
            </Button>
          </Col>
          <Col>
            <Button
              color="primary"
              onClick={() => {
                history.push("/pages/form-station", {});
              }}
              id="action-button"
            >
              {intl.formatMessage({ id: "add" })}{" "}
              <Plus className="pointer" size={14} />
            </Button>
          </Col>
        </div>
      </div>
      <div className="d-flex">
        <ListStations
          items={items}
          generalId={generalId}
          setGeneralId={setGeneralId}
          Paging={CustomPagination}
        />
        <div
          lassName="d-flex flex-column justify-content-between"
          id="detail-form"
        >
          <GeneralStationInfo generalId={generalId} intl={intl} />
          <ListCamera Paging={CustomPagination} />
        </div>
      </div>

      <Modal
        isOpen={modal}
        toggle={() => setModal(false)}
        className={`modal-dialog-centered `}
      >
        <ModalHeader toggle={() => setModal(false)}>
          {userData.stationsId
            ? intl.formatMessage({ id: "edit" })
            : intl.formatMessage({ id: "add" })}{" "}
          {intl.formatMessage(
            { id: "info" },
            { type: intl.formatMessage({ id: "stations" }) }
          )}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              const newData = {
                ...data,
                stationsLogo:
                  previewArr && previewArr[0] ? previewArr[0].imageUrl : "",
              };
              if (userData.stationsId) {
                handleUpdateData({
                  id: userData.stationsId,
                  data: newData,
                });
              } else {
                handleAddStation(newData);
              }

              setModal(false);
            })}
          >
            <FormGroup>
              <Label for="stationsName">
                {intl.formatMessage({ id: "name" })}
              </Label>
              <Input
                id="stationsName"
                name="stationsName"
                innerRef={register({ required: true })}
                invalid={errors.stationsName && true}
                placeholder="Name"
                value={userData.stationsName || ""}
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleOnchange(name, value);
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="stationsLogo">Logo</Label>
              <FileUploaderBasic
                setPreviewArr={setPreviewArr}
                previewArr={previewArr}
              />
            </FormGroup>
            <FormGroup>
              <Label for="stationsHotline">Hotline</Label>
              <Input
                id="stationsHotline"
                name="stationsHotline"
                innerRef={register({ required: true })}
                invalid={errors.stationsHotline && true}
                placeholder="Hotline"
                value={userData.stationsHotline || ""}
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleOnchange(name, value);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="stationsAddress">
                {intl.formatMessage({ id: "address" })}
              </Label>
              <Input
                name="stationsAddress"
                id="stationsAddress"
                innerRef={register({ required: true })}
                invalid={errors.stationsAddress && true}
                value={userData.stationsAddress || ""}
                placeholder={intl.formatMessage({ id: "address" })}
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleOnchange(name, value);
                }}
              />
            </FormGroup>
            <FormGroup className="d-flex mb-0">
              <Button.Ripple className="mr-1" color="primary" type="submit">
                {intl.formatMessage({ id: "submit" })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default injectIntl(memo(StationPage));
