// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import { MoreVertical, Edit, Lock, Shield, RotateCcw } from "react-feather";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  InputGroup,
  InputGroupButtonDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import moment from "moment";
import { injectIntl } from "react-intl";
import ResetPasswordUser from "./resetPasswordUser";
const statusOptions = [
  { value: "", label: "all" },
  { value: 1, label: "ok" },
  { value: 0, label: "locked" },
];

const DefaultFilter = {
  filter: {
    active: undefined,
  },
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc",
  },
};
const List_Search_Filter = ["username", "email", "phoneNumber"];
const DataTableServerSide = ({ intl }) => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: "ID",
      selector: "appUserId",
      sortable: true,
      maxWidth: "80px",
      minWidth: "80px",
    },
    {
      name: intl.formatMessage({ id: "username" }),
      selector: "username",
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
      minWidth: "200px",
    },
    {
      name: intl.formatMessage({ id: "fullname" }),
      sortable: true,
      minWidth: "200px",
      cell: (row) => {
        return (
          <div>
            {row.firstName} {row.lastName}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "phoneNumber" }),
      selector: "phoneNumber",
      sortable: true,
      minWidth: "150px",
    },
    {
      name: intl.formatMessage({ id: "status" }),
      selector: "active",
      sortable: true,
      minWidth: "130px",
      cell: (row) => {
        const { active } = row;

        return (
          <div>
            {!active
              ? intl.formatMessage({ id: "locked" })
              : intl.formatMessage({ id: "ok" })}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "createdAt" }),
      selector: "salary",
      sortable: true,
      minWidth: "130px",
      maxWidth: "150px",
      cell: (row) => {
        const { createdAt } = row;

        return <div>{moment(createdAt).format("hh:mm DD/MM/YYYY")}</div>;
      },
    },

    {
      name: intl.formatMessage({ id: "updatedAt" }),
      selector: "updatedAt",
      sortable: true,
      minWidth: "140px",
      maxWidth: "150px",
      cell: (row) => {
        const { updatedAt } = row;

        return <div>{moment(updatedAt).format("hh:mm DD/MM/YYYY")}</div>;
      },
    },
    {
      name: intl.formatMessage({ id: "action" }),
      selector: "action",
      cell: (row) => {
        const { appUserId, lastName, firstName, phoneNumber, active, username } = row;
        const newPhone = !phoneNumber || phoneNumber === "" ? " " : phoneNumber;
        return (
          <UncontrolledDropdown>
            <DropdownToggle
              className="icon-btn hide-arrow"
              color="transparent"
              size="sm"
              caret
            >
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setModal(true);
                  setUserData({
                    appUserId,
                    firstName,
                    lastName,
                    phoneNumber: newPhone,
                    active,
                    username
                  });
                }}
              >
                <Edit className="mr-50" size={15} />{" "}
                <span className="align-middle">
                  {intl.formatMessage({ id: "edit" })}
                </span>
              </DropdownItem>

              {active ? (
                <DropdownItem
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdateData({
                      id: appUserId,
                      data: {
                        active: 0,
                      },
                    });
                  }}
                >
                  <Lock className="mr-50" size={15} />{" "}
                  <span className="align-middle">
                    {intl.formatMessage({ id: "lock" })}
                  </span>
                </DropdownItem>
              ) : (
                <DropdownItem
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdateData({
                      id: appUserId,
                      data: {
                        active: 1,
                      },
                    });
                  }}
                >
                  <Lock className="mr-50" size={15} />{" "}
                  <span className="align-middle">
                    {intl.formatMessage({ id: "unLock" })}
                  </span>
                </DropdownItem>
              )}
              <DropdownItem
                onClick={(e) => {
                  e.preventDefault();
                  let newItem = { ...row };
                  setIdTrans(newItem);
                  togglePasswordOpen();
                }}
              >
                <RotateCcw size={15} />
                <span className="ml-1">
                  {intl.formatMessage({
                    id: "resetPass",
                  })}
                </span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      },
    },
  ];
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);

  // ** States
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(20);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState(List_Search_Filter[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  // const [passwordData, setPasswordData] = useState([]);
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false);
  const [idTrans, setIdTrans] = useState(null);

  const togglePasswordOpen = () => {
    setSidebarPasswordOpen(!sidebarPasswordOpen);
  };
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
    const token = window.localStorage.getItem("accessToken");

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: "POST",
        path: "AppUsers/getListlUser",
        data: newParams,
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken,
        },
      }).then((res) => {
        if (res) {
          const { statusCode, data, message } = res;
          setParamsFilter(newParams);
          if (statusCode === 200) {
            setTotal(data.total);
            setItems(data.data);
          } else {
            toast.warn(message || "Something was wrong!");
          }
        } else {
          setTotal(1);
          setItems([]);
        }
        if (!isNoLoading) {
          setIsLoading(false);
        }
      });
    } else {
      window.localStorage.clear();
    }
  }

  function handleUpdateData(item) {
    Service.send({
      method: "POST",
      path: "AppUsers/updateUserById",
      data: item,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;
        if (statusCode === 200) {
          setUserData({});
          setModal(false);
          getData(paramsFilter);
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

  const getDataSearch = _.debounce((params) => {
    getData(params, true);
  }, 2000);

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter);
  }, []);

  // ** Function to handle filter
  const handleFilter = (e) => {
    const { value } = e.target;
    setSearchValue();
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [searchField]: value,
      },
      skip: 0,
    };
    getDataSearch(newParams);
  };

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
  const handlePerPage = (e) => {
    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0,
    };
    getData(newParams);
    setCurrentPage(1);
    setRowsPerPage(parseInt(e.target.value));
  };

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

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value,
      },
      skip: 0,
    };
    getData(newParams);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = 20;

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

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="6">
            <div className="d-flex align-items-center">
              <Label for="sort-select">
                {intl.formatMessage({ id: "show" })}
              </Label>
              <Input
                className="dataTable-select"
                type="select"
                bsSize="sm"
                id="sort-select"
                value={rowsPerPage}
                onChange={(e) => handlePerPage(e)}
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Input>
            </div>
          </Col>
          <Col sm="2">
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange(name, value);
              }}
              type="select"
              value={
                paramsFilter.filter ? paramsFilter.filter.active || "" : ""
              }
              name="active"
              bsSize="sm"
            >
              {statusOptions.map((item) => {
                return (
                  <option value={item.value}>
                    {intl.formatMessage({ id: item.label })}
                  </option>
                );
              })}
            </Input>
          </Col>
          <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="4"
          >
            <Label className="mr-1" for="search-input">
              {intl.formatMessage({ id: "Search" })}
            </Label>
            <InputGroup className="input-search-group">
              <InputGroupButtonDropdown
                addonType="prepend"
                isOpen={dropdownOpen}
                toggle={toggleDropDown}
              >
                <DropdownToggle size="sm" color="primary" caret outline>
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
                      key={text}
                    >
                      {intl.formatMessage({ id: text })}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </InputGroupButtonDropdown>

              <Input
                className="dataTable-filter"
                type="text"
                bsSize="sm"
                id="search-input"
                value={searchValue}
                onChange={(e) => {
                  handleFilter(e);
                }}
              />
            </InputGroup>
          </Col>
        </Row>
        <div id="users-data-table">
          <DataTable
            noHeader
            pagination
            paginationServer
            className="react-dataTable"
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
        </div>
      </Card>

      <Modal
        isOpen={modal}
        toggle={() => setModal(false)}
        className={`modal-dialog-centered `}
      >
        <ModalHeader toggle={() => setModal(false)}>
          {intl.formatMessage({ id: "edit" })}{" "}
          {intl.formatMessage(
            { id: "info" },
            { type: intl.formatMessage({ id: "User" }) }
          )}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleUpdateData({
                id: userData.appUserId,
                data,
              });
              setModal(false);
            })}
          >
            <FormGroup>
              <Label for="firstName">
                {intl.formatMessage({ id: "firstName" })}
              </Label>
              <Input
                id="firstName"
                name="firstName"
                innerRef={register({ required: true })}
                invalid={errors.firstName && true}
                placeholder="Bruce"
                value={userData.firstName || ""}
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleOnchange(name, value);
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="lastName">
                {intl.formatMessage({ id: "lastName" })}
              </Label>
              <Input
                id="lastName"
                name="lastName"
                innerRef={register({ required: true })}
                invalid={errors.lastName && true}
                placeholder="Wayne"
                value={userData.lastName || ""}
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
                innerRef={register({ required: true })}
                invalid={errors.lastNameBasic && true}
                name="phoneNumber"
                placeholder="+84943881692"
                options={{ phone: true, phoneRegionCode: "VI" }}
                value={userData.phoneNumber || ""}
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
              <Button.Ripple
                type="button"
                outline
                color="danger"
                onClick={(e) => {
                  e.preventDefault();
                  let newItem = { ...userData };
                  setIdTrans(newItem);
                  togglePasswordOpen();
                  togglePasswordOpen();
                }}
              >
                <RotateCcw size={15} />
                <span className="ml-1">
                  {intl.formatMessage({
                    id: "resetPass",
                  })}
                </span>
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
      <ResetPasswordUser item={idTrans} open={sidebarPasswordOpen} toggleSidebar={togglePasswordOpen}/>
    </Fragment>
  );
};

export default injectIntl(memo(DataTableServerSide));
