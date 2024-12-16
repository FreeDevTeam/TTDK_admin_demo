import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { Box } from 'react-feather'
import { injectIntl } from 'react-intl'
import { Card } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import "./index.scss"

const AccountMonth = ({ kFormatter, intl, data }) => {
  return data !== undefined ? (
    <StatsWithAreaChart
      icon={<Box size={21} />}
      color='warning'
      stats={formatDisplayNumber(data)}
      statTitle={intl.formatMessage({id: "account_month"})}
      className='col-widget'
    />
  ) : <Card  className='col-widget d-flex justify-content-center align-items-center'>
  <SpinnerTextAlignment size={60} />
</Card>
}

export default injectIntl(AccountMonth)