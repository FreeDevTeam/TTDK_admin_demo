import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { Fragment, memo, useEffect, useState } from 'react'
import { CreditCard, User, Users } from 'react-feather'
import { injectIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { Col, Row } from 'reactstrap'
import addKeyLocalStorage from '../../../helper/localStorage'
import UserService from '../../../services/userService'
import { formatDisplayNumber } from '../../../utility/Utils'

const DefaultFilter = {
  filter: {}
}

const ReportUsers = ({ intl }) => {
  function getData(params) {
    const newParams = {
      ...params
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, '')

      UserService.getListUser(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            setTotalUser(data)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  const [totalUser, setTotalUser] = useState([])

  useEffect(() => {
    getData(DefaultFilter)
  }, [])
  return (
    <Fragment>
      <Row>
        <Col sm="3" xs="6">
          <StatsWithAreaChart
            icon={<User size={21} />}
            // color='success'
            stats={formatDisplayNumber(totalUser.totalAccount)}
            statTitle={intl.formatMessage({ id: 'total_account' })}
            type="area"
          />
        </Col>
        <Col sm="3" xs="6">
          <StatsWithAreaChart
            icon={<User size={21} />}
            color="success"
            stats={formatDisplayNumber(totalUser.totalActiveAccount)}
            statTitle={intl.formatMessage({ id: 'active_account' })}
            type="area"
          />
        </Col>
        <Col sm="3" xs="6">
          <StatsWithAreaChart
            icon={<User size={21} />}
            color="danger"
            stats={formatDisplayNumber(totalUser.totalBlockedAccount)}
            statTitle={intl.formatMessage({ id: 'block_account' })}
            type="area"
          />
        </Col>
        <Col sm="3" xs="6">
          <StatsWithAreaChart
            icon={<User size={21} />}
            color="warning"
            stats={formatDisplayNumber(totalUser.totalPendingAccount)}
            statTitle={intl.formatMessage({ id: 'pending_account' })}
            type="area"
          />
        </Col>
      </Row>
      <Row>
        <Col sm="3" xs="6">
          <StatsWithAreaChart
            icon={<Users size={21} />}
            // color='success'
            stats={formatDisplayNumber(totalUser.totalAccount)}
            statTitle={intl.formatMessage({ id: 'total_enterprise' })}
            type="area"
          />
        </Col>
        <Col sm="3" xs="6">
          <StatsWithAreaChart
            icon={<Users size={21} />}
            color="success"
            stats={formatDisplayNumber(totalUser.totalActiveAccount)}
            statTitle={intl.formatMessage({ id: 'active_enterprise' })}
            type="area"
          />
        </Col>
        <Col sm="3" xs="6">
          <StatsWithAreaChart
            icon={<Users size={21} />}
            color="danger"
            stats={formatDisplayNumber(totalUser.totalBlockedAccount)}
            statTitle={intl.formatMessage({ id: 'block_enterprise' })}
            type="area"
          />
        </Col>
        <Col sm="3" xs="6">
          <StatsWithAreaChart
            icon={<Users size={21} />}
            color="warning"
            stats={formatDisplayNumber(totalUser.totalPendingAccount)}
            statTitle={intl.formatMessage({ id: 'pending_enterprise' })}
            type="area"
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default injectIntl(memo(ReportUsers))
