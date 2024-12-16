import moment from "moment";
import Flatpickr from 'react-flatpickr'
import "@styles/react/libs/tables/react-dataTable-component.scss";
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { toast } from "react-toastify";
import addKeyLocalStorage from "../../../helper/localStorage";
import {
  Card, Input, Label, Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle,
  Modal, ModalHeader, ModalBody,
  Button, FormGroup, Form, InputGroup, InputGroupButtonDropdown
} from 'reactstrap'
import { Fragment, useState, useEffect, memo } from 'react'
import Service from '../../../services/request'
import { injectIntl } from 'react-intl';
import SationService from '../../../services/station'
import { ChevronDown, Eye, EyeOff, Edit, RotateCcw, Search } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import _ from "lodash";
import MySwitch from '../../components/switch';
import TechnicianService from '../../../services/TechnicianService'
import { useHistory } from 'react-router-dom'
import { LOCAL } from "./../../../constants/app";
import UserService from '../../../services/userService'

const statusOptions = [
  { value: '', label: 'all_location' },
  { value: 2, label: 'Đăng kiểm viên' },
  { value: 3, label: 'Đăng kiểm viên bậc cao' },
]

const DataTableRegistrar = ({ intl, stationsId }) => {
  const DefaultFilter = {
    filter: {
      active: 1,
      stationsId : stationsId
    },
    skip: 0,
    limit: 20,
  }
  const history = useHistory()
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [data, setData] = useState([])
  const [total, setTotal] = useState(20)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState('');
  const [role, setRole] = useState([]);
  const [listStation, setListStation] = useState([])
  const [idTrans, setIdTrans] = useState(null);
  const [searchValue, setSearchValue] = useState('')
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false);
  const togglePasswordOpen = () => {
    setSidebarPasswordOpen(!sidebarPasswordOpen);
  };

  const nameOptions = [
    { value: '', label: 'all_role' },
    { value: 1, label: intl.formatMessage({ id: 'patern' }) },
    { value: 2, label: intl.formatMessage({ id: 'technicians' }) },
    { value: 3, label: 'Kỹ thuật viên bậc cao' },
    { value: 4, label: 'Kế toán' },

  ]
  
  const token = window.localStorage.getItem(addKeyLocalStorage("accessToken"));
  const newToken = token.replace(/"/g, "");
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

    if (token) {

      TechnicianService.getList(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res;
          setParamsFilter(newParams);
          if (statusCode === 200) {
            setTotal(data.total);
            setData(data.data);
          } else {
            toast.warn(intl.formatMessage({ id: "actionFailed" }));
          }
        } else {
          setTotal(1);
          setData([]);
        }
        if (!isNoLoading) {
          setIsLoading(false);
        }
      });
    } else {
      window.localStorage.clear();
    }
  }

  // function getListRole() {
  //   UserService.getListRole().then((res) => {
  //     if (res) {
  //       const { statusCode, data } = res
  //       if (statusCode === 200) {
  //         setRole(data.data)
  //       }
  //     }
  //   })
  // }

  function getListStation() {
    SationService.getListStation({
      filter: {},
      skip: 0,
      limit: 500,
      order: {
        key: 'createdAt',
        value: 'desc',
      },
    }, newToken).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setListStation(data.data)
        }
      }
    })
  }

  // const handleUpdateStationsId = (data) => {
  //   UserService.updateUserById(data).then((res) => {
  //     if (res) {
  //       const { statusCode } = res
  //       if (statusCode === 200) {
  //         getData(paramsFilter, true)
  //         toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
  //       } else {
  //         toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
  //       }
  //     }
  //   })
  // }
  
  // ** Function to handle Pagination and get data
  const handlePagination = page => {

    const newParams = {
      ...paramsFilter,
      skip: (page.selected) * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)

  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        }
      />
    )
  }

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

  const handleUpdateData = (data) => {
    Service.send({
      method: 'POST',
      path: 'AppUserWorkInfo/updateById',
      data: data,
      query: null
    }).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter, true)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0,
    }
    getData(newParams)
  }

  useEffect(() => {
    getData(paramsFilter)
    // getListRole()
    getListStation()
  }, []);

  const handleChange = (name, value, appUserId) => {
    const data = {
      id : appUserId,
      data: {
        appUserLevel : value
      }
    }
    handleUpdateData(data)
  }

  // const onUpdateStationEnableUse = (path, data) => {
  //   UserService.updateUserById(data).then(res => {
  //     if (res) {
  //       const { statusCode } = res
  //       if (statusCode === 200) {
  //         getData(paramsFilter, true)
  //         toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
  //       } else {
  //         toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
  //       }
  //     }
  //   })
  // }

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
  }
  
  return (
    <Fragment>
      <Card>
      <Row className='mx-0 mt-1 mb-50'>
      <Col className="mb-1 d-flex" sm="2" xs="12">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter"
                type="search"
                bsSize="sm"
                id="search-input"
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
        <Col sm='2' xs='6'>
          <Input onChange={(e) => {
            const { name, value } = e.target
            handleFilterChange(name, value)
          }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.appUserRoleId || '') : ''} name='appUserRoleId' bsSize='sm' >
            {
              statusOptions.map(item => {
                return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
              })
            }
          </Input>
        </Col>
        {/* <Col sm='2' xs='6'>
          <Input onChange={(e) => {
            const { name, value } = e.target
            handleFilterChange(name, value)
          }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.appUserRoleId || '') : ''} name='appUserRoleId' bsSize='sm' >
            {
              nameOptions.map(item => {
                return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
              })
            }
          </Input>
        </Col> */}
      </Row>
      <div id="users-data-table mx-0 mt-1 mb-50 margin">
        <DataTable
          noHeader
          pagination
          paginationServer
          className='react-dataTable margin'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={data}
          progressPending={isLoading}
        />
      </div>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(DataTableRegistrar));