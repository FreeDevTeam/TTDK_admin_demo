import { useEffect, useState } from 'react'
import axios from 'axios'
import { Aperture, Loader } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import { Card } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'

const TotalActiveUser = ({ kFormatter, intl, data }) => {

  return data !== null ? (
    <StatsWithAreaChart
      icon={<Aperture size={21} />}
      color='warning'
      stats={formatDisplayNumber(data)}
      statTitle={intl.formatMessage({id: "user_active"})}
      className='col-widget'
    />
  ) : <Card  className='col-widget d-flex justify-content-center align-items-center'>
  <Loader size={60} />
</Card>
}

export default injectIntl(TotalActiveUser)