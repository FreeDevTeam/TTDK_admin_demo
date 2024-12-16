import { useContext, useEffect, useState } from 'react'
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

import '@styles/react/libs/charts/apex-charts.scss'
import Request from '../../../services/request'

const AnalyticsDashboard = () => {
  const { colors } = useContext(ThemeColors)
  const [data, setData] = useState(null)

  
  useEffect(() => {
    function fetchData () {
      Request && Request.send({
        path: 'CustomerStatistical/reportAllStation',
        method: "POST",
        data: {}
      }).then(result => { 
        if(result.statusCode === 200) {
          setData(result.data)
        }
      })
    }

    fetchData()
  },[])

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        <Col lg='6' sm='12'>
          <CardCongratulations />
        </Col>
        <Col lg='3' sm='6'>
          <SubscribersGained data={data} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <OrdersReceived data={data} kFormatter={kFormatter} warning={colors.warning.main} />
        </Col>
      </Row>
      <Row>
        <Col lg='3' sm='6'>
          <TotalActiveStation data={data} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalActiveUser data={data} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalCompletedSchedule data={data} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <TotalVehicle data={data} kFormatter={kFormatter} />
        </Col>
      </Row>
    </div>
  )
}

export default AnalyticsDashboard