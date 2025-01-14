import TotalActiveStation from '@src/views/ui-elements/cards/statistics/TotalActiveStation'
import TotalActiveUser from '@src/views/ui-elements/cards/statistics/TotalActiveUser'
import TotalCompletedSchedule from '@src/views/ui-elements/cards/statistics/TotalCompletedSchedule'
import TotalDeployedStation from '@src/views/ui-elements/cards/statistics/TotalDeployedStation'
import TotalInActiveStation from '@src/views/ui-elements/cards/statistics/TotalInActiveStation'
import TotalNotActive from '@src/views/ui-elements/cards/statistics/TotalNotActive'
import TotalUser from '@src/views/ui-elements/cards/statistics/TotalUser'
import TotalVehicle from '@src/views/ui-elements/cards/statistics/TotalVehicle'
import '@styles/react/libs/charts/apex-charts.scss'
import { kFormatter } from '@utils'
import { memo, useEffect, useState } from 'react'
import { injectIntl } from 'react-intl'
import { Col, Row } from 'reactstrap'
import { listRole, readAllStationsDataFromLocal, storeAllArea, storeAllStationsDataToLocal } from "../../../helper/localStorage"
import ReportService from '../../../services/reportService'
import SationService from '../../../services/station'
import UserService from '../../../services/userService'
import VehicleService from '../../../services/vehicle'
import AccountMonth from '../../ui-elements/cards/statistics/AccountMonth'
import AccountWeek from '../../ui-elements/cards/statistics/AccountWeek'
import ScheduleMonth from '../../ui-elements/cards/statistics/ScheduleMonth'
import ScheduleWeek from '../../ui-elements/cards/statistics/ScheduleWeek'

const readLocal = readAllStationsDataFromLocal();

const AnalyticsDashboard = ({ intl }) => {
  const [list, setList] = useState(readLocal)
  const [totalUser, setTotalUser] = useState()
  const [totalUserActive, setTotalUserActive] = useState()
  const [totalSchedule, setSchedule] = useState()
  const [totalVehicle, setTotalVehicle] = useState()
  const [accountWeek, setAccountWeek] =  useState()
  const [accountMonth, setAccountMonth] = useState()
  const [scheduleMonth, setScheduleMonth] = useState()
  const [scheduleWeek, setScheduleWeek] = useState()

  useEffect(() => {
    storeAllStationsDataToLocal()
    storeAllArea()
    listRole()
    handleData()
    getListUser()
    getListUserActive()
    getListScheduleTotal()
    getListVehicelTotal()
    getListUserReport()
    getListScheduleReport()
  },[])

  const handleData = () =>{
      setTimeout(() =>{
        setList(JSON.parse(localStorage.getItem("StorageDev_AllStations")))
      }, 5000)
}

const getListUser = () => {
  UserService.getListUser({
    filter: {
      active: 1,
      appUserRoleId: 0,
      isVerifiedPhoneNumber : 1
  },
  skip: 0,
  limit: 1,
  order: {
    key: 'appUserId',
    value: 'desc'
  }}).then(res => {
    if (res) {
      const { statusCode, data } = res
      if (statusCode === 200) {
        setTotalUser(data.total)
        localStorage.setItem("StorageDev_TotalUser" , JSON.stringify(data.total))
      } 
    }
  })
}

const getListUserActive = () => {
  UserService.getListUser({
    filter: {
    active: 1,
    appUserRoleId: 0
  },
  skip: 0,
  limit: 1,
  order: {
    key: 'appUserId',
    value: 'desc'
  }}).then(res => {
    if (res) {
      const { statusCode, data } = res
      if (statusCode === 200) {
        setTotalUserActive(data.total)
        localStorage.setItem("StorageDev_TotalUserActive" , JSON.stringify(data.total))
      } 
    }
  })
}

const getListScheduleTotal = () => {
  SationService.getList({
    filter: {
    },
    skip: 0,
    limit: 1,
    order: {
      key: 'customerScheduleId',
      value: 'desc'
    }
}).then(res => {
    if (res) {
      const { statusCode, data } = res
      if (statusCode === 200) {
        setSchedule(data.total)
        localStorage.setItem("StorageDev_TotalSchedule" , JSON.stringify(data.total))
      } 
    }
  })
}

const getListVehicelTotal = () => {
  VehicleService.getList({
    filter: {
    },
    skip: 0,
    limit: 1,
    order: {
      key: 'appUserVehicleId',
      value: 'desc'
    }
}).then(res => {
    if (res) {
      const { statusCode, data } = res
      if (statusCode === 200) {
        setTotalVehicle(data.total)
        localStorage.setItem("StorageDev_TotalVehicle" , JSON.stringify(data.total))
      } 
    }
  })
}

const getListUserReport = () => {
  UserService.getListUserReport().then(res => {
    if (res) {
      const { statusCode, data } = res
      if (statusCode === 200) {
        setAccountMonth(data.totalRegisteredAccountsThisMonth)
        setAccountWeek(data.totalRegisteredAccountsThisWeek)
      } 
    }
  })
}

const getListScheduleReport = () => {
  ReportService.ScheduleReport().then(res => {
    if (res) {
      const { statusCode, data } = res
      if (statusCode === 200) {
        setScheduleMonth(data.totalNewScheduleThisMonth)
        setScheduleWeek(data.totalNewScheduleThisWeek)
      } 
    }
  })
}


  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        <Col lg='3' sm='6'>
        <TotalActiveStation data={list} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalInActiveStation data={list} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalDeployedStation data={list} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalNotActive data={list} kFormatter={kFormatter} />
        </Col>
      </Row>
      <Row>
        <Col lg='3' sm='6'>
          <TotalUser data={totalUser} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalActiveUser data={totalUserActive} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalCompletedSchedule data={totalSchedule} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalVehicle data={totalVehicle} kFormatter={kFormatter} />
        </Col>
      </Row>
      <Row>
        <Col lg='3' sm='6'>
           <AccountMonth data={accountMonth} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
           <AccountWeek data={accountWeek} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
           <ScheduleMonth data={scheduleMonth} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
           <ScheduleWeek data={scheduleWeek} kFormatter={kFormatter} />
        </Col>
      </Row>
    </div>
  )
}

export default injectIntl(memo(AnalyticsDashboard))