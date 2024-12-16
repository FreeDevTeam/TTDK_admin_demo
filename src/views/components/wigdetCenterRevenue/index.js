import { useEffect, useState } from 'react'
import axios from 'axios'
import Chart from 'react-apexcharts'
import { Settings } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText } from 'reactstrap'
import { injectIntl } from 'react-intl'
import moment from 'moment';

const WigdetCenterRevenue = ({ intl, primary }) => {
  const [data, setData] = useState(null)
  const lastMonth = moment().subtract(1, 'months').format("MM/YYYY");

  useEffect(() => {
    axios.get('/card/card-analytics/revenue').then(res => setData(res.data))
  }, [])

  const options = {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        type: 'line',
        offsetX: -10
      },
      stroke: {
        curve: 'smooth',
        dashArray: [0, 12],
        width: [4, 3]
      },
      legend: {
        show: false
      },
      colors: ['#33ff5b'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          inverseColors: false,
          gradientToColors: [primary, '#ebe9f1'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 0,
        hover: {
          size: 5
        }
      },
      xaxis: {
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '1rem'
          }
        },
        axisTicks: {
          show: false
        },
        categories: ['01', '05', '09', '13', '17', '21', '26', '31'],
        axisBorder: {
          show: false
        },
        tickPlacement: 'on'
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '1rem'
          },
          formatter(val) {
            return val > 999 ? `${(val / 1000).toFixed(0)}k` : val
          }
        }
      },
      grid: {
        borderColor: '#e7eef7',
        padding: {
          top: -20,
          bottom: -10,
          left: 20
        }
      },
      tooltip: {
        x: { show: false }
      }
    },
    series = [
      {
        name: 'Last Month',
        data: [46000, 48000, 45500, 46600, 44500, 46500, 45000, 47000]
      }
    ]
  return data !== null ? (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>{intl.formatMessage({ id: 'the_limit' })}</CardTitle>
      </CardHeader>
      <CardBody>
        <div className='d-flex justify-content-start mb-3'>
          <div>
            <CardText className='mb-50'>{lastMonth}</CardText>
            <h3 className='font-weight-bolder'>
              <span className='text-primary'>73,683</span>
            </h3>
            <CardText className='mb-50'>15% {intl.formatMessage({ id: 'increase_number_month' })}</CardText>
          </div>
        </div>
        <Chart options={options} series={series} type='line' height={240} />
      </CardBody>
    </Card>
  ) : null
}

export default injectIntl(WigdetCenterRevenue)
