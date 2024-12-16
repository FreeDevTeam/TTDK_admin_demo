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

const readLocal = readAllStationsDataFromLocal();
const readTotalUser = readTotalUserLocal();
const readTotalUserActive = readTotalUserActiveLocal();
const readSchedule = readTotalSchedule();
const readVehicle = readTotalVehicle();

const AnalyticsDashboard = () => {
  const [list, setList] = useState(readLocal)
  const [totalUser, setTotalUser] = useState(readTotalUser)
  const [totalSchedule, setSchedule] = useState(readSchedule)
  const [totalUserActive, setTotalUserActive] = useState(readTotalUserActive)
  const [totalVehicle, setTotalVehicle] = useState(readVehicle)

  const data = async () =>{
    const result = await storeAllStationsDataToLocal()
    const listUser = await ListUser()
    const userActive = await ListUserActive()
    const schedule = await listScheduleTotal()
    const vehicle = await listVehicelTotal()
  }

  useEffect(() => {
    if(!readLocal) {
      data().then(res => {
        setList(readAllStationsDataFromLocal())
      })
    }
    if(!readTotalUser) {
      data().then(res => {
        setTotalUser(readTotalUserLocal())
      })}
    if(!readTotalUserActive) {
      data().then(res => {
        setTotalUserActive(readTotalUserActiveLocal())
    })}
    if(!readSchedule) {
      data().then(res => {
        setSchedule(readTotalSchedule())
    })}
    if(!readVehicle) {
      data().then(res => {
        setTotalVehicle(readTotalVehicle())
    })}
    storeAllStationsDataToLocal()
    storeAllArea()
    ListUser()
    ListUserActive()
    listScheduleTotal()
    listVehicelTotal()
  },[readLocal,readTotalUser,readTotalUserActive,readSchedule,readVehicle])

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

export default memo(AnalyticsDashboard)