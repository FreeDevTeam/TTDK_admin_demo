import { useEffect, useState } from 'react'
import axios from 'axios'
import { Package } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'

const TotalCompletedSchedule = ({ kFormatter, intl, data }) => {
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Package size={21} />}
      color='warning'
      stats={kFormatter(data.totalCompletedSchedule )}
      statTitle={intl.formatMessage({id: "totalCompletedSchedule"})}
    />
  ) : null
}

export default injectIntl(TotalCompletedSchedule)