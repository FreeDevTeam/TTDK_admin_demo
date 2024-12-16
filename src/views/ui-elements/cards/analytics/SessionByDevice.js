import { useEffect, useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from 'reactstrap'
import Chart from 'react-apexcharts'
import * as Icon from 'react-feather'
import ReportService from '../../../../services/reportService'
import { useIntl } from 'react-intl'
import Flatpickr from 'react-flatpickr';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import moment from 'moment'

const SessionByDevice = props => {
  const intl = useIntl()
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(false)
  const [listMonth, setListMonth] = useState(null)
  const [startDay, setStartDay] = useState(undefined)
  const [endDay, setEndDay] = useState(undefined)
  const [dataFilter, setDataFilter] = useState({
    filter: {
      CustomerScheduleStatus:30
    },
    startDate:moment().startOf('month').format('DD/MM/YYYY'),
    endDate:moment().endOf('month').format('DD/MM/YYYY')
  })
  useEffect(() => {
    getData()
    setListMonth([
      moment().format('MM/YYYY'),
      moment().subtract(1,"month").format('MM/YYYY'),
      moment().subtract(2,"month").format('MM/YYYY'),
      moment().subtract(3,"month").format('MM/YYYY'),
      moment().subtract(4,"month").format('MM/YYYY'),
      moment().subtract(5,"month").format('MM/YYYY'),
    ])
  }, [])
  const getData = async () => {
    const res = await ReportService.monthlyRevenueReport()
    // setData(res?.data)
  }
  useEffect(() => {
    axios.get('/card/card-analytics/sessions-device').then(res => setData(res.data))
  }, [])

  const options = {
      chart: {
        toolbar: {
          show: false
        }
      },
      labels: ['Desktop', 'Mobile', 'Tablet'],
      dataLabels: {
        enabled: false
      },
      legend: { show: false },
      comparedResult: [2, -3, 8],
      stroke: { width: 0 },
      colors: [props.primary, props.warning, props.danger]
    },
    series = [58.6, 34.9, 6.5]

  const renderChartInfo = () => {
    return data.chart_info.map((item, index) => {
      const IconTag = Icon[item.icon]
      return (
        <div
          key={index}
          className={classnames('d-flex justify-content-between', {
            'mb-1': index !== data.chart_info.length - 1
          })}
        >
          <div className='d-flex align-items-center'>
            <IconTag
              size={17}
              className={classnames({
                [item.iconColor]: item.iconColor
              })}
            />
            <span className='font-weight-bold ml-75 mr-25'>{item.name}</span>
            <span>- {item.usage}%</span>
          </div>
          <div>
            <span>{item.upDown}%</span>
            {item.upDown > 0 ? (
              <Icon.ArrowUp size={14} className='ml-25 text-success' />
            ) : (
              <Icon.ArrowDown size={14} className='ml-25 text-danger' />
            )}
          </div>
        </div>
      )
    })
  }

  return data !== null ? (
    <Card>
      <CardHeader className='align-items-end'>
        <CardTitle tag='h4'>{intl.formatMessage({id:'RevenueByStation'})}</CardTitle>
        <UncontrolledDropdown className='chart-dropdown'>
          <DropdownToggle color='' className='bg-transparent btn-sm border-0 p-50'>
            {moment(dataFilter?.startDate,"DD/MM/YYYY").format('MM/YYYY')}
          </DropdownToggle>
          <DropdownMenu right>
            {listMonth.map(item => (
              <DropdownItem
              onClick={()=>{
                setDataFilter({
                  ...dataFilter,
                  startDate:moment(item,'MM/YYYY').startOf('month').format('DD/MM/YYYY'),
                  endDate:moment(item,'MM/YYYY').endOf('month').format('DD/MM/YYYY')
                })}} 
                className='w-100' key={item}>
                {item}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>
      <CardBody>
        <Chart className='my-1' options={options} series={series} type='donut' height={300} />
        {renderChartInfo()}
      </CardBody>
    </Card>
  ) : null
}
export default SessionByDevice
