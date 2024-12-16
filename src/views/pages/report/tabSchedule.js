import Chart from 'react-apexcharts'
import { Fragment, useState, useEffect, memo } from 'react'
import { Card, CardTitle, CardText, CardBody, CardHeader, Row, Col, Progress, Input, Button } from 'reactstrap'
import { injectIntl } from 'react-intl'
import { kFormatter } from '@utils'
import { Bar } from 'react-chartjs-2'
import Icon from '@mdi/react'
import { mdiClockCheckOutline } from '@mdi/js'
import './index.scss'
import { formatDisplayNumber } from '../../../utility/Utils'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import StationFunctions from '../../../services/StationFunctions'
import moment from 'moment'
import ReportService from '../../../services/reportService'
import { readAllArea } from '../../../helper/localStorage'
import BasicAutoCompleteDropdown from "../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown";

const TabSchedule = ({
  gridLineColor,
  intl,
  days,
  schedule,
  total,
  dayOverview,
  totalConfirmedSchedule,
  totalNewSchedule,
  totalClosedSchedule,
  totalSchedule
}) => {
  const options = {
    elements: {
      rectangle: {
        borderWidth: 2,
        borderSkipped: 'bottom'
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 700,
    legend: {
      display: false
    },
    tooltips: {
      // Updated default tooltip UI
      shadowOffsetX: 1,
      shadowOffsetY: 1,
      shadowBlur: 10,
      shadowColor: ['#16a34a'],
      backgroundColor: '#fff',
      titleFontColor: '#000',
      bodyFontColor: gridLineColor
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: false,
            color: gridLineColor,
            zeroLineColor: gridLineColor
          },
          scaleLabel: {
            display: false
          },
          ticks: {
            fontColor: gridLineColor,
            fontSize: 12
          }
        }
      ],
      yAxes: [
        {
          display: false,
          borderColor: 'transparent',
          gridLines: {
            display: false,
            zeroLineColor: gridLineColor
          },
          ticks: {
            stepSize: 1,
            min: 0,
            max: days.legenth,
            fontColor: gridLineColor
          }
        }
      ]
    }
  }

  const [listStationArea, setListStationArea] = useState()
  const [date, setDate] = useState('')
  const [filter, setFilter] = useState([])
  const readArea = readAllArea()
  readArea.unshift({
    code:'',
    value:intl.formatMessage({ id: "Area" }),
  }); 
  console.log(readArea);
  const DataChartSchedule = (paramsFilter) => {
    // console.log(paramsFilter);
    ReportService.DataChart(paramsFilter).then((result) => {
      if (result) {
        setFilter(result.data)
      }
    })
  }

  const dataChart = {
    labels: dayOverview?.map((item) => {
      return item.date
    }),
    datasets: [
      {
        data: dayOverview?.map((item) => {
          return item.quantity
        }),
        backgroundColor: '#7367f0',
        borderColor: 'transparent',
        barThickness: 20,
        borderWidth: 1,
        borderRadius: 10
      }
    ]
  }

  const dataFilter = {
    labels: filter?.map((item) => {
      return item.date
    }),

    datasets: [
      {
        data: filter?.map((item) => {
          return item.quantity
        }),
        backgroundColor: '#7367f0',
        borderColor: 'transparent',
        barThickness: 20,
        borderWidth: 1,
        borderRadius: 10
      }
    ]
  }

  function getListStationArea() {
    StationFunctions.getListStationArea().then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setListStationArea(data)
        }
      }
    })
  }
  useEffect(() => {
    // getListStationArea()
  }, [])

  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column size-title">
          <CardTitle tag="h4">{intl.formatMessage({ id: 'overview-schedule' })}</CardTitle>
          <div className="d-flex">
            <Flatpickr
              id="single"
              value={date}
              options={{
                mode: 'range',
                dateFormat: 'd/m/Y',
                disableMobile: 'true',
                locale: {
                  ...'vi',
                  firstDayOfWeek: 1
                }
              }}
              placeholder={intl.formatMessage({ id: 'customerRecordCheckExpiredDate' })}
              className="form-control form-control-input date_width"
              onChange={(date) => {
                //   document.getElementById("clear").style.display = 'block'
                const newArr = [...date]
                const Arr = newArr.map((item) => {
                  return moment(item.toString()).format('DD/MM/YYYY')
                })
                const newParams = {
                  filter: {},
                  startDate: Arr[0],
                  endDate: Arr[1]
                }
                DataChartSchedule(newParams)
              }}
            />
            {/* <Button 
                              className='form-control-input clear_text' 
                              id='clear'
                              onClick={() => {
                                setDate(undefined)
                               document.getElementById("clear").style.display = 'none'
                                }}>X</Button> */}
            <div style={{minWidth:'180px',marginLeft:'5px'}}>
              <BasicAutoCompleteDropdown
                onChange={({value}) => {
                  const newParams = {
                      filter: {
                          stationArea : value
                      },
                  }
                  DataChartSchedule(newParams)
                }}
                name='stationArea'
                options={readArea}
                placeholder={intl.formatMessage({ id: 'Area' })}
                getOptionLabel={(option) => option.value}
                getOptionValue={(option) => option.code}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="pb-3">
          <Row sm="10" className="mt-2">
            <Col sm="2">
              <Card className="ml-15">
                <Row>
                  <CardTitle className="title-total">{formatDisplayNumber(total)}</CardTitle>
                </Row>
                <Row>{intl.formatMessage({ id: 'total_scheduled' })}</Row>
              </Card>
            </Col>
            <Col sm="10">
              <Bar
                data={filter.length > 0 ? dataFilter : dataChart}
                // data={data}
                options={options}
                height={700}
              />
            </Col>
          </Row>
          <div className="border rounded ">
            <Row sm="6" className="m-1 h-247">
              <Col sm="4">
                <div className="block-icon width-200">
                  <div className="bg-deployed">
                    <Icon path={mdiClockCheckOutline} size={1} className="color_deployed " />
                  </div>
                  <div className="color_deployed">{intl.formatMessage({ id: 'done' })}</div>
                </div>
                <div className="color_deployed">{formatDisplayNumber(totalClosedSchedule)}</div>
                <Progress color="success" value={(totalClosedSchedule / totalSchedule) * 100} />
              </Col>
              <Col sm="4">
                <div className="block-icon">
                  <div className="bg-actived">
                    <Icon path={mdiClockCheckOutline} size={1} className="color_actived" />
                  </div>
                  <div className="color_actived">{intl.formatMessage({ id: 'confirmed' })}</div>
                </div>
                <div className="color_actived">{formatDisplayNumber(totalConfirmedSchedule)}</div>
                <Progress color="#7367f0" value={(totalConfirmedSchedule / totalSchedule) * 100} />
              </Col>
              <Col sm="4">
                <div className="block-icon width-200">
                  <div className="bg-overload ">
                    <Icon path={mdiClockCheckOutline} size={1} className="color_overload" />
                  </div>
                  <div className="color_overload">{intl.formatMessage({ id: 'unconfimred' })}</div>
                </div>
                <div className="color_overload">{formatDisplayNumber(totalNewSchedule)}</div>
                <Progress color="danger" value={(totalNewSchedule / totalSchedule) * 100} />
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default injectIntl(memo(TabSchedule))
