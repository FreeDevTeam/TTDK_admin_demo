// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify'
import _ from 'lodash'
import './index.scss'
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown, Trash, Edit, Bell } from 'react-feather'
import DataTable from 'react-data-table-component'
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
  Badge
} from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import { injectIntl } from 'react-intl'
import { VEHICLE_TYPE } from './../../../constants/app'
import addKeyLocalStorage from '../../../helper/localStorage'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import SationService from '../../../services/station'
import Type from '../../components/vehicletype'
import { SCHEDULE_TYPE } from '../../../constants/app'
import { SCHEDULE_STATUS } from "./../../../constants/app";
import { readAllStationsDataFromLocal } from "../../../helper/localStorage";

const vehicleTypes = [
  { value: "", label: "all_vehicle" },
  { value: 1, label: "car" },
  { value: 20, label: "ro_mooc" },
  { value: 10, label: "other" },
];

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20,
  order: {
    key: 'createdAt',
    value: 'desc'
  }
}
const ListSchedule = ({ intl }) => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'code_schedule' }),
      selector: 'scheduleCode',
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'stations' }),
      selector: 'stationCode',
      minWidth: '100px',
      maxWidth: '100px'
    },
    {
      name: intl.formatMessage({ id: 'contact' }),
      maxWidth: '140px',
      minWidth: '140px',
      cell: (row) => {
        const { phone, fullnameSchedule } = row
        return (
          <div>
            <div>{phone}</div>
            <div>{fullnameSchedule}</div>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'services' }),
      maxWidth: '170px',
      minWidth: '170px',
      cell: (row) => {
        const { scheduleType } = row
        return (
          <div>
            {scheduleType === SCHEDULE_TYPE.VEHICLE_INSPECTION
              ? <Badge color='light-success' className='size_text'>{intl.formatMessage({ id: 'old_car_registration' })}</Badge>
              : scheduleType === SCHEDULE_TYPE.NEW_VEHICLE_INSPECTION
              ? <Badge color='light-danger' className='size_text'>{intl.formatMessage({ id: 'new_car_registration' })}</Badge>
              : scheduleType === SCHEDULE_TYPE.REGISTER_NEW_VEHICLE
              ? <Badge color='light-info' className='size_text'>{intl.formatMessage({ id: 'new_car_profile' })}</Badge>
              : '-'}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'information' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { vehicleType, licensePlates } = row
        return (
          <div>
            <div>{licensePlates}</div>
            <Type vehicleType={String(vehicleType)} />
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'time' }),
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { dateSchedule, time } = row
        return (
          <div>
            <div>{dateSchedule}</div>
            <div>{time}</div>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'createdAt' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { createdAt } = row
        return <div>{moment(createdAt).format('DD/MM/YYYY hh:mm')}</div>
      }
    },
    {
      name: intl.formatMessage({ id: "messageStatus" }),
      selector: "CustomerScheduleStatus",
      minWidth: "150px",
      cell: (row) => {
        const { CustomerScheduleStatus } = row;
        return (
          <div>
            {CustomerScheduleStatus === SCHEDULE_STATUS.NEW
              ? <Badge color='light-info' className='size_text'>{intl.formatMessage({ id: 'unconfimred' })}</Badge>
              : CustomerScheduleStatus === SCHEDULE_STATUS.CONFIRMED
              ? <Badge color='light-warning' className='size_text'>{intl.formatMessage({ id: 'confirmed' })}</Badge>
              : CustomerScheduleStatus === SCHEDULE_STATUS.CANCELED
              ? <Badge color='light-danger' className='size_text'>{intl.formatMessage({ id: 'canceled' })}</Badge>
              : <Badge color='light-success' className='size_text'>{intl.formatMessage({ id: 'closed' })}</Badge>}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      cell: (row) => {
        const { customerScheduleId } = row
        return (
          <>
            <div
              href="/"
              className="pointer"
              onClick={() => {
                setOpenOne(true)
                setCustomerScheduleId(customerScheduleId)
              }}>
              <Trash className="pointer" size={15} />
            </div>
            <div href="/"
              className="pointer"
              onClick={() => {
                setOpenTwo(true)
                // setCustomerScheduleId(customerScheduleId)
              }}>
              <Bell className="pointer ml-2" size={15} />
            </div>
            <div 
              href="/" 
              className="pointer" 
              onClick={(e) => {
              e.preventDefault();
              history.push("/pages/edit-schedule", row)
            }}>
              <Edit className="pointer ml-2" size={15} />
            </div>
          </>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)

  // ** States
  const [block, setBlock] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)
  // const [passwordData, setPasswordData] = useState([]);
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false)
  const [idTrans, setIdTrans] = useState(null)
  const [date, setDate] = useState('')
  const [openOne, setOpenOne] = useState(false)
  const [openTwo, setOpenTwo] = useState(false)
  const [customerScheduleId, setCustomerScheduleId] = useState('')
  const [desc, setDesc] = useState('')
  const readLocal = readAllStationsDataFromLocal();
  const listStation = readLocal.sort((a,b) => a - b)
  const history = useHistory()

  const vehicleType = [
    { value: '', label: 'all' },
    { value: 1, label: 'car' },
    { value: 20, label: 'ro_mooc' },
    { value: 10, label: 'other' }
  ]

  const togglePasswordOpen = () => {
    setSidebarPasswordOpen(!sidebarPasswordOpen)
  }
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})

  function getData(params, isNoLoading) {
    const newParams = {
      ...params
    }
    if (!isNoLoading) {
      setIsLoading(true)
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, '')

      SationService.getList(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setTotal(data.total)
            setItems(data.data)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        } else {
          setTotal(1)
          setItems([])
        }
        if (!isNoLoading) {
          setIsLoading(false)
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true)
  }, 1000)

  const handleFilterDay = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    setDate(newDate)
    const newParams = {
      filter: {
        dateSchedule: newDate
      },
      skip: 0,
      limit: 20,
      order: {
          "key": "createdAt",
          "value": "desc"
      }
  };
    getDataSearch(newParams)
  }

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
  }, [])

  // ** Function to handle filter
  const handleFilter = (e) => {
    const { value } = e.target
    setSearchValue()
    const newParams = {
      ...paramsFilter,
      searchText: value || undefined,
      order: {
        key: 'createdAt',
        value: 'desc'
      },
      skip: 0
    }
    getDataSearch(newParams)
  }

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0
    }
    getData(newParams)
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
  }

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0
    }
    getData(newParams)
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'}
      />
    )
  }

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
  }

  const handleDelete = (data) => {
    SationService.handleDelete(data).then((res) => {
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

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col className="mb-1" sm="2" xs="12">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter"
                type="text"
                bsSize="sm"
                id="search-input"
                value={searchValue}
                onChange={(e) => {
                  handleFilter(e)
                }}
              />
            </InputGroup>
          </Col>
          <Col className="mb-1" sm="2" xs="6">
            <Input
              onChange={(e) => {
                const { name, value } = e.target
                handleFilterChange(name, value)
              }}
              type="select"
              value={paramsFilter.filter ? paramsFilter.filter.vehicleType || '' : ''}
              name="vehicleType"
              bsSize="sm"
              className="form-control-input">
              {vehicleTypes.map((item) => {
                return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
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
          <Col className="mb-1" sm="2" xs="6">
            <Flatpickr
              id="single"
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y' }}
              placeholder={intl.formatMessage({ id: 'day_schedule' })}
              className="form-control form-control-input"
              onChange={(date) => {
                document.getElementById('clear').style.display = 'block'
                handleFilterDay(date)
              }}
            />
          </Col>

          <Col sm="1" className="mb-1 clear_text" id="clear">
            <Button
              className="form-control-input "
              onClick={() => {
                getDataSearch({
                  ...paramsFilter,
                  filter: {}
                })
                setDate('')
                document.getElementById('clear').style.display = 'none'
              }}>
              X
            </Button>
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
      <Modal isOpen={openOne} toggle={() => setOpenOne(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader>{intl.formatMessage({ id: 'cancel_appointment' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleDelete({
                ...data,
                customerScheduleId: customerScheduleId,
                })
              setOpenOne(false)
            })}>
            <FormGroup>
              <Input 
              name="reason" 
              type="textarea" 
              rows={5} 
              className="mb-2" 
              innerRef={register({required: true})} 
              invalid={errors.username && true} 
              />
            </FormGroup>
            <FormGroup className="d-flex justify-content-center">
              <Button.Ripple className="mr-1" color="info" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={openTwo} toggle={() => setOpenTwo(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader>{intl.formatMessage({ id: 'notification_information' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              // handleDelete({
              //   ...data,
              //   customerScheduleId: customerScheduleId,
              //   })
              setOpenTwo(false)
            })}>
            <FormGroup>
              <Input 
              name="reason" 
              type="textarea" 
              rows={5} 
              className="mb-2" 
              innerRef={register({required: true})} 
              invalid={errors.username && true} 
              />
            </FormGroup>
            <FormGroup className="d-flex justify-content-center">
              <Button.Ripple className="mr-1" color="success" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(memo(ListSchedule))
