import { useEffect, useState } from 'react'
import axios from 'axios'
import { Aperture, Loader } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import { Card } from 'reactstrap'

const TotalActiveUser = ({ kFormatter, intl, data }) => {
  let total = 0
for(let i = 0; i < data.length; i++){
  if(data[i].isVerifiedPhoneNumber === 1){
    total ++
  }
}
  return data !== null ? (
    <StatsWithAreaChart
      icon={<Aperture size={21} />}
      color='warning'
      stats={total}
      statTitle={intl.formatMessage({id: "user_active"})}
      className='col-widget'
    />
  ) : <Card  className='col-widget d-flex justify-content-center align-items-center'>
  <Loader size={60} />
</Card>
}

export default injectIntl(TotalActiveUser)