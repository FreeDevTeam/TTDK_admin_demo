import { useEffect, useState } from 'react'
import axios from 'axios'
import { Command } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'

const TotalVehicle = ({ kFormatter, intl, data }) => {
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Command size={21} />}
      color='warning'
      stats={data.totalVehicle.toLocaleString()}
      statTitle={intl.formatMessage({id: "totalVehicle"})}
      className='col-widget'
    />
  ) : null
}

export default injectIntl(TotalVehicle)