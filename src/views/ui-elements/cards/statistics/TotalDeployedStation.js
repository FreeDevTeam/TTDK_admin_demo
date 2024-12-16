import { useEffect, useState } from 'react'
import axios from 'axios'
import { Home, Loader } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import "./index.scss";
import { Card } from 'reactstrap'

const TotalDeployedStation = ({ kFormatter, intl, data }) => {
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Home size={21} />}
      color='success'
      stats={data.totalDeployedStation?.toLocaleString()}
      statTitle={intl.formatMessage({id: "totalDeployedStation"})}
      className='col-widget'
    />
  ) : <Card  className='col-widget d-flex justify-content-center align-items-center'>
  <Loader size={60} />
</Card>
}

export default injectIntl(TotalDeployedStation)