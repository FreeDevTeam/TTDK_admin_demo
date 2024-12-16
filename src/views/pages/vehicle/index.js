// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import { Search, Edit, Lock, Shield, RotateCcw } from "react-feather";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import { ChevronDown, Trash } from "react-feather";
import DataTable from "react-data-table-component";
import { useHistory } from 'react-router-dom'
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
import Flatpickr from 'react-flatpickr'
import moment from "moment";
import { injectIntl } from "react-intl";
import { VEHICLE_TYPE } from "./../../../constants/app";
import addKeyLocalStorage from "../../../helper/localStorage";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import VehicleService from '../../../services/vehicle'
import Type from "../../components/vehicletype";
import check from '@src/assets/images/svg/check.svg'
import x from '@src/assets/images/svg/x.svg'
import { VEHICLEVERIFIEDINFO } from "./../../../constants/app";
import MySwitch from '../../components/switch';

const DefaultFilter = {
  filter: {
  },
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc",
  },
};
const ListVehicle = ({ intl }) => {
  const MySwal = withReactContent(Swal)
  const ModalSwal = (appUserVehicleId) =>{
    return MySwal.fire({
      title: intl.formatMessage({ id: "do_you_delete" }),
      showCancelButton: true,
      confirmButtonText : intl.formatMessage({ id: "agree" }),
      cancelButtonText : intl.formatMessage({ id: "shut" }),
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary ml-1'
      },
    }).then((result) => {
      if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success',
            handleDelete(appUserVehicleId),
          )
  }})}
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: "messagesDetail-customerMessagePlateNumber" }),
      // selector: "licensePlates",
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { vehicleIdentity, vehiclePlateColor } = row
        return (
          <p className={`color_licensePlates
            ${vehiclePlateColor === 'WHITE' ? 'color_white' : " "}
            ${vehiclePlateColor === 'BLUE' ? 'color_blue' : " "}
            ${vehiclePlateColor === 'YELLOW' ? 'color_yellow' : " "}
            ${vehiclePlateColor === 'RED' ? 'color_red' : " "}
          `}>{vehicleIdentity}</p>
        )
      }
    },
    {
      name: intl.formatMessage({ id: "transportation" }),
      selector: "vehicleType",
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const { vehicleType } = row;
        return (
          <Type vehicleType={vehicleType}/>
        );
      },
    },

    {
      name: intl.formatMessage({ id: "management-number" }),
      selector: "vehicleRegistrationCode",
      sortable: true,
      minWidth: "120px",
      maxWidth: "120px",
    },
    {
      name: intl.formatMessage({ id: "types" }),
      selector: "vehicleBrandName",
      sortable: true,
      minWidth: "100px",
      maxWidth: "100px",
    },
    {
      name: intl.formatMessage({ id: "username" }),
      selector: "username",
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
    },
    {
      name: intl.formatMessage({ id: "stamp_gcn" }),
      selector: "certificateSeries",
      sortable: true,
      minWidth: "120px",
      maxWidth: "120px",
    },
    {
      name: intl.formatMessage({ id: "image-registration" }),
      selector: "username",
      center: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { vehicleRegistrationImageUrl } = row;
        return (
          <div>{vehicleRegistrationImageUrl === '' ? '-' : 
        vehicleRegistrationImageUrl === null ?  '-' :
        vehicleRegistrationImageUrl === "string" ?  '-' :
        <a href={vehicleRegistrationImageUrl} className="click_row" target='_blank'>{intl.formatMessage({ id: "see" })}</a>
      }</div>
        )
      },
    },
    {
      name: intl.formatMessage({ id: "accuracy" }),
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) =>{
        const { vehicleVerifiedInfo } = row
        return (
          <div>{vehicleVerifiedInfo === VEHICLEVERIFIEDINFO.NOT_VERIFIED ? 
           <p>{intl.formatMessage({ id: "unchecked" })}</p> :
           vehicleVerifiedInfo === VEHICLEVERIFIEDINFO.VERIFIED ?
           <p>{intl.formatMessage({ id: "checked" })}</p> :
           vehicleVerifiedInfo === VEHICLEVERIFIEDINFO.VERIFIED_BUT_NO_DATA ? 
           <p>{intl.formatMessage({ id: "checked_but_no_data" })}</p> :
           <p>{intl.formatMessage({ id: "checked_but_wrong_expirationdate" })}</p> }
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'booking_lock' }),
      maxWidth: '150px',
      minWidth: '150px',
      center: true,
      cell: (row) => {
        const { enableBookingStatus } = row;
        return (
          <MySwitch
            checked={enableBookingStatus === 0 ? true : false}
            onChange={e => {
              onUpdateStationEnableUse('AppUsers/updateUserById', {
                id: row.appUserId,
                data: {
                  enableBookingStatus: e.target.checked ? 0 : 1
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: "expiration-date" }),
      selector: "vehicleExpiryDate",
      center: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { vehicleExpiryDate } = row;
        const vehicleDay = moment(vehicleExpiryDate, "DD/MM/YYYY").format("DD/MM/YYYY")
        return <div>{vehicleDay !== 'Invalid date' ? vehicleDay : ''}</div>;
      },
    },
    {
      name: intl.formatMessage({ id: "action" }),
      selector: "action",
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { appUserId, lastName, firstName, phoneNumber, active, username, appUserVehicleId } = row;
        const newPhone = !phoneNumber || phoneNumber === "" ? " " : phoneNumber;
        return (
          <div>
            <span
              href="/"
              className="pointer"
              onClick={() => ModalSwal(appUserVehicleId)}
            >
              <Trash className="pointer ml-2" size={15} />
            </span>
            <span
              href="/"
              className="pointer ml-1"
              onClick={(e) => {
                e.preventDefault();
                history.push("/pages/edit-vehicle", row)
              }}
            >
              <Edit className="mr-50" size={15} />{" "}
            </span>
          </div>
        );
      },
    },
  ];
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);

  // ** States
  const [block, setBlock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(20);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  // const [passwordData, setPasswordData] = useState([]);
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false);
  const [idTrans, setIdTrans] = useState(null);
  const [date, setDate] = useState('');
  const history = useHistory()

  const accuraceOptions = [
    { value: "", label: "all" },
    { value: 1, label: "accuracy" },
    { value: 0, label: "non_accuracy" },
    { value: -1, label: "no_data" },
    { value: -2, label: "wrong_expiredate" },
  ];

  const vehicleType = [
    { value: "", label: "transportation" },
    { value: 1, label: "car" },
    { value: 20, label: "ro_mooc" },
    { value: 10, label: "other" },
  ];

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
    const token = window.localStorage.getItem(addKeyLocalStorage("accessToken"));

    if (token) {
      const newToken = token.replace(/"/g, "");

      VehicleService.getList(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res;
          setParamsFilter(newParams);
          if (statusCode === 200) {
            setTotal(data.total);
            setItems(data.data);
          } else {
            toast.warn(intl.formatMessage({ id: "actionFailed" }));
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

  const getDataSearch = _.debounce((params) => {
    getData(params, true);
  }, 1000);

  const handleFilterDay = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format("DD/MM/YYYY")
    setDate(newDate)
    const newParams = {
      ...paramsFilter,
      filter: {
        vehicleExpiryDate: newDate
      },
    };
    getDataSearch(newParams);
  }

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter);
  }, []);

  // ** Function to handle filter
  const handleSearch = () => {
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      order: {
        key: "createdAt",
        value: "desc"
      },
      skip: 0
    }
    getData(newParams)
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
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))

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

  const handleDelete = (appUserVehicleId) => {
    VehicleService.handleDelete({
      id: appUserVehicleId
    },).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          getData(paramsFilter);
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "delete" }) }
            )
          );
        }
      }
    });
  }

  const onUpdateStationEnableUse = (path, data) => {
    VehicleService.handleUpdate(data).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter, true)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })
  }

  const handleFilterDayBHTNDS = (date) =>{
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format("DD/MM/YYYY")
    setDate(newDate)
    const newParams = {
      ...paramsFilter,
      filter: {
        vehicleExpiryDateBHTNDS: newDate
      },
    };
    getDataSearch(newParams);
  }

  const handleFilterDayBHTV = (date) =>{
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format("DD/MM/YYYY")
    setDate(newDate)
    const newParams = {
      ...paramsFilter,
      filter: {
        vehicleExpiryDateBHTV: newDate
      },
    };
    getDataSearch(newParams);
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col className="d-flex mt-sm-0 mt-1" sm="2" xs='12'>
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: "Search" })}
                className="dataTable-filter"
                type="search"
                bsSize="sm"
                id="search-input"
                value={searchValue}
                onChange={(e) => { 
                  if(e.target.value === ''){
                    getData(DefaultFilter)
                  }
                  setSearchValue(e.target.value) 
                }}
              />
            </InputGroup>
          <Button color='primary'
              size="sm"
              className='mb-1'
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
          </Col>
          <Col
            className="mb-1"
            sm="2" xs='6'
          >
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange(name, value);
              }}
              type="select"
              value={
                paramsFilter.filter ? paramsFilter.filter.vehicleType || "" : ""
              }
              name="vehicleType"
              bsSize="sm"
              className='form-control-input'
            >
              {vehicleType.map((item) => {
                return (
                  <option value={item.value}>
                    {intl.formatMessage({ id: item.label })}
                  </option>
                );
              })}
            </Input>
          </Col>
          <Col
            className="mb-1"
            sm="2" xs='6'
          >
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange(name, value);
              }}
              type="select"
              value={
                paramsFilter.filter ? paramsFilter.filter.vehicleVerifiedInfo || "" : ""
              }
              name="vehicleVerifiedInfo"
              bsSize="sm"
              className='form-control-input'
            >
              {accuraceOptions.map((item) => {
                return (
                  <option value={item.value}>
                    {intl.formatMessage({ id: item.label })}
                  </option>
                );
              })}
            </Input>
          </Col>
          <Col className="mb-1"
            sm="2" xs='6'>
            <Flatpickr
              id='single'
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
              placeholder={intl.formatMessage({ id: "registration_deadline" })}
              className='form-control form-control-input font'
              onChange={(date) => {
                document.getElementById("clear").style.display = 'block'
                handleFilterDay(date)
              }}
            />
          </Col>

          <Col sm='1' className='mb-1 clear_text' id='clear'>
            <Button className='form-control-input ' onClick={() => {
              getDataSearch({
                ...paramsFilter,
                filter: {
                },
              })
              setDate('')
              document.getElementById("clear").style.display = 'none'
            }}>X</Button>
          </Col>
          <Col className="mb-1"
            sm="2" xs='6'>
            <Flatpickr
              id='single'
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
              placeholder={intl.formatMessage({ id: "BHTVH_dealine" })}
              className='form-control form-control-input font'
              onChange={(date) => {
                // document.getElementById("clear").style.display = 'block'
                handleFilterDayBHTNDS(date)
              }}
            />
          </Col>
          <Col className="mb-1"
            sm="2" xs='6'>
            <Flatpickr
              id='single'
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
              placeholder={intl.formatMessage({ id: "BHTNDS_dealine" })}
              className='form-control form-control-input font'
              onChange={(date) => {
                // document.getElementById("clear").style.display = 'block'
                handleFilterDayBHTV(date)
              }}
            />
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
    </Fragment>
  );
};

export default injectIntl(memo(ListVehicle));
