import { useEffect, useState } from 'react'
import axios from 'axios'
import { Award } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'

const TotalCompletedSchedule = ({ kFormatter, intl, data }) => {
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Award size={21} />}
      color='warning'
      stats={data.totalCompletedSchedule.toLocaleString()}
      statTitle={intl.formatMessage({id: "totalCompletedSchedule"})}
      className='col-widget'
    />
  ) : null
}

export default injectIntl(TotalCompletedSchedule)