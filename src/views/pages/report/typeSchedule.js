import React, { memo, Fragment, useState, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import SationService from '../../../services/station'
import Avatar from '@components/avatar'
import * as Icon from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, Media, CardText } from 'reactstrap'
import { SCHEDULE_STATUS } from './../../../constants/app'

const TypeSchedule = ({ intl }) => {
  const DefaultFilter = {
    filter: {},
    limit: 20,
    skip: 0,
    order: {
      key: 'createdAt',
      value: 'desc'
    }
  }
  const paramNew = {
    filter: {
        CustomerScheduleStatus: SCHEDULE_STATUS.NEW
    }
  }
  const paramConfirmed = {
    filter: {
        CustomerScheduleStatus: SCHEDULE_STATUS.CONFIRMED
    }
  }
  const paramCancel = {
    filter: {
        CustomerScheduleStatus: SCHEDULE_STATUS.CANCELED
    }
  }
  const paramClosed = {
    filter: {
        CustomerScheduleStatus: SCHEDULE_STATUS.CLOSED
    }
  }
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [total, setTotal] = useState()
  const [patern, setPatern] = useState(0)
  const [technician, setTechnician] = useState(0)
  const [high, setHigh] = useState(0)
  const [accountant, setAccountant] = useState(0)

  const getDataStaffHandler = (paramsFilter) => {
    SationService.getList(paramsFilter).then((result) => {
      if (result) {
        setTotal(result.data.total)
      }
    })
  }
  const getTotalNew = (paramNew) => {
    SationService.getList(paramNew).then((result) => {
      if (result) {
        setPatern(result.data.total)
      }
    })
  }
  const getTotalConfirmed = (paramConfirmed) => {
    SationService.getList(paramConfirmed).then((result) => {
      if (result) {
        setTechnician(result.data.total)
      }
    })
  }
  const getTotalCancel = (paramCancel) => {
    SationService.getList(paramCancel).then((result) => {
      if (result) {
        setHigh(result.data.total)
      }
    })
  }
  const getTotalClosed = (paramClosed) => {
    SationService.getList(paramClosed).then((result) => {
      if (result) {
        setAccountant(result.data.total)
      }
    })
  }
  const transactionsArr = [
    {
      title: intl.formatMessage({ id: 'unconfimred' }),
      color: 'light-primary',
      subtitle: 'Starbucks',
      amount: patern,
      Icon: Icon['Calendar'],
      down: 'text-primary'
    },
    {
      title: intl.formatMessage({ id: 'confirmed' }),
      color: 'light-success',
      subtitle: 'Add Money',
      amount: technician,
      Icon: Icon['Calendar'],
      down: 'text-success'
    },
    {
      title: intl.formatMessage({ id: 'canceled' }),
      color: 'light-warning',
      subtitle: 'Ordered Food',
      amount: high,
      Icon: Icon['Calendar'],
      down: 'text-danger'
    },
    {
      title: intl.formatMessage({ id: 'closed' }),
      color: 'light-info',
      subtitle: 'Refund',
      amount: accountant,
      Icon: Icon['Calendar'],
      down: 'text-warning'
    }
  ]

  const renderTransactions = () => {
    return transactionsArr.map((item) => {
      return (
        <div key={item.title} className="transaction-item">
          <Media>
            <Avatar className="rounded" color={item.color} icon={<item.Icon size={18} />} />
            <Media body>
              <h6 className="transaction-title">{item.title}</h6>
            </Media>
          </Media>
          <div className={`font-weight-bolder ${item.down}`}>{item.amount}</div>
        </div>
      )
    })
  }

  useEffect(() => {
    getDataStaffHandler(paramsFilter)
    getTotalNew(paramNew)
    getTotalConfirmed(paramConfirmed)
    getTotalCancel(paramCancel)
    getTotalClosed(paramClosed)
  }, [])

  return (
    <Fragment>
      <Card className="card-transaction pb-1">
        <CardHeader>
          <CardTitle tag="h3">{intl.formatMessage({ id: 'appointment_type' })}</CardTitle>
          <CardTitle className="font-small-3">
            {intl.formatMessage({ id: 'total_scheduled' })} : {total}
          </CardTitle>
        </CardHeader>
        <CardBody>{renderTransactions()}</CardBody>
      </Card>
    </Fragment>
  )
}
export default injectIntl(memo(TypeSchedule))
