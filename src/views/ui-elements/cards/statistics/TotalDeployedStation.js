import { useEffect, useState } from 'react'
import axios from 'axios'
import { Home, Loader } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import "./index.scss";
import { Card } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'

const TotalDeployedStation = ({ kFormatter, intl, data }) => {
  let total = 0
  const newArray = data?.map(value =>{
    const isBool = value.stationBookingConfig?.some((item) => item.enableBooking  === 1);
    if(isBool === true){
      total ++
    }
  })
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Home size={21} />}
      stats={formatDisplayNumber(total)}
      color='success'
      statTitle={intl.formatMessage({id: "totalDeployedStation"})}
      className='col-widget'
    />
  ) : <Card  className='col-widget d-flex justify-content-center align-items-center'>
  <SpinnerTextAlignment size={60} />
</Card>
}

export default injectIntl(TotalDeployedStation)