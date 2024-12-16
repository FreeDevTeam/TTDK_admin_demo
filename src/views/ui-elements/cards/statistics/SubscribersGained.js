import { useEffect, useState } from 'react'
import axios from 'axios'
import { Users } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'

const SubscribersGained = ({ kFormatter, intl, data }) => {
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Users size={21} />}
      color='primary'
      stats={data.totalActiveStation.toLocaleString()}
      statTitle={intl.formatMessage({id: "numberOfStation"})}
    />
  ) : null
}

export default injectIntl(SubscribersGained)
