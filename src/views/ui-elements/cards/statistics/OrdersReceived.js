import { useEffect, useState } from 'react'
import axios from 'axios'
import { Package } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'

const OrdersReceived = ({ kFormatter, warning, data, intl }) => {

  // const options = {
  //   chart: {
  //     id: 'revenue',
  //     toolbar: {
  //       show: false
  //     },
  //     sparkline: {
  //       enabled: true
  //     }
  //   },
  //   grid: {
  //     show: false
  //   },
  //   colors: [warning],
  //   dataLabels: {
  //     enabled: false
  //   },
  //   stroke: {
  //     curve: 'smooth',
  //     width: 2.5
  //   },
  //   fill: {
  //     type: 'gradient',
  //     gradient: {
  //       shadeIntensity: 0.9,
  //       opacityFrom: 0.7,
  //       opacityTo: 0.5,
  //       stops: [0, 80, 100]
  //     }
  //   },

  //   xaxis: {
  //     labels: {
  //       show: false
  //     },
  //     axisBorder: {
  //       show: false
  //     }
  //   },
  //   yaxis: {
  //     labels: {
  //       show: false
  //     }
  //   },
  //   tooltip: {
  //     x: { show: false }
  //   }
  // }

  // useEffect(() => {
  //   axios.get('/card/card-statistics/orders').then(res => setData(res.data))
  // }, [])

  return data !== null ? (
    <StatsWithAreaChart
      icon={<Package size={21} />}
      color='warning'
      stats={data.totalCustomerRecord.toLocaleString()}
      statTitle={intl.formatMessage({id: "totalCustomerRecord"})}
    />
  ) : null
}
export default injectIntl(OrdersReceived)
