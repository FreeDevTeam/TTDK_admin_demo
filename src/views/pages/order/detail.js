import Avatar from '@components/avatar'
import moment from 'moment'
import React, { Fragment, useEffect, useState } from 'react'
import { List, Target } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
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

  const data = [
    {
      title: 'Order Created',
      content: (
        <div>
          <div>Người tạo: {item?.firstName}</div>
          <div>sđt : {item?.phoneNumber}</div>
          <div>Ngày tạo : {moment(item?.createdAt).format('hh:mm DD/MM/YYYY')}</div>
        </div>
      ),
      // meta: '12 min ago',
      metaClassName: 'mr-1'
      //   customContent: (
      //     <Media>
      //       <img className='mr-1' src={jsonImg} alt='data.json' height='23' />
      //       <Media className='mb-0' body>
      //         data.json
      //       </Media>
      //     </Media>
      //   )
    },
    {
      title: 'Danh sách đơn hàng',
      content: (
        <>
          {item?.orderItems?.map((el) => {
            return <div>{el.orderItemName}</div>
          })}
        </>
      ),
      // meta: '45 min ago',
      metaClassName: 'mr-1',
      color: 'warning'
      //   customContent: (
      //     <Media className='align-items-center'>
      //       <Avatar img={ceo} />
      //       <Media className='ml-50' body>
      //         <h6 className='mb-0'>John Doe (Client)</h6>
      //         <span>CEO of Infibeam</span>
      //       </Media>
      //     </Media>
      //   )
    },
    {
      title: 'Create a new project for client',
      content: 'Add files to new design folder',
      color: 'info',
      // meta: '2 days ago',
      metaClassName: 'mr-1'
      //   customContent: <AvatarGroup data={avatarGroupArr} />
    },
    {
      title: 'Create a new project for client',
      content: 'Add files to new design folder',
      color: 'danger',
      // meta: '5 days ago',
      metaClassName: 'mr-1'
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

  const OrderTimeline = ({ order }) => {
    // const formatCurrency = (amount) => `₫${(amount / 1000).toLocaleString("vi-VN")}k`;

    return (
      <div className="order-timeline">
        <div className="timeline-item">
          <div className="timeline-icon created"></div>
          <div className="timeline-content">
            <h4 className="timeline-title">Order Created (ID: {order.orderId})</h4>
            <p>
              Customer: {order.firstName || 'N/A'} ({order.companyName})
            </p>
            <p>Phone: {order.phoneNumber}</p>
            <p>
              Created At:{' '}
              {new Date(order.createdAt).toLocaleString('en-US', {
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {order?.orderItems?.map((item, index) => (
          <div className="timeline-item" key={item.orderItemId}>
            <div className={`timeline-icon item-${index + 1}`}></div>
            <div className="timeline-content">
              <h4 className="timeline-title">Item Ordered: {item.orderItemName}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {item.productPrice}</p>
              <p>Tax: {item.taxAmount}</p>
              <p>Total: {item.payAmount}</p>
            </div>
          </div>
        ))}

        <div className="timeline-item">
          <div className="timeline-icon payment"></div>
          <div className="timeline-content">
            <h4 className="timeline-title">Payment Details</h4>
            <p>Total: {order.total}</p>
            <p>Tax: {order.taxAmount}</p>
            <p>Discount: {order.discountAmount}</p>
            <p>
              <strong>Grand Total:</strong> {order.totalPayment}
            </p>
            <p>Status: {order.paymentStatus}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <Row>
        <Col>
          {isOrderEditable && (
            <Button
              color="danger"
              className="mr-2 mb-2"
              onClick={() => {
                handleDelete({
                  id: item?.orderId
                })
              }}>
              Huỷ đơn hàng
            </Button>
          )}
          <Button color="primary" onClick={toggleModal} className="mb-2">
            Cập nhật đơn hàng
          </Button>
        </Col>
      </Row>
      <Row className="">
        <Col lg="8">
          <Card className="card-user-timeline">
            <CardHeader>
              <div className="d-flex align-items-center">
                <List className="user-timeline-title-icon" />
                <CardTitle tag="h4">Order Activity</CardTitle>
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
              <h4>Customer details</h4>
            </CardHeader>
            <CardBody>
              <CardText>Customer ID: {item?.orderId}</CardText>
              <div className="mt-2">
                <Media>
                  <Avatar color={'light-success'} icon={<Target />} className="mr-2 order-avatar" />
                  <Media className="my-auto" body>
                    <h5 className="font-weight-bolder mb-0">{item?.orderItems?.length} order</h5>
                    {/* <CardText className="font-small-3 mb-0">{item.subtitle}</CardText> */}
                  </Media>
                </Media>
              </div>
              <h5 className="mt-2">Contact Info</h5>
              <CardText className="mt-1">Email : </CardText>
              <CardText>SĐT : </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={toggleModal} className={`modal-dialog-centered `}>
        <ModalHeader toggle={toggleModal}>Update Đơn hàng</ModalHeader>
        <ModalBody>
          <Label for="note">Ghi chú</Label>
          <Input type="textarea" id="note" value={note} onChange={(e) => setNote(e.target.value)} row={3} className='mb-2'/>
          {isOrderEditable && (
            <>
              <Label for="orderStatus">Trạng thái đơn hàng</Label>
              <BasicAutoCompleteDropdown
                placeholder={intl.formatMessage({ id: 'stationStatus' })}
                name="orderStatus"
                options={Object.values(stations_location)}
                className='mb-2'
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
