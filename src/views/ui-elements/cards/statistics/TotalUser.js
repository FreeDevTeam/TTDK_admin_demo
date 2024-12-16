import { useEffect, useState } from 'react'
import axios from 'axios'
import { Box } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import "./index.scss";

const TotalUser = ({ kFormatter, intl, data }) => {
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Box size={21} />}
      color='warning'
      stats={data.totalCountUser?.toLocaleString()}
      statTitle={intl.formatMessage({id: "total_user"})}
      className='col-widget'
    />
  ) : null
}

export default injectIntl(TotalUser)