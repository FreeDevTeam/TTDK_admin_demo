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
import { ChevronDown, } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import _ from "lodash";
import MySwitch from '../../components/switch';

const DefaultFilter = {
  filter: {

  },
  skip: 0,
  limit: 20,
}

const statusOptions = [
  { value: '', label: 'all_location' },
  { value: 1, label: 'Đăng kiểm viên' },
  { value: 2, label: 'Đăng kiểm viên bậc cao' },
 
]

const Staff = ({ intl }) => {
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [data, setData] = useState([])
  const [total, setTotal] = useState(20)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState('');
  const [role, setRole] = useState([]);
  const [listStation, setListStation] = useState([])
  
  const nameOptions = [
    { value: '', label: 'all_role' },
    { value: 1, label: intl.formatMessage({ id: 'patern' }) },
    { value: 2, label: intl.formatMessage({ id: 'technicians' }) },
    { value: 3, label: 'Kỹ thuật viên bậc cao' },
    { value: 4, label: 'Kế toán' },

  ]

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

      Service.send({
        method: "POST",
        path: "AppUsers/getListUser",
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

  function getListRole() {
    Service.send({
      method: 'POST',
      path: 'AppUserRole/find',
      data: {
        filter: {},
      },
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setRole(data.data)
        }
      }
    })
  }

  function getListStation() {
    Service.send({
      method: 'POST',
      path: 'Stations/find',
      data: {
        filter: {},
        skip: 0,
        limit: 500,
        order: {
          key: 'createdAt',
          value: 'desc',
        },
      },
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setListStation(data.data)
        }
      }
    })
  }

  const handleUpdateStationsId = (data) => {
    Service.send({
      method: 'POST',
      path: 'AppUsers/updateUserById',
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
      name: intl.formatMessage({ id: "ID" }),
      selector: "appUserId",
      sortable: true,
      minWidth: "80px",
      maxWidth: "80px",
    },
    {
      name: intl.formatMessage({ id: "username" }),
      selector: "username",
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
    },
    {
      name: intl.formatMessage({ id: "fullname" }),
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        return (
          <div>
            {row.firstName} {row.lastName}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "rank" }),
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const { appUserLevel, appUserId } = row;
        return <Input
        onChange={(e) => {
          const { name, value } = e.target;
          handleChange(name, value, appUserId)
        }}
        type="select"
        name="appUserLevel"
        bsSize="sm"
        defaultValue={appUserLevel || ''}
      >
        <option value=''> {intl.formatMessage({ id: 'chose' })}</option>
          {role.map((item) => {
            return <option value={item.appUserRoleId}>{item.appUserRoleName}</option>
          })}
      </Input>;
      },
    },
    {
      name: intl.formatMessage({ id: "stationCode" }),
      selector: "stationCode",
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const { stationCode, appUserId, stationsId } = row;

        return <Input
          onChange={(e) => {
            const { name, value } = e.target;
            const data = {
              id: appUserId,
              data: {
                [name]: (value * 1)
              }
            }
            handleUpdateStationsId(data);
          }}
          type="select"
          name="stationsId"
          bsSize="sm"
          value={stationsId || ""}
        >
          <option value=''> {intl.formatMessage({ id: 'chose' })}</option>
          {listStation?.map((item) => (
            <option value={item.stationsId}>{item.stationCode}</option>
          ))}
        </Input>;
      },
    },
    {
      name: intl.formatMessage({ id: "phoneNumber" }),
      selector: "phoneNumber",
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
    },
    {
      name: intl.formatMessage({ id: "Email" }),
      selector: "email",
      sortable: true,
      minWidth: "200px",
      // maxWidth: "200px",
    },
    {
      name: intl.formatMessage({  id: 'lock' }),
      maxWidth: '150px',
      minWidth: '150px', 
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
      selector: "salary",
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const { createdAt } = row;

        return <div>{moment(createdAt).format("hh:mm DD/MM/YYYY")}</div>;
      },
    },
  ]

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
    getListRole()
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

  const onUpdateStationEnableUse = (path, data) => {
    Service.send({
      method: 'POST', path: path, data: data, query: null
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

  return (
    <>
      <Row className='mx-0 mt-1 mb-50'>
        <Col sm='2' xs='6'>
          <Input onChange={(e) => {
            const { name, value } = e.target
            handleFilterChange(name, value)
          }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.appUserLevel || '') : ''} name='appUserLevel' bsSize='xs' >
            {
              statusOptions.map(item => {
                return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
              })
            }
          </Input>
        </Col>
        <Col sm='2' xs='6'>
          <Input onChange={(e) => {
            const { name, value } = e.target
            handleFilterChange(name, value)
          }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.appUserRoleId || '') : ''} name='appUserRoleId' bsSize='xs' >
            {
              nameOptions.map(item => {
                return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
              })
            }
          </Input>
        </Col>
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
    </>
  )
}

export default injectIntl(memo(Staff));