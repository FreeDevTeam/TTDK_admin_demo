import Chart from 'react-apexcharts'
import { MoreVertical } from 'react-feather'
import {
  Card,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Col,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Media,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from 'reactstrap'
import { injectIntl } from 'react-intl'
import { Fragment, useState, useEffect, memo } from 'react'
import Service from '../../../../services/request'
import { toast } from 'react-toastify'
import "./index.scss";
const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 500
}

const ActiveCenter = ({ intl }) => {
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(20)
  const [listStationArea, setListStationArea] = useState()
  const [modal, setModal] = useState(false);
  
  const array = [];
  listStationArea?.map((item, index) => {
    array[index] = {
      name : item.value ,
      data : items?.filter((el) => el.stationArea === item.value),
    }
  })

  const newArray = array.filter((item) => {
    return item.data.length > 0
  })
  
  const resultArray = newArray?.map((item) => {
    const active = item.data?.filter((el) => el.stationStatus === 1)
    const totalItem = item.data.length
    const totalActive = active.length
    const percent = (totalActive  * 100 / totalItem).toFixed(0)
    return {
      ...item , 
      percent 
    }
  })
  resultArray.sort((a,b) => b.percent - a.percent)
  const topArea = resultArray.slice(1, 11)

  function getListStationArea() {
    Service.send({
      method: 'POST',
      path: 'Stations/getAllStationArea',
      data: {
        filter: {},
        skip: 0,
        limit: 100,
        order: {
          key: 'createdAt',
          value: 'desc'
        }
      }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setListStationArea(data)
        }
      }
    })
  }

  function getData(params, isNoLoading) {
    const newParams = {
      ...params
    }
    if (!isNoLoading) {
      setIsLoading(true)
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })

    Service.send({
      method: 'POST',
      path: 'Stations/getList',
      data: newParams,
      query: null
    }).then((res) => {
      if (res) {
        const { statusCode, data, message } = res
        if (statusCode === 200) {
          setTotal(data.total)
          setItems(data.data)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'fetchData' }) }))
        }
      } else {
        setTotal(1)
        setItems([])
      }
      if (!isNoLoading) {
        setIsLoading(false)
      }
    })
  }

  useEffect(() => {
    getData(paramsFilter)
    getListStationArea()
  }, [])

  const statesArr = [
    {
      title: topArea[0]?.name,
      value: topArea[0]?.percent + '%',
      chart: {
        type: 'radialBar',
        // series: [54.4],
        series: [topArea[0]?.percent + '%'],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          color : [function({value}){
            if(value < 30){
              return '#FF0000'
            }if(30 < value <60){
              return '#FF6600'
            }else{
              return '#16a34a'
            }
          }],
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#16a34a']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          stroke: {
            lineCap: 'round'
          },
        }
      }
    },
    {
      title: topArea[1]?.name,
      value: topArea[1]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [topArea[1]?.percent + '%'],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          color : [function({value}){
            if(value < 30){
              return '#FF0000'
            }if(30 < value <60){
              return '#FF6600'
            }else{
              return '#16a34a'
            }
          }],
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#16a34a']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          stroke: {
            lineCap: 'round'
          }
        }
      }
    },
    {
      title: topArea[2]?.name,
      value: topArea[2]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [topArea[2]?.percent + '%'],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          color : [function({value}){
            if(value < 30){
              return '#FF0000'
            }if(30 < value <60){
              return '#FF6600'
            }else{
              return '#16a34a'
            }
          }],
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#16a34a']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          stroke: {
            lineCap: 'round'
          }
        }
      }
    },
    {
      title: topArea[3]?.name,
      value: topArea[3]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [topArea[3]?.percent + '%'],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          color : [function({value}){
            if(value < 30){
              return '#FF0000'
            }if(30 < value <60){
              return '#FF6600'
            }else{
              return '#16a34a'
            }
          }],
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#16a34a']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          stroke: {
            lineCap: 'round'
          }
        }
      }
    },
    {
      title: topArea[4]?.name,
      value: topArea[4]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [topArea[4]?.percent + '%'],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          color : [function({value}){
            if(value < 30){
              return '#FF0000'
            }if(30 < value <60){
              return '#FF6600'
            }else{
              return '#16a34a'
            }
          }],
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#16a34a']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          stroke: {
            lineCap: 'round'
          }
        }
      }
    },
    {
      title: topArea[5]?.name,
      value: topArea[5]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [topArea[5]?.percent + '%'],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          color : [function({value}){
            if(value < 30){
              return '#FF0000'
            }if(30 < value <60){
              return '#FF6600'
            }else{
              return '#16a34a'
            }
          }],
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#16a34a']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          stroke: {
            lineCap: 'round'
          }
        }
      }
    },
    {
      title: topArea[6]?.name,
      value: topArea[6]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [topArea[6]?.percent + '%'],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          color : [function({value}){
            if(value < 30){
              return '#FF0000'
            }if(30 < value <60){
              return '#FF6600'
            }else{
              return '#16a34a'
            }
          }],
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#16a34a']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          stroke: {
            lineCap: 'round'
          }
        }
      }
    },
    {
      title: topArea[7]?.name,
      value: topArea[7]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [topArea[7]?.percent + '%'],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          color : [function({value}){
            if(value < 30){
              return '#FF0000'
            }if(30 < value <60){
              return '#FF6600'
            }else{
              return '#16a34a'
            }
          }],
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#16a34a']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          stroke: {
            lineCap: 'round'
          }
        }
      }
    },
    {
      title: topArea[8]?.name,
      value: topArea[8]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [topArea[8]?.percent + '%'],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          color : [function({value}){
            if(value < 30){
              return '#FF0000'
            }if(30 < value <60){
              return '#FF6600'
            }else{
              return '#16a34a'
            }
          }],
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#16a34a']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          stroke: {
            lineCap: 'round'
          }
        }
      }
    },
    {
      title: topArea[9]?.name,
      value: topArea[9]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [topArea[9]?.percent + '%'],
        height: 30,
        width: 30,
        options: {
          grid: {
            show: false,
            padding: {
              left: -15,
              right: -15,
              top: -12,
              bottom: -15
            }
          },
          color : [function({value}){
            if(value < 30){
              return '#FF0000'
            }if(30 < value <60){
              return '#FF6600'
            }else{
              return '#16a34a'
            }
          }],
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#16a34a']
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: false
                },
                value: {
                  show: false
                }
              }
            }
          },
          stroke: {
            lineCap: 'round'
          }
        }
      }
    },
    
  ]

  const renderStates = () => {
    return statesArr.map((state) => {
      return (
        <div key={state.title} className="browser-states">
          <Media>
            <h5 className="align-self-center mb-0">{state.title}</h5>
          </Media>
          <div className="d-flex align-items-center">
            <div className="font-weight-bold text-body-heading mr-1">{state.value}</div>
            <Chart
              options={state.chart.options}
              series={state.chart.series}
              type={state.chart.type}
              height={state.chart.height}
              width={state.chart.width}
            />
          </div>
        </div>
      )
    })
  }

  return (
    <Row>
      <Col sm="12" md="4" lg="4">
        <Card className="card-browser-states">
          <CardHeader className='flex-nowrap'>
            <div>
              <CardTitle tag="h3">{intl.formatMessage({ id: 'actives' })}</CardTitle>
              <CardText className="font-small-2">{intl.formatMessage({ id: 'active_area' })}</CardText>
            </div>
            <UncontrolledDropdown className="chart-dropdown">
              <DropdownToggle color="" className="bg-transparent btn-sm border-0 p-50">
                <MoreVertical size={18} className="cursor-pointer" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem className="w-100" onClick={() =>setModal(true)}>{intl.formatMessage({ id: 'see_all' })}</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </CardHeader>
          <CardBody>{renderStates()}</CardBody>
        </Card>
      </Col>
      <Modal
      isOpen={modal}
      toggle={() => setModal(false)}
      className={`modal-dialog-centered name_text`}
      >
        <ModalHeader>
        {intl.formatMessage({ id: "Area" })}
        </ModalHeader>
        <ModalBody>
          <div className="area_text">{listStationArea?.map((item)=>{
            return (
              <div key={item.value}>
                <p>{item.value}</p>
              </div>
            )
          })}</div>
        </ModalBody>
      </Modal>
    </Row>
  )
}

export default injectIntl(memo(ActiveCenter))
