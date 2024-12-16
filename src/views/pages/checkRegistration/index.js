// @ts-nocheck
// ** React Imports
import { Fragment, memo, useEffect, useState } from 'react'
// ** Store & Actions
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import DataTable from 'react-data-table-component'
import { Bell, ChevronDown, Edit, Trash } from 'react-feather'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Badge, Button, Card, Col, Form, FormGroup, Input, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import addKeyLocalStorage, { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import BillService from '../../../services/billService'
import StationFunctions from '../../../services/StationFunctions'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import Type from '../../components/vehicletype'
import './index.scss'

const DefaultFilter = {
  filter: {
    processingStatus: 0
  },
  skip: 0,
  limit: 20
}

const CheckRegistration = ({ intl }) => {
  // ** Store Vars

  const VEHICLE_DEALS_PROCESS_STATUS = [
    { value: 0, label: 'Chưa xử lý', color: 'primary' },
    { value: 1, label: 'Hoàn thành', color: 'secondary' },
    { value: 2, label: 'Báo lỗi', color: 'success' }
  ]

  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'messagesDetail-customerMessagePlateNumber' }),
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { vehicleIdentity, vehiclePlateColor } = row
        return (
          <p
            className={`color_licensePlates
            ${vehiclePlateColor === 1 ? 'color_white' : ' '}
            ${vehiclePlateColor === 2 ? 'color_blue' : ' '}
            ${vehiclePlateColor === 3 ? 'color_yellow' : ' '}
            ${vehiclePlateColor === 4 ? 'color_red' : ' '}
          `}>
            {vehicleIdentity}
          </p>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'Area' }),
      selector: 'dealArea',
      center: true,
      minWidth: '150px',
      maxWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'transportation' }),
      selector: 'vehicleType',
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { vehicleType } = row
        return <Type vehicleType={vehicleType} />
      }
    },
    {
      name: 'Số seri GCN',
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { certificateSeries } = row
        return <div>{certificateSeries}</div>
      }
    },
    {
      name: 'Ngày hết hạn đăng kiểm',
      selector: 'scheduleCode',
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        // tạm thời hardcode
        const { vehicleExpiryDate } = row
        return <div>{vehicleExpiryDate}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'stationStatus' }),
      maxWidth: '200px',
      minWidth: '200px',
      center: true,
      cell: (row) => {
        const { processingStatus } = row
        const news = VEHICLE_DEALS_PROCESS_STATUS.find((el) => el.value === processingStatus)
        return <Badge color={news?.color}>{news?.label}</Badge>
      }
    },
    {
      name: intl.formatMessage({ id: 'note' }),
      maxWidth: '400px',
      minWidth: '400px',
      cell: (row) => {
        const { dealNote } = row
        return <div className="text-flow">{dealNote}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      maxWidth: '150px',
      minWidth: '150px',
      cell: (row) => {
        const { dealNote } = row
        return (
          <>
            <div
              href="/"
              className="pointer"
              onClick={() => {
                setOpenOne(true)
                setDealNote(dealNote)
                setUserData(row)
              }}>
              <Trash className="pointer" size={15} />
            </div>
            <div
              href="/"
              className="pointer"
              onClick={() => {
                setOpenTwo(true)
                setCustomerScheduleId(customerScheduleId)
              }}>
              <Bell className="pointer ml-2" size={15} />
            </div>
            {/* <div
              href="/"
              className="pointer"
              onClick={(e) => {
                e.preventDefault()
                history.push('/pages/edit-schedule', row)
              }}>
              <Edit className="pointer ml-2" size={15} />
            </div> */}
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
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const history = useHistory()
  const [dealNote, setDealNote] = useState('')
  const [listStationArea, setListStationArea] = useState()
  const listArea = listStationArea?.map((item) => {
    return { ...item, label: item.value }
  })
  listArea?.unshift({ value: '', label: 'Tất cả khu vực' })

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

      BillService.getRegistrationExpireDeals(newParams, newToken).then((res) => {
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

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
    getListStationArea()
  }, [])

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if (page === 1) {
      getData(newParams)
      return null
    }
    getData(newParams)
    setCurrentPage(page + 1)
  }

  const CustomPaginations = () => {
    const lengthItem = items.length
    return <BasicTablePaging items={lengthItem} handlePaginations={handlePaginations} skip={paramsFilter.skip} />
  }

  function getListStationArea() {
    StationFunctions.getListStationArea().then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setListStationArea(data)
        }
      }
    })
  }

  function handleUpdateData(item) {
    BillService.updateDealsVehicle(item).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          getData(paramsFilter)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col className="mb-1" sm="3" xs="6">
            <BasicAutoCompleteDropdown
              placeholder="Trạng thái"
              name="processingStatus"
              options={VEHICLE_DEALS_PROCESS_STATUS}
              onChange={({ value }) => handleFilterChange('processingStatus', value)}
            />
          </Col>
          <Col sm="3" xs="6" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder="Khu vực"
              name="dealArea"
              options={listArea}
              onChange={({ value }) => handleFilterChange('dealArea', value)}
            />
          </Col>
        </Row>
        <div id="users-data-table">
          <DataTable
            noHeader
            // pagination
            paginationServer
            className="react-dataTable"
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10} />}
            // paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
      </Card>
      <Modal isOpen={openOne} toggle={() => setOpenOne(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader>{intl.formatMessage({ id: 'error_report' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              const newData = {
                id: userData?.appUserVehicleId,
                data: {
                  dealNote : dealNote,
                  dealStatus : 2
                }
              }
              handleUpdateData(newData)
              setOpenOne(false)
            })}>
            <FormGroup>
              <Input
                name="dealNote"
                type="textarea"
                rows={5}
                className="mb-2"
                innerRef={register({ required: true })}
                invalid={errors.username && true}
                onChange={(e) => setDealNote(e.target.value)}
                value={dealNote}
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
              //   handleNotification({
              //     ...data,
              //     customerScheduleId: customerScheduleId
              //   })
              setOpenTwo(false)
            })}>
            <FormGroup>
              <Input
                name="message"
                type="textarea"
                rows={5}
                className="mb-2"
                innerRef={register({ required: true })}
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

export default injectIntl(memo(CheckRegistration))
