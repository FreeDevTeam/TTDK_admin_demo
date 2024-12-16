import '@styles/react/libs/flatpickr/flatpickr.scss'
import _ from 'lodash'
import moment from 'moment'
import React, { Fragment, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Chrome, Edit, Search, Trash } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Badge, Button, Card, Col, Form, FormGroup, Input, InputGroup, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import OrderRequest from '../../../services/order'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import './index.scss'

const Order = ({ intl }) => {
  const DefaultFilter = {
    filter: {},
    skip: 0,
    limit: 20
  }

  const stations_location = [
    { value: undefined, label: 'all_location', color: '' },
    { value: 0, label: 'unconfimred', color: 'warning' },
    { value: 10, label: 'confirmed', color: 'success' },
    { value: 20, label: 'canceled', color: 'primary' },
    { value: 30, label: 'closed', color: 'secondary' }
  ]

  const ORDER_PAYMENT_STATUS = [
    { value: undefined, label: 'Tất cả trạng thái thanh toán' },
    { value: 'New', label: 'Mới', color: 'primary' },
    { value: 'Processing', label: 'Tính phí thất bại cần xử lý lại', color: 'success' },
    { value: 'Pending', label: 'Đang trong quá trình xử lý', danger: 'danger' },
    { value: 'Failed', label: 'Thanh toán thất bại', color: 'warning' },
    { value: 'Success', label: 'Thanh toán thành công', color: 'info' },
    { value: 'Canceled', label: 'Đã huỷ', color: 'dark' }
  ]

  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [items, setItems] = useState([])
  const history = useHistory()
  const [searchValue, setSearchValue] = useState('')
  const [date, setDate] = useState('')
  const [firstPage, setFirstPage] = useState(false)
  const [openOne, setOpenOne] = useState(false)
  const [update, setUpdate] = useState({})
  const [note, setNote] = useState('')
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })

  const getData = async (defaultFilter) => {
    const res = await OrderRequest.getList(defaultFilter)
    setItems(res.data)
  }

  useEffect(() => {
    getData(paramsFilter)
  }, [])

  const handleSearch = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    getData(newParams)
  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true)
  }, 1000)

  const handleFilterDay = (date) => {
    setFirstPage(!firstPage)
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    setDate(newDate)
    const newParams = {
      filter: {
        ...paramsFilter.filter,
        dateSchedule: newDate
      },
      skip: 0,
      limit: 20
    }
    getDataSearch(newParams)
  }

  const handleFilterChange = (name, value) => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0
    }
    // if(name === "orderStatus" && value === ""){
    //   delete newParams.filter.orderStatus
    // }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const CustomPaginations = () => {
    const lengthItem = items.length
    return <BasicTablePaging items={lengthItem} firstPage={firstPage} handlePaginations={handlePaginations} />
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const ORDER_TYPE = [
    { value: 1, label: 'Hóa đơn thanh toán dành cho Lịch đăng kiểm' },
    { value: 2, label: 'Hóa đơn thanh toán dành cho Tự động thông báo phạt nguội' },
    { value: 3, label: 'Hóa đơn thanh toán dành cho Thanh toán tiền tip' }
  ]

  const columns = [
    {
      name: intl.formatMessage({ id: 'ID' }),
      sortable: true,
      minWidth: '80px',
      maxWidth: '80px',
      cell: (row, index) => {
        // return <div>{paramsFilter.skip + index + 1}</div>
        return <div>{row?.orderId}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'information' }),
      sortable: true,
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        return (
          <div>
            <div className="order-text">{row?.firstName}</div>
            <div className="order-text">{row?.companyName}</div>
            <div className="">{row?.phoneNumber}</div>
          </div>
        )
      }
    },
    {
      name: 'Thông tin đơn hàng',
      sortable: true,
      minWidth: '250px',
      maxWidth: '250px',
      cell: (row) => {
        const valueOrder = ORDER_TYPE.find((el) => el.value === row?.orderType)
        const paramsOrder = stations_location.find((el) => el.value === row?.orderStatus)
        return (
          <div>
            <div className="order-text">{valueOrder?.label}</div>
            <div className="order-text">
              Trạng thái :{' '}
              <Badge color={paramsOrder?.color} className="order-text">
                {intl.formatMessage({ id: paramsOrder?.label })}
              </Badge>
            </div>
            <div className="order-text">Ngày tạo : {moment(row?.createdAt).format('hh:mm DD/MM/YYYY')}</div>
            <div className="order-text">Nơi giới thiệu : {row?.partnerName}</div>
            <div className="order-text">Nơi tiếp nhận : {row?.stationsName}</div>
          </div>
        )
      }
    },
    {
      name: 'Thanh toán đơn hàng',
      sortable: true,
      minWidth: '300px',
      maxWidth: '300px',
      cell: (row) => {
        const value = ORDER_PAYMENT_STATUS.find((el) => el.value === row?.paymentStatus)
        return (
          <div>
            <div className="order-text">Tổng tiền phải thu : {row?.totalPayment}</div>
            <div className="order-text">Đã thanh toán : {row?.total}</div>
            <div className="order-text">
              Trạng thái :{' '}
              <Badge color={value?.color} className="order-text">
                {value?.label}
              </Badge>
            </div>
            <div className="order-text text-table">Ngày thanh toán : {row?.ngayThanhToan}</div>
            <div className="order-text text-table">Hình thức : {row?.hinhThuc}</div>
          </div>
        )
      }
    },
    {
      name: 'Xử lý đơn hàng',
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const value = ORDER_PAYMENT_STATUS.find((el) => el.value === row?.paymentStatus)
        return (
          <div>
            <div className="order-text">
              <Badge color={value?.color} className="order-text">
                {value?.label}
              </Badge>
            </div>
            <div className="order-text">{row?.username}</div>
            <div className="order-text">{moment(row?.updatedAt).format('hh:mm DD/MM/YYYY')}</div>
          </div>
        )
      }
    },
    {
      name: 'Chi tiết',
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        return <div>{row?.note}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      center: true,
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => (
        <span>
          {/* <span
            className="pr-1 w-25"
            onClick={(e) => {
              e.preventDefault()
              history.push(`/pages/detail-order/${row.orderId}`)
            }}>
            {<Clipboard size={16} />}
          </span> */}
          <span
            className="pr-1 w-25"
            onClick={(e) => {
              e.preventDefault()
              history.push(`/pages/detail-order/${row.orderId}`)
            }}>
            {<Edit size={16} />}
          </span>
          <span
            className="pr-1 w-25"
            onClick={(e) => {
              setOpenOne(true)
              setUpdate(row)
            }}>
            {<Chrome size={16} />}
          </span>
        </span>
      )
    }
  ]

  const handleDelete = (data) => {
    OrderRequest.handleDelete(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
        }
      }
    })
  }

  const handleUpdateOrder = (data) => {
    OrderRequest.updateOrder(data).then((res) => {
      if (res) {
        const { statusCode, error } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.error(intl.formatMessage({ id: error }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  return (
    <Fragment>
      {/* <StatisticsCards/> */}
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col md="3" sm="4" xs="12" className="d-flex mt-sm-0 mt-1">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter"
                type="search"
                bsSize="md"
                id="search-input"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
              />
            </InputGroup>
            <Button color="primary" size="md" className="mb-1" onClick={() => handleSearch()}>
              <Search size={15} />
            </Button>
          </Col>
          <Col className="mb-1" sm="4" xs="12" md="3">
            <Flatpickr
              id="single"
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: 'true' }}
              placeholder={intl.formatMessage({ id: 'day_schedule' })}
              className="form-control form-control-input"
              onChange={(date) => {
                handleFilterDay(date)
              }}
            />
          </Col>
          <Col sm="4" xs="12" md="3" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: 'stationStatus' })}
              name="orderStatus"
              options={Object.values(stations_location)}
              getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
              onChange={({ value }) => {
                handleFilterChange('orderStatus', value)
              }}
            />
          </Col>
          <Col sm="4" xs="12" md="3" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder={'Trạng thái thanh toán'}
              name="paymentStatus"
              options={Object.values(ORDER_PAYMENT_STATUS)}
              getOptionLabel={(option) => option.label}
              onChange={({ value }) => {
                handleFilterChange('paymentStatus', value)
              }}
            />
          </Col>
        </Row>
        <div className="order-table">
          <DataTable noHeader paginationServer className="react-dataTable" columns={columns} sortIcon={<ChevronDown size={10} />} data={items} />
          {CustomPaginations()}
        </div>
      </Card>
      <Modal isOpen={openOne} toggle={() => setOpenOne(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={() => setOpenOne(false)}>{intl.formatMessage({ id: 'note' })} huỷ đơn hàng</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleUpdateOrder({
                id: update?.orderId,
                data: {
                  note: note,
                  orderStatus: 20 // đơn hàng bị huỷ
                }
              })
              setOpenOne(false)
            })}>
            <FormGroup>
              <Input
                name="reason"
                type="textarea"
                rows={5}
                className="mb-2"
                innerRef={register({ required: true })}
                invalid={errors.username && true}
                value={note}
                onChange={(e) => setNote(e.target.value)}
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
    </Fragment>
  )
}

export default injectIntl(Order)
