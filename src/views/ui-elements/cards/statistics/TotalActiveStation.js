import { useEffect, useState } from 'react'
import axios from 'axios'
import { Package } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'

const TotalActiveStation = ({ kFormatter, intl, data }) => {
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Package size={21} />}
      color='warning'
      stats={kFormatter(data.totalActiveStation )}
      statTitle={intl.formatMessage({id: "totalActiveStation"})}
    />
  ) : null
}

export default injectIntl(TotalActiveStation)