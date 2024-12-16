import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Card,
  CardTitle,
  Row,
  Col,
  Button,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  Badge
} from 'reactstrap'
import Chart from 'react-apexcharts'
import moment from 'moment'
import { Type } from 'react-feather'
import { SCHEDULE_STATUS, SCHEDULE_TYPE } from '../../../../constants/app'
import { useIntl } from 'react-intl'
import BasicWrapElideText from '../../../components/Contract/BasicWrapElideText'
import ListSchedule from './../../../pages/schedule/index'

const RevenueReport = props => {
  const intl = useIntl()
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(false)
  const [listYears, setListYears] = useState(['2022','2023','2024'])
  const [dataFilter, setDataFilter] = useState({
    filter: {
    },
    startDate:moment().startOf('year').format('DD/MM/YYYY'),
    endDate:moment().endOf('year').format('DD/MM/YYYY')
  })

  useEffect(() => {
    axios.get('/Statistical/scheduleAnnualReport').then(res => setData(res.data))
    setListYears([
      moment().startOf('year').format("YYYY"),
      moment().startOf('year').subtract(1, 'year').format("YYYY"),
      moment().startOf('year').subtract(2, 'year').format("YYYY")
    ])
  }, [])

  const revenueOptions = {
      chart: {
        stacked: true,
        type: 'bar',
        toolbar: { show: false }
      },
      grid: {
        padding: {
          top: -20,
          bottom: -10
        },
        yaxis: {
          lines: { show: false }
        }
      },
      xaxis: {
        categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '0.86rem'
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      colors: [props.primary, props.warning],
      plotOptions: {
        bar: {
          columnWidth: '17%',
          endingShape: 'rounded'
        },
        distributed: true
      },
      yaxis: {
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '0.86rem'
          }
        }
      }
    },
  revenueSeries = [
    {
      name: 'Lịch hẹn',
      data: data?.detail || [96, 125, 186, 76, 89, 140, 179, 160, 159, 143, 162, 128]
    },
  ]

  const budgetSeries = [
      {
        data: data?.detail || [96, 125, 186, 76, 89, 140, 179, 160, 159, 143, 162, 128]

      },
    ],
  budgetOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      type: 'line',
      sparkline: { enabled: true }
    },
    stroke: {
      curve: 'smooth',
      dashArray: [0, 5],
      width: [2]
    },
    colors: [props.primary, '#dcdae3'],
    tooltip: {
      enabled: false
    }
  }

  return (
    <Card className='card-revenue-budget'>
      <Row className='mx-0'>
        <Col className='revenue-report-wrapper' md='8' xs='12'>
          <div className='d-sm-flex justify-content-between align-items-center mb-3'>
            <div className={'d-flex align-items-center'}>
              <CardTitle className='mb-50 mb-sm-0'>{intl.formatMessage({id:'report_year'})} </CardTitle><div className="cursor-pointer ml-1" onClick={()=>setOpen(!open)}> ( ! )</div>
            </div>
            <div className='d-flex align-items-center'>
              <div className='d-flex align-items-center mr-2'>
                <span className='bullet bullet-primary mr-50 cursor-pointer'></span>
                <span>{intl.formatMessage({id:'VIEW_STATIONS_SCHEDULE'})}</span>
              </div>
            </div>
          </div>
          <Chart onClick={(e)=>{console.log(e)}} id='revenue-report-chart' type='bar' height='230' options={revenueOptions} series={revenueSeries} />
        </Col>
        <Col className='budget-wrapper' md='4' xs='12'>
          <UncontrolledButtonDropdown>
            <DropdownToggle className='budget-dropdown' outline color='primary' size='sm' caret>
              {moment(dataFilter?.startDate).format('YYYY')}
            </DropdownToggle>
            <DropdownMenu>
              {listYears.map(item => (
                <DropdownItem onClick={()=>{
                setDataFilter({
                  ...dataFilter,
                  startDate:moment(item).startOf('year').format('DD/MM/YYYY'),
                  endDate:moment(item).endOf('year').format('DD/MM/YYYY')
                })}} 
                className='w-100' key={item}>
                  {item}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          <div className='d-flex justify-content-center align-items-center'>
            <span className='font-weight-bolder mr-25'>{intl.formatMessage({id:'schedules'})}: </span>
          </div>
          <h2 className='mb-25'>{data?.totalSchedule || '1,464'}</h2>

          <Chart id='budget-chart' type='line' height='80' options={budgetOptions} series={budgetSeries} />
        </Col>
      </Row>
      <Modal isOpen={open} toggle={() => setOpen(false)} className={`modal-dialog-centered`} style={{ maxWidth: '80vw' }}>
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'table-schedule' })}</ModalHeader>
        <ModalBody style={{overflow:'auto',maxHeight:'75vh'}}>
          {<ListSchedule></ListSchedule>}
        </ModalBody>
      </Modal>
    </Card>
  )
}

export default RevenueReport
