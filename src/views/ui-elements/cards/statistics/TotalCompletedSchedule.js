import { useEffect, useState } from 'react'
import axios from 'axios'
import { Award, Loader } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import { Card } from 'reactstrap'

const TotalCompletedSchedule = ({ kFormatter, intl, data }) => {
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Award size={21} />}
      color='warning'
      stats={data}
      statTitle={intl.formatMessage({id: "totalCompletedSchedule"})}
      className='col-widget'
    />
  ) : <Card  className='col-widget d-flex justify-content-center align-items-center'>
  <Loader size={60} />
</Card>
}

export default injectIntl(TotalCompletedSchedule)