import { useEffect, useState } from 'react'
import axios from 'axios'
import { Home, Loader } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import "./index.scss";
import { Card } from 'reactstrap'

const TotalInActiveStation = ({ kFormatter, intl, data }) => {
  let total = 0
for(let i = 0; i < data?.length; i++){
  if(data[i].stationStatus !== 1){
    total ++
  }
}
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Home size={21} />}
      stats={total}
      color='secondary'
      statTitle={intl.formatMessage({id: "totalInActiveStation"})}
      className='col-widget'
    />
  ) : <Card  className='col-widget d-flex justify-content-center align-items-center'>
  <Loader size={60} />
</Card>
}

export default injectIntl(TotalInActiveStation)