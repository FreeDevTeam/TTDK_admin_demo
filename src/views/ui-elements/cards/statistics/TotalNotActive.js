import { useEffect, useState } from 'react'
import axios from 'axios'
import { Home, Loader } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import "./index.scss";
import { Card } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'

const TotalNotActive = ({ kFormatter, intl, data }) => {
  let total = 0
  const newArray = data?.map(value =>{
    const isBool = value.stationBookingConfig?.every((item) => item.enableBooking  === 0);
    if(isBool === true){
      total ++
    }
  })
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Home size={21} />}
      stats={formatDisplayNumber(total)}
      color='info'
      statTitle={intl.formatMessage({id: "totalNotActive"})}
      className='col-widget'
    />
  ) : <Card  className='col-widget d-flex justify-content-center align-items-center'>
  <Loader size={60} />
</Card>
}

export default injectIntl(TotalNotActive)