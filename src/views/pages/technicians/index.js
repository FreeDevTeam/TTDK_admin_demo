// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import { Search, Edit, Lock, Shield, RotateCcw, X, Eye, EyeOff } from "react-feather";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import { useHistory } from 'react-router-dom'
import ResetPasswordUser from "./resetPasswordUser";
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
import MySwitch from '../../components/switch';
import addKeyLocalStorage from "../../../helper/localStorage";
import { log } from "handlebars";
import { readAllStationsDataFromLocal } from "../../../helper/localStorage";
import { LOCAL } from "./../../../constants/app";
import LoadingDialog from "../../components/buttons/ButtonLoading";
import XLSX from 'xlsx'
import TechnicianService from '../../../services/TechnicianService'
import UserService from '../../../services/userService'

const statusOptions = [
  { value: '', label: 'all_location' },
  { value: 1, label: 'Đăng kiểm viên' },
  { value: 2, label: 'Đăng kiểm viên bậc cao' },
]

const userOptions = [
    {value : 1, label : "station_director"},
    {value : 2, label : "registrar"}
]

const DefaultFilter = {
  filter: {
    active: 1
  },
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc",
  },
};

const DataTableTechnician = ({ intl }) => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name:intl.formatMessage({ id: "code_dkv" }),
      selector: row => <div 
      onClick={(e) => {
        e.preventDefault();
        history.push("/user/form-technicians", row)
      }}
      className="click_row"
      >{row.employeeCode ? row.employeeCode : '-'}</div>,
      sortable: true,
      maxWidth: "120px",
      minWidth: "120px",
    },
    {
      name: intl.formatMessage({ id: "fullname" }),
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const {firstName } = row
        return (
          <div>
            {firstName ? firstName : '-'}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "stationCode" }),
      sortable: true,
      minWidth: "120px",
      maxWidth: "120px",
      cell: (row) => {
        const {stationCode } = row
        return (
          <div>
            {stationCode ? stationCode : '-'}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "high_level" }),
      selector: "appUserLevel",
      center: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell : (row) =>{
        const { appUserLevel } = row
        return (
          <div>{appUserLevel === LOCAL.high_level ? 'X' :'-'}</div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: "normal" }),
      selector: "appUserLevel",
      center: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell : (row) =>{
        const { appUserLevel } = row
        return (
          <div>{appUserLevel === LOCAL.normal ? 'X' :'-'}</div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: "CCCD" }),
      selector: "appUserIdentity",
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const {appUserIdentity } = row
        return (
          <div>
            {appUserIdentity ? appUserIdentity : '-'}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "birthDay" }),
      selector: "birthDay",
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const {birthDay } = row
        return (
          <div>
            {birthDay ? birthDay : '-'}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "home_town" }),
      selector: "userHomeAddress",
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const {userHomeAddress } = row
        return (
          <div>
            {userHomeAddress ? userHomeAddress : '-'}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "documentExpireDay" }),
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { licenseDateEnd } = row;
        return <div>{licenseDateEnd ? licenseDateEnd : '-'}</div>;
      },
    },
    {
      name: intl.formatMessage({ id: "certificate_number" }),
      selector: "licenseNumber",
      sortable: true,
      minWidth: "140px",
      maxWidth: "140px",
      cell: (row) => {
        const {licenseNumber } = row
        return (
          <div>
            {licenseNumber ? licenseNumber : '-'}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "show" }),
      center: true,
      minWidth: "100px",
      maxWidth: "100px",
      cell: (row) => {
        const { isHidden } = row;
        return <div>{isHidden === 0 ? <div className="pointer"
        onClick={() =>handleClick(row)}
        ><Eye />
        </div> : <div className="pointer"
        onClick={() =>handleClick(row)}
        ><EyeOff />
        </div>}</div>;
      },
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
                  history.push("/user/form-technicians", row)
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
  const [role, setRole] = useState([]);
  const readLocal = readAllStationsDataFromLocal();
  const listStation = readLocal.sort((a,b) => a - b)
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

      TechnicianService.getList(newParams, newToken).then((res) => {
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

  function getListRole() {
    UserService.getListRole().then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setRole(data.data)
        }
      }
    })
  }

  const handleClick = (row) =>{
    if(row.isHidden === 0){
      UserService.updateUserById({
        id : row.appUserId,
        data : {
          isHidden: 1
        }
      }).then(res => {
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
    } else {
      UserService.updateUserById({
        id : row.appUserId,
        data : {
          isHidden: 0
        }
      }).then(res => {
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
  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true);
  }, 1000);

  // ** Get data on mount
  useEffect(() => {
    getListRole()
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

  const onExportExcel = async () => {
    let number = Math.ceil(total / 20)
    let params = Array.from(Array.from(new Array(number)),(element, index)  => index)
    let results = [];
    async function fetchData(param) {
      const response = await TechnicianService.getList(
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
        const { lastActiveAt, createdAt } = appUser
        let today = moment()
        let dayCount = today.diff(lastActiveAt === null ? createdAt : lastActiveAt, 'days')
        let activeStatus = dayCount < 2 ? "Đang hoạt động" : `Hoạt động ${dayCount} ngày trước`
        return {
          'Mã ĐKV': appUser.employeeCode,
          'Họ và tên': appUser.firstName,
          'Mã trạm': appUser.stationCode,
          'ĐKV XCG bậc cao' : appUser.appUserLevel === LOCAL.high_level ? 'X' :'-',
          'ĐKV XCG' : appUser.appUserLevel === LOCAL.normal ? 'X' :'-',
          'Số CCCD' : appUser.appUserIdentity,
          'Năm sinh' : appUser.birthDay,
          'Quê quán' : appUser.userHomeAddress,
          'Ngày hết hạn': appUser.licenseDateEnd ? appUser.licenseDateEnd : '-',
          'Số giấy chứng nhận' : appUser.licenseNumber
        }
      })

        let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(convertedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
        XLSX.writeFile(wb, "Dangkiemvien.xlsx");
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
        <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1 mb-1"
            sm="2" xs='8'
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
          </Col>
          <Col sm='1' xs='4'>
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
                paramsFilter.filter ? paramsFilter.filter.stationsId || "" : ""
              }
              name="stationsId"
              bsSize="sm"
            >
              <option value={''}>
                {' '}
                {intl.formatMessage({ id: 'stationCode' })}
              </option>
              {listStation?.map((item) => (
                <option value={item.stationsId}>{item.stationCode}</option>
              ))}
            </Input>
          </Col>
          <Col sm="2" xs='6'>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange(name, value);
              }}
              type="select"
              //   value={
              //     paramsFilter.filter ? paramsFilter.filter.active || "" : ""
              //   }
              name="appUserLevel"
              bsSize="sm"
            >
              {statusOptions.map(item => {
                return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
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

export default injectIntl(memo(DataTableTechnician));
