import { useEffect, useState } from 'react'
import axios from 'axios'
import { Home, Loader } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import "./index.scss";
import { Card } from 'reactstrap'

const TotalNotActive = ({ kFormatter, intl, data }) => {
  const totalStation = data?.totalActiveStation + data?.totalNotActiveStation
  const notActive = totalStation - data?.totalDeployedStation
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Home size={21} />}
      color='warning'
      stats={notActive > 0 ? notActive : ''}
      statTitle={intl.formatMessage({id: "totalNotActive"})}
      className='col-widget'
    />
  ) : <Card  className='col-widget d-flex justify-content-center align-items-center'>
  <Loader size={60} />
</Card>
}

export default injectIntl(TotalNotActive)