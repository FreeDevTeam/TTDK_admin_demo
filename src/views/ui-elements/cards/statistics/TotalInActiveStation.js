import { useEffect, useState } from 'react'
import axios from 'axios'
import { Home } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import "./index.scss";

const TotalInActiveStation = ({ kFormatter, intl, data }) => {
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Home size={21} />}
      color='warning'
      stats={data.totalNotActiveStation?.toLocaleString()}
      statTitle={intl.formatMessage({id: "totalInActiveStation"})}
      className='col-widget'
    />
  ) : null
}

export default injectIntl(TotalInActiveStation)