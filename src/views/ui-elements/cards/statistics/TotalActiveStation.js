import { useEffect, useState } from 'react'
import axios from 'axios'
import { Anchor } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import "./index.scss";

const TotalActiveStation = ({ kFormatter, intl, data }) => {
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Anchor size={21} />}
      color='warning'
      stats={kFormatter(data.totalActiveStation )}
      statTitle={intl.formatMessage({id: "totalActiveStation"})}
      className='col-widget'
    />
  ) : null
}

export default injectIntl(TotalActiveStation)