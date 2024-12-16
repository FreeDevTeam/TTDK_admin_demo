import { useContext, useEffect, useState, memo } from 'react'
import { kFormatter } from '@utils'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import AvgSessionsEmail from '@src/views/ui-elements/cards/analytics/AvgSessionsEmail'
import AvgSessionsSMS from '@src/views/ui-elements/cards/analytics/AvgSessionsSMS'
import { Row, Col } from 'reactstrap'
import OrdersReceived from '@src/views/ui-elements/cards/statistics/OrdersReceived'
import CardCongratulations from '@src/views/ui-elements/cards/advance/CardCongratulations'
import SubscribersGained from '@src/views/ui-elements/cards/statistics/SubscribersGained'
import TotalActiveStation from '@src/views/ui-elements/cards/statistics/TotalActiveStation'
import TotalActiveUser from '@src/views/ui-elements/cards/statistics/TotalActiveUser'
import TotalCompletedSchedule from '@src/views/ui-elements/cards/statistics/TotalCompletedSchedule'
import TotalVehicle from '@src/views/ui-elements/cards/statistics/TotalVehicle'
import TotalInActiveStation from '@src/views/ui-elements/cards/statistics/TotalInActiveStation'
import TotalDeployedStation from '@src/views/ui-elements/cards/statistics/TotalDeployedStation'
import TotalNotActive from '@src/views/ui-elements/cards/statistics/TotalNotActive'
import TotalUser from '@src/views/ui-elements/cards/statistics/TotalUser'
import '@styles/react/libs/charts/apex-charts.scss'
import { storeAllArea } from "../../../helper/localStorage";
import { storeAllStationsDataToLocal } from "../../../helper/localStorage";
import { readAllStationsDataFromLocal } from "../../../helper/localStorage";
import { ListUser } from "../../../helper/localStorage";
import { readTotalUserLocal } from "../../../helper/localStorage";
import { ListUserActive } from "../../../helper/localStorage";
import { readTotalUserActiveLocal } from "../../../helper/localStorage";
import { listScheduleTotal } from "../../../helper/localStorage";
import { readTotalSchedule } from "../../../helper/localStorage";
import { listVehicelTotal } from "../../../helper/localStorage";
import { readTotalVehicle } from "../../../helper/localStorage";
import { listRole } from "../../../helper/localStorage";
import { toast } from 'react-toastify';
import UserService from '../../../services/userService'
import { injectIntl } from 'react-intl';
import SationService from '../../../services/station'
import VehicleService from '../../../services/vehicle'

const readLocal = readAllStationsDataFromLocal();

const AnalyticsDashboard = ({ intl }) => {
  const [list, setList] = useState(readLocal)
  const [totalUser, setTotalUser] = useState()
  const [totalUserActive, setTotalUserActive] = useState()
  const [totalSchedule, setSchedule] = useState()
  const [totalVehicle, setTotalVehicle] = useState()

  useEffect(() => {
    storeAllStationsDataToLocal()
    storeAllArea()
    listRole()
    handleData()
    getListUser()
    getListUserActive()
    getListScheduleTotal()
    getListVehicelTotal()
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
    </div>
  )
}

export default injectIntl(memo(AnalyticsDashboard))