import { useEffect, useState } from 'react'
import axios from 'axios'
import { Package } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'

const TotalVehicle = ({ kFormatter, intl, data }) => {
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Package size={21} />}
      color='warning'
      stats={kFormatter(data.totalVehicle )}
      statTitle={intl.formatMessage({id: "totalVehicle"})}
    />
  ) : null
}

export default injectIntl(TotalVehicle)