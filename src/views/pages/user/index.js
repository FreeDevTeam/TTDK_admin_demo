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
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import { Link, useHistory } from 'react-router-dom'
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
import MySwitch from '../../components/switch';
import addKeyLocalStorage from "../../../helper/localStorage";
import LoadingDialog from "../../components/buttons/ButtonLoading";
import XLSX from 'xlsx'
import UserService from '../../../services/userService'

const statusOptions = [
  { value: "", label: "all" },
  { value: 1, label: "ok" },
  { value: 0, label: "locked" },
];

const statusActivated = [
  { value: "", label: "stationStatus" },
  { value: 0, label: "Activation" },
  { value: 1, label: "activated" }
]

const classifyOptions = [
  {value : "", label : "all_classify"},
  {value : 1, label : "personal"},
  {value : 2, label : "company"}
]

const statusCompany = [
  {value : "", label : "browse_company"},
  {value : 1, label : "browse"},
  {value : 0, label : "not_browse"}
]

const DefaultFilter = {
  filter: {
    active: 1,
    appUserRoleId: 0
  },
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc",
  },
};
const DataTableServerSide = ({ intl }) => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: "ID",
      selector: row => <div 
      onClick={(e) => {
        e.preventDefault();
        history.push("/user/form-user", row)
      }}
      className="click_row"
      >{row.appUserId}</div>,
      sortable: true,
      minWidth: "80px",
      maxWidth: '80px'
    },
    {
      name: intl.formatMessage({ id: "username" }),
      sortable: true,
      minWidth: "120px",
      maxWidth: "120px",
      cell : (row) =>{
        const {username} = row
        return (
          <a href={`tel:${username}`} className="click_row">{username}</a>
        )
      }
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
      name: intl.formatMessage({ id: "Email" }),
      sortable: true,
      minWidth: "200px",
      cell : (row) =>{
        const {email} = row
        return (
          <a href={`mailto:${email}`} className="click_row">{email}</a>
        )
      }
    },
    {
      name: intl.formatMessage({ id: "classify" }),
      center: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { appUserCategory } = row
        return (
          <div>
            {appUserCategory === 2 ? <div className="company">{intl.formatMessage({ id: "company" })}</div> : <div className="personal">{intl.formatMessage({ id: "personal" })}</div>}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "company" }),
      selector: "companyName",
      sortable: true,
      minWidth: "300px",
      maxWidth: "300px",
    },
    {
      name: intl.formatMessage({ id: 'lock' }),
      maxWidth: '100px',
      minWidth: '100px',
      center: true,
      cell: (row) => {
        return (
          <MySwitch
            checked={row.active === 0 ? true : false}
            onChange={e => {
              onUpdateStationEnableUse('AppUsers/updateUserById', {
                id: row.appUserId,
                data: {
                  active: e.target.checked ? 0 : 1
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: "createdAt" }),
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { createdAt } = row;
        return <div>{moment(createdAt).format("hh:mm DD/MM/YYYY")}</div>;
      },
    },
    {
      name: intl.formatMessage({ id: 'Activation' }),
      maxWidth: '100px',
      minWidth: '100px',
      center: true,
      cell: (row) => {
        return (
          <MySwitch
            checked={row.isVerifiedPhoneNumber === 1 ? true : false}
            onChange={e => {
              onUpdateStationEnableUse('AppUsers/updateUserById', {
                id: row.appUserId,
                data: {
                  isVerifiedPhoneNumber: e.target.checked ? 1 : 0
                }
              })
            }}
          />
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
      name: intl.formatMessage({ id: "action" }),
      selector: "action",
      cell: (row) => {
        const { appUserId, lastName, firstName, phoneNumber, active, username } = row;
        const newPhone = !phoneNumber || phoneNumber === "" ? " " : phoneNumber;
        return (
          <div>
            <span
              href="/"
              className="pointer"
              onClick={(e) => {
                e.preventDefault();
                history.push("/user/form-user", row)
              }}
            >
              <Edit className="mr-50" size={15} />{" "}
            </span>

            <span
              className="pointer ml-1"
              onClick={(e) => {
                e.preventDefault();
                let newItem = { ...row };
                setIdTrans(newItem);
                togglePasswordOpen();
              }}
            >
              <RotateCcw size={15} />
            </span>
          </div>
        );
      },
    },
  ];
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const history = useHistory()
  // ** States
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(20);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
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
    const token = window.localStorage.getItem(addKeyLocalStorage("accessToken"));

    if (token) {
      const newToken = token.replace(/"/g, "");

      UserService.getListUser(newParams,newToken ).then((res) => {
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

  const onUpdateStationEnableUse = (path, data) => {
    UserService.updateUserById(data).then(res => {
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

  const onExportExcel = async () => {
    let number = Math.ceil(total / 20)
    let params = Array.from(Array.from(new Array(number)),(element, index)  => index)
    let results = [];
    async function fetchData(param) {
      const response = await UserService.getListUser(
        {
          filter: {
            active: 1,
            appUserRoleId: 0
          },
          skip: param*20,
          limit: 20,
          order: {
            key: 'createdAt',
            value: 'desc'
          }
        },
      )
      const data = await response.data.data;
      return data;
    } 
      for (const param of params) {
        const result = await fetchData(param);
         results = [...results , ...result]
      }
      const convertedData = results.map(appUser => {
        return {
          'ID': appUser.appUserId,
          'Tài khoản': appUser.username,
          'Họ tên': appUser.firstName,
          'Email': appUser.email,
          'Phân loại': appUser.appUserCategory === 2 ? 'Công ty' : 'Cá nhân',
          'Công ty': appUser.companyName,
          'Khóa': appUser.active ? 'Hoạt động' : 'Khóa',
          'Ngày tạo': moment(appUser.createdAt).format('DD/MM/YYYY'),
          'Kích hoạt': appUser.isVerifiedPhoneNumber ? 'Đã kích hoạt' : 'Chưa kích hoạt'
        }
      })

        let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(convertedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
        XLSX.writeFile(wb, "NguoiDung.xlsx");
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col
            className="d-flex mt-sm-0 mt-1"
            sm="2" xs='12'
          >
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: "Search" })}
                className='dataTable-filter'
                type='search'
                bsSize='sm'
                id='search-input'
                value={searchValue}
                onChange={(e) => { setSearchValue(e.target.value) }}
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
          <Col sm="2" xs='6' className='mb-1'>
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
          <Col sm="2" xs='6' className='mb-1'>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange(name, value);
              }}
              type="select"
              value={
                paramsFilter.filter ? paramsFilter.filter.companyStatus || "" : ""
              }
              name="companyStatus"
              bsSize="sm"
            >
              {statusCompany.map((item) => {
                return (
                  <option value={item.value}>
                    {intl.formatMessage({ id: item.label })}
                  </option>
                );
              })}
            </Input>
          </Col>
          <Col sm="2" xs='6' className='mb-1'>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange(name, value);
              }}
              type="select"
              value={
                paramsFilter.filter ? paramsFilter.filter.isVerifiedPhoneNumber || "" : ""
              }
              name="isVerifiedPhoneNumber"
              bsSize="sm"
            >
              {statusActivated.map((item) => {
                return (
                  <option value={item.value}>
                    {intl.formatMessage({ id: item.label })}
                  </option>
                );
              })}
            </Input>
          </Col>
          <Col sm="2" xs='6'>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange(name, value);
              }}
              type="select"
              value={
                paramsFilter.filter ? paramsFilter.filter.appUserCategory || "" : ""
              }
              name="appUserCategory"
              bsSize="sm"
            >
              {classifyOptions.map((item) => {
                return (
                  <option value={item.value}>
                    {intl.formatMessage({ id: item.label })}
                  </option>
                );
              })}
            </Input>
          </Col>
          <Col sm='2' xs='6'>
            <LoadingDialog 
            onExportListCustomers={onExportExcel}
            title={intl.formatMessage({ id: "export" })}
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

      <ResetPasswordUser item={idTrans} open={sidebarPasswordOpen} toggleSidebar={togglePasswordOpen} />
    </Fragment>
  );
};

export default injectIntl(memo(DataTableServerSide));
