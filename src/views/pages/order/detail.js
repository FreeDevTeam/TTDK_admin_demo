import Avatar from '@components/avatar'
import Timeline from '@components/timeline'
import moment from 'moment'
import React, { Fragment, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, List, Target } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Input,
  Label,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from 'reactstrap'
import { number_to_price } from '../../../helper/common'
import OrderRequest from '../../../services/order'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import './index.scss'

const DetailOrder = ({ intl }) => {
  const stations_location = [
    // { value: undefined, label: 'all_location', color: '' },
    { value: 0, label: 'unconfimred', color: 'warning' },
    { value: 10, label: 'confirmed', color: 'success' },
    { value: 20, label: 'canceled', color: 'primary' },
    { value: 30, label: 'closed', color: 'secondary' }
  ]

  const ORDER_PAYMENT_STATUS = [
    // { value: undefined, label: 'Tất cả trạng thái thanh toán' },
    { value: 'New', label: 'Mới', color: 'primary' },
    { value: 'Processing', label: 'Tính phí thất bại cần xử lý lại', color: 'success' },
    { value: 'Pending', label: 'Đang trong quá trình xử lý', danger: 'danger' },
    { value: 'Failed', label: 'Thanh toán thất bại', color: 'warning' },
    { value: 'Success', label: 'Thanh toán thành công', color: 'info' },
    { value: 'Canceled', label: 'Đã huỷ', color: 'dark' }
  ]

  const { id } = useParams()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const [note, setNote] = useState('')
  const [orderStatus, setOrderStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')

  const toggleModal = () => setModal(!modal)

  const getListById = async (params) => {
    const res = await OrderRequest.getListById(params)
    setItem(res)
  }

  useEffect(() => {
    getListById({ id: id })
  }, [id])

  const paramsOrder = stations_location.find((el) => el.value === item?.orderStatus)
  const value = ORDER_PAYMENT_STATUS.find((el) => el.value === item?.paymentStatus)

  const data = [
    {
      title: 'Trạng thái đơn hàng',
      content: 
      <>
      <div className='d-flex justify-content-between align-items-center'>
        <Badge color='info'>Đặt thành công</Badge>
        <div>{moment(item.createdAt).format('DD/MM/YYYY')}</div>
      </div>
      <div className='d-flex justify-content-between align-items-center mt-1'>
         <Badge color={paramsOrder?.color} className="order-text">
           {paramsOrder === undefined ? '' : intl.formatMessage({ id: paramsOrder?.label })}
          </Badge>
        <div>{moment(item.updatedAt).format('DD/MM/YYYY')}</div>
      </div>
      </>,
      // customContent: (
      //   <Media className='align-items-center'>
      //     <img className='mr-1' src={pdf} alt='pdf' height='23' />
      //     <Media body>invoice.pdf</Media>
      //   </Media>
      // )
    },
    {
      title: 'Trạng thái thanh toán',
      content: <>
      <div className='d-flex justify-content-between align-items-center'>
        <Badge color='info'>Đặt thành công</Badge>
        <div>{moment(item.createdAt).format('DD/MM/YYYY')}</div>
      </div>
      <div className='d-flex justify-content-between align-items-center mt-1'>
         <Badge color={value?.color} className="order-text">
           {value === undefined ? '' : intl.formatMessage({ id: value?.label })}
          </Badge>
        <div>{moment(item.updatedAt).format('DD/MM/YYYY')}</div>
      </div>
      </>,
      color: 'info'
    }
  ]
  // kiểm tra trạng thái đơn hàng chưa hoàn thành hoặc chưa huỷ
  const isOrderEditable = item?.orderStatus === 0

  const handleDelete = (data) => {
    OrderRequest.handleDelete(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getListById({ id: id })
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
        }
      }
    })
  }

  const handleUpdateOrder = (data) => {
    if (data.data.orderStatus === '') {
      toast.error(intl.formatMessage({ id: 'error-status-order' }))
      return
    }
    if (data.data.paymentStatus === '') {
      toast.error(intl.formatMessage({ id: 'error-status-payment' }))
      return
    }
    OrderRequest.updateOrder(data).then((res) => {
      if (res) {
        const { statusCode, error } = res
        if (statusCode === 200) {
          getListById({ id: id })
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.error(intl.formatMessage({ id: error }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const columns = [
    {
      name: intl.formatMessage({ id: 'ID' }),
      sortable: true,
      minWidth: '80px',
      maxWidth: '80px',
      cell: (row, index) => {
        return <div>{row?.orderItemId}</div>
      }
    },
    {
      name: 'Tên đơn hàng',
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row, index) => {
        return <div>{row?.orderItemName}</div>
      }
    },
    {
      name: 'Giá (VND)',
      sortable: true,
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row, index) => {
        return <div>{number_to_price(row?.productPrice)}</div>
      }
    },
    {
      name: 'Thuế (VND)',
      sortable: true,
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row, index) => {
        return <div>{number_to_price(row?.taxAmount)}</div>
      }
    },
    {
      name: 'Ngày hết hạn',
      sortable: true,
      minWidth: '170px',
      maxWidth: '170px',
      cell: (row, index) => {
        // return <div>{number_to_price(row?.taxAmount)}</div>
        return <div>{moment(row.updatedAt).format('DD/MM/YYYY')}</div>
      }
    },
  ]

  const OrderTimeline = ({ order }) => {

    return (
      <div>
        <DataTable noHeader paginationServer className="react-dataTable" columns={columns} sortIcon={<ChevronDown size={10} />} data={order?.orderItems} />
        <div className='mt-2'>
          <div className='font-weight-bolder'>Tổng tiền đơn hàng : {number_to_price(order?.totalAmount)} VND</div>
          <div className='font-weight-bolder mt-1'>Tổng tiền thuế : {number_to_price(order?.taxAmount)} VND</div>
          <div className='mt-1 font-weight-bolder'>Tổng tiền thanh toán : {number_to_price(order?.subTotalAmount)} VND</div>
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <Row>
        <Col>
          {isOrderEditable && (
            <>
              <Button
                color="danger"
                className="mr-2 mb-2"
                onClick={() => {
                  handleUpdateOrder({
                    id: item?.orderId,
                    data: {
                      orderStatus: 20 // đơn hàng bị huỷ
                    }
                  })
                }}>
                Huỷ đơn hàng
              </Button>
              <Button color="primary" onClick={toggleModal} className="mb-2">
                Cập nhật đơn hàng
              </Button>
            </>
          )}
        </Col>
      </Row>
      <Row className="">
        <Col lg="8">
          <Card className="card-user-timeline">
            <CardHeader>
              <div className="d-flex align-items-center">
                <List className="user-timeline-title-icon" />
                <CardTitle tag="h4">Chi tiết đơn hàng</CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              {/* <Timeline className="ml-50 mb-0" data={data} /> */}
              <OrderTimeline order={item} />
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="6">
          <Card>
            <CardHeader>
              <h4>Khách hàng</h4>
            </CardHeader>
            <CardBody>
              <CardText>ID khách hàng: {item?.orderId}</CardText>
              <div className="mt-2">
                <Media>
                  <Avatar color={'light-success'} icon={<Target />} className="mr-2 order-avatar" />
                  <Media className="my-auto" body>
                    <h5 className="font-weight-bolder mb-0">{item?.orderItems?.length} đơn hàng</h5>
                    {/* <CardText className="font-small-3 mb-0">{item.subtitle}</CardText> */}
                  </Media>
                </Media>
              </div>
              <h5 className="mt-2">Thông tin liên lạc :</h5>
              <CardText className="mt-1">Email : {item?.email}</CardText>
              <CardText>SĐT : {item?.phoneNumber}</CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
      <Col lg="8">
      <Card>
       <CardHeader>
        <CardTitle tag='h4' className='mb-2'>
          Trạng thái
        </CardTitle>
       </CardHeader>
       <CardBody>
        <Timeline data={data} />
       </CardBody>
    </Card>
      </Col>
      </Row>
      <Modal isOpen={modal} toggle={toggleModal} className={`modal-dialog-centered `}>
        <ModalHeader toggle={toggleModal}>Update Đơn hàng</ModalHeader>
        <ModalBody>
          <Label for="note">Ghi chú</Label>
          <Input type="textarea" id="note" value={note} onChange={(e) => setNote(e.target.value)} row={3} className="mb-2" />
          {isOrderEditable && (
            <>
              <Label for="orderStatus">Trạng thái đơn hàng</Label>
              <BasicAutoCompleteDropdown
                placeholder={intl.formatMessage({ id: 'stationStatus' })}
                name="orderStatus"
                options={Object.values(stations_location)}
                className="mb-2"
                getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
                onChange={({ value }) => {
                  setOrderStatus(value)
                }}
              />
              <Label for="paymentStatus">Trạng thái thanh toán</Label>
              <BasicAutoCompleteDropdown
                placeholder={'Trạng thái thanh toán'}
                name="paymentStatus"
                options={Object.values(ORDER_PAYMENT_STATUS)}
                getOptionLabel={(option) => option.label}
                onChange={({ value }) => {
                  setPaymentStatus(value)
                }}
              />
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              handleUpdateOrder({
                id: item?.orderId,
                data: {
                  note: note,
                  orderStatus: orderStatus,
                  paymentStatus: paymentStatus
                }
              })
            }}>
            Cập nhật
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Huỷ
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(DetailOrder)
