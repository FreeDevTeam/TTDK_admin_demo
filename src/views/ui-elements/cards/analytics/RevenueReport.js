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
import ReportService from '../../../../services/reportService'
import './index.scss'
import { AlertCircle } from 'react-feather'

const RevenueReport = props => {
  const intl = useIntl()
  const [data, setData] = useState(null)
  const [cancelSchedule, setCancelSchedule] = useState(null)
  const [open, setOpen] = useState(false)
  const [isFirst, setIsFirst] = useState(true)
  const [listYears, setListYears] = useState(['2022','2023','2024'])
  const [listMonth, setListMonth] = useState(['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'])
  const [dataFilter, setDataFilter] = useState({
    filter: {
      CustomerScheduleStatus:30
    },
    startDate:moment().startOf('year').format('DD/MM/YYYY'),
    endDate:moment().endOf('year').format('DD/MM/YYYY')
  })
  console.log(dataFilter);

  useEffect(() => {
    getData(dataFilter)
    setTimeout(() => {
      getCancelData(dataFilter)
    }, 100);
    setListYears([
      moment().startOf('month').subtract(6, 'month').format("MM/YYYY"),
      moment().startOf('month').subtract(5, 'month').format("MM/YYYY"),
      moment().startOf('month').subtract(4, 'month').format("MM/YYYY"),
      moment().startOf('month').subtract(3, 'month').format("MM/YYYY"),
      moment().startOf('month').subtract(2, 'month').format("MM/YYYY"),
      moment().startOf('month').subtract(1, 'month').format("MM/YYYY"),
      moment().startOf('month').format("MM/YYYY"),
      moment().startOf('month').add(1, 'month').format("MM/YYYY"),
      moment().startOf('month').add(2, 'month').format("MM/YYYY"),
      moment().startOf('month').add(3, 'month').format("MM/YYYY"),

    ])
  }, [])
  useEffect(() => {
    getData(dataFilter)
    getCancelData(dataFilter)
  }, [dataFilter])
  const getData = async (params) => {
    params.filter.CustomerScheduleStatus=30
    const res = await ReportService.scheduleAnnualReport(params)
    setData(res?.data)
  }
  const getCancelData = async (params) => {
    params.filter.CustomerScheduleStatus=20
    const res = await ReportService.scheduleAnnualReport(params)
    setCancelSchedule(res?.data)
  }
  const revenueOptions = {
      chart: {
        stacked: false,
        type: 'bar',
        toolbar: { show: false }
      },
      grid: {
        padding: {
          top: -20,
          bottom: -10
        },
        yaxis: {
          lines: { show: true }
        }
      },
      xaxis: {
        categories: listMonth,
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
          columnWidth: listMonth.length < 5 ? "20%" :'40%',
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
      name: 'Đã hoàn thành',
      data: data?.detail
    },
    {
      name: 'Đã huỷ',
      data: cancelSchedule?.detail
    },
  ]

  const budgetSeries = [
      {
        data: data?.detail
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
      width: [3]
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
              <CardTitle className='mb-50 mb-sm-0'>{intl.formatMessage({id:'report_year'})} </CardTitle><div className="cursor-pointer ml-1" onClick={()=>setOpen(!open)}><AlertCircle size={20} className='cursor-pointer' /></div>
            </div>
            <div className='d-flex align-items-center'>
              <div className='d-flex align-items-center mr-2'>
                <span className='bullet bullet-primary mr-50 cursor-pointer'></span>
                <span>{intl.formatMessage({id:'complete'})}</span>
              </div>
              <div className='d-flex align-items-center'>
                <span className='bullet bullet-warning mr-50 cursor-pointer'></span>
                <span>{intl.formatMessage({id:'canceled'})}</span>
              </div>
            </div>
          </div>
          <Chart id='revenue-report-chart' type='bar' height='230' options={revenueOptions} series={revenueSeries} />
        </Col>
        <Col className='budget-wrapper' md='4' xs='12'>
          <UncontrolledButtonDropdown>
            <DropdownToggle className='budget-dropdown' outline color='primary' size='sm' caret>
              {isFirst ?moment(dataFilter?.startDate).format('YYYY'): moment(dataFilter?.startDate,"DD/MM/YYYY").format('MM/YYYY')}
            </DropdownToggle>
            <DropdownMenu>
              {listYears.map(item => (
                <DropdownItem onClick={()=>{
                setIsFirst(false)
                setListMonth([`T${moment(item,'MM/YYYY').format('MM')}`])
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
          </UncontrolledButtonDropdown>
          <div className='d-flex justify-content-center align-items-center'>
            <span className='font-weight-bolder mr-25'>{intl.formatMessage({id:'complete'})}: </span>
          </div>
          <h2 className='mb-25'>{data?.totalSchedule || '0'}</h2>
          <div className='d-flex justify-content-center'>
            <span className='font-weight-bolder mr-25'>{intl.formatMessage({id:'canceled'})}</span>
            <span>{cancelSchedule?.totalSchedule}</span>
          </div>
          <Chart id='budget-chart' type='line' height='80' options={budgetOptions} series={budgetSeries} />
        </Col>
      </Row>
      <Modal isOpen={open} toggle={() => setOpen(false)} className={`modal-dialog-centered modal-report`}>
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'table-schedule' })}</ModalHeader>
        <ModalBody className={'modal-table'}>
          {<ListSchedule></ListSchedule>}
        </ModalBody>
      </Modal>
    </Card>
  )
}

export default RevenueReport
