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
import { storeAllStationsDataToLocal } from "../../../helper/localStorage";
import { storeAllArea } from "../../../helper/localStorage";
import { readAllStationsDataFromLocal } from "../../../helper/localStorage";
import { listScheduleTotal } from "../../../helper/localStorage";
import { listVehicelTotal } from "../../../helper/localStorage";
import { readTotalVehicle } from "../../../helper/localStorage";
import { readTotalSchedule } from "../../../helper/localStorage";
import Service from "../../../services/request";

const AnalyticsDashboard = () => {
  const [user, setUser] = useState([])
  const [totalUser, setTotalUser] = useState(0)

  const listUserTotal = () =>{
    Service.send({
      method: "POST",
      path: "AppUsers/getListUser",
      data: {
        filter: {
          active: 1,
          appUserRoleId: 0
        },
        skip: 0,
        limit: 20,
        order: {
          key: 'createdAt',
          value: 'desc'
        }
      },
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        if (statusCode === 200) {
          setTotalUser(data.total)
          localStorage.setItem("StorageDev_TotalUser" , JSON.stringify(data.total))
        }
      }
    });
  }

  const listUser = async () => {
    let number = Math.ceil(totalUser / 20)
    let params = Array.from(Array.from(new Array(number)),(element, index)  => index)
    let results = [];
    const fetchData = async (param) =>{
    const response = await Service.send({
      method: 'POST',
      path: 'AppUsers/getListUser',
      data: {
        filter: {
          active: 1,
          appUserRoleId: 0
        },
        skip: param*20,
        limit: 20,
        order: {
          key: 'createdAt',
          value: 'desc'
        }
      },
      query: null
    })
    const data = await response.data.data;
    return data;
  } 
      for (const param of params) {
        const result = await fetchData(param);
         results = [...results , ...result]
      }
      setUser(results)
    }

    useEffect(() => {
      listScheduleTotal()
      listUserTotal()
      listVehicelTotal()
    if(!readAllStationsDataFromLocal){
      storeAllStationsDataToLocal()
      storeAllArea()
    }
    },[readAllStationsDataFromLocal])

    useEffect(() =>{
      listUser()
    },[totalUser])

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        <Col lg='3' sm='6'>
        <TotalActiveStation data={readAllStationsDataFromLocal || 0} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalInActiveStation data={readAllStationsDataFromLocal || 0} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalDeployedStation data={readAllStationsDataFromLocal || []} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalNotActive data={readAllStationsDataFromLocal || []} kFormatter={kFormatter} />
        </Col>
      </Row>
      <Row>
        <Col lg='3' sm='6'>
          <TotalUser data={totalUser} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalActiveUser data={user} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalCompletedSchedule data={readTotalSchedule} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalVehicle data={readTotalVehicle} kFormatter={kFormatter} />
        </Col>
      </Row>
    </div>
  )
}

export default memo(AnalyticsDashboard)