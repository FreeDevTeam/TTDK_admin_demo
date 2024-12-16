import Chart from 'react-apexcharts'
import { MoreVertical, Loader } from 'react-feather'
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
  DropdownToggle,
} from 'reactstrap'
import { injectIntl } from 'react-intl'
import { Fragment, useState, useEffect, memo } from 'react'
import Service from '../../../../services/request'
import { toast } from 'react-toastify'
import "./index.scss";
import { readAllStationsDataFromLocal } from "../../../../helper/localStorage";

const ActiveCenter = ({ intl }) => {
  const [listStationArea, setListStationArea] = useState(null)
  const [modal, setModal] = useState(false);

  const array = [];
  listStationArea?.map((item, index) => {
    array[index] = {
      name : item.value ,
      data : readAllStationsDataFromLocal?.filter((el) => el.stationArea === item.value),
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
  const topArea = resultArray.slice(0, 10)

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

  useEffect(() => {
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else {
                  return '#16a34a'
              }
            }]
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else {
                  return '#16a34a'
              }
            }]
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else {
                  return '#16a34a'
              }
            }]
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else {
                  return '#16a34a'
              }
            }]
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else {
                  return '#16a34a'
              }
            }]
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else {
                  return '#16a34a'
              }
            }]
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else {
                  return '#16a34a'
              }
            }]
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else {
                  return '#16a34a'
              }
            }]
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else {
                  return '#16a34a'
              }
            }]
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else {
                  return '#16a34a'
              }
            }]
          },
          stroke: {
            lineCap: 'round'
          }
        }
      }
    },
    
  ]

  const chartArea = [
    {
      title: resultArray[0]?.name,
      value:  resultArray[0]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [resultArray[0]?.percent],
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else if(value > 60){
                  return '#16a34a'
              }
            }]
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[1]?.name,
        value:  resultArray[1]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[1]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
          title: resultArray[2]?.name,
          value:  resultArray[2]?.percent + '%',
          chart: {
            type: 'radialBar',
            series: [resultArray[2]?.percent],
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
              fill: {
                colors: [function({ value, seriesIndex, w }) {
                  if(value < 30) {
                      return '#FF0000'
                  } else if (value >= 30 && value < 60) {
                      return '#FF6600'
                  } else if(value > 60){
                      return '#16a34a'
                  }
                }]
              },
              plotOptions: {
                radialBar: {
                  hollow: {
                    size: '22%'
                  },
                  track: {
                    background: ['#C0C0C0']
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
          }},
      {
            title: resultArray[3]?.name,
            value:  resultArray[3]?.percent + '%',
            chart: {
              type: 'radialBar',
              series: [resultArray[3]?.percent],
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
                fill: {
                  colors: [function({ value, seriesIndex, w }) {
                    if(value < 30) {
                        return '#FF0000'
                    } else if (value >= 30 && value < 60) {
                        return '#FF6600'
                    } else if(value > 60){
                        return '#16a34a'
                    }
                  }]
                },
                plotOptions: {
                  radialBar: {
                    hollow: {
                      size: '22%'
                    },
                    track: {
                      background: ['#C0C0C0']
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
            }},
      {
              title: resultArray[4]?.name,
              value:  resultArray[4]?.percent + '%',
              chart: {
                type: 'radialBar',
                series: [resultArray[4]?.percent],
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
                  fill: {
                    colors: [function({ value, seriesIndex, w }) {
                      if(value < 30) {
                          return '#FF0000'
                      } else if (value >= 30 && value < 60) {
                          return '#FF6600'
                      } else if(value > 60){
                          return '#16a34a'
                      }
                    }]
                  },
                  plotOptions: {
                    radialBar: {
                      hollow: {
                        size: '22%'
                      },
                      track: {
                        background: ['#C0C0C0']
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
              }},
      {
      title: resultArray[5]?.name,
      value:  resultArray[5]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [resultArray[5]?.percent],
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else if(value > 60){
                  return '#16a34a'
              }
            }]
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[6]?.name,
        value:  resultArray[6]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[6]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[7]?.name,
        value:  resultArray[7]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[7]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[8]?.name,
        value:  resultArray[8]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[8]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[9]?.name,
        value:  resultArray[9]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[9]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[10]?.name,
        value:  resultArray[10]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[10]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[11]?.name,
        value:  resultArray[11]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[11]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[12]?.name,
        value:  resultArray[12]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[12]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[13]?.name,
        value:  resultArray[13]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[13]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[14]?.name,
        value:  resultArray[14]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[14]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[15]?.name,
        value:  resultArray[15]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[15]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[16]?.name,
        value:  resultArray[16]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[16]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[17]?.name,
        value:  resultArray[17]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[17]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
      title: resultArray[18]?.name,
      value:  resultArray[18]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [resultArray[18]?.percent],
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else if(value > 60){
                  return '#16a34a'
              }
            }]
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[19]?.name,
        value:  resultArray[19]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[19]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
      title: resultArray[20]?.name,
      value:  resultArray[20]?.percent + '%',
      chart: {
        type: 'radialBar',
        series: [resultArray[20]?.percent],
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
          fill: {
            colors: [function({ value, seriesIndex, w }) {
              if(value < 30) {
                  return '#FF0000'
              } else if (value >= 30 && value < 60) {
                  return '#FF6600'
              } else if(value > 60){
                  return '#16a34a'
              }
            }]
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '22%'
              },
              track: {
                background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[21]?.name,
        value:  resultArray[21]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[21]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[22]?.name,
        value:  resultArray[22]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[22]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[23]?.name,
        value:  resultArray[23]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[23]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[24]?.name,
        value:  resultArray[24]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[24]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[25]?.name,
        value:  resultArray[25]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[25]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[26]?.name,
        value:  resultArray[26]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[26]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[27]?.name,
        value:  resultArray[27]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[27]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[28]?.name,
        value:  resultArray[28]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[28]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[29]?.name,
        value:  resultArray[29]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[29]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[30]?.name,
        value:  resultArray[30]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[30]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[31]?.name,
        value:  resultArray[31]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[31]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[32]?.name,
        value:  resultArray[32]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[32]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[33]?.name,
        value:  resultArray[33]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[33]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[34]?.name,
        value:  resultArray[34]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[34]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[35]?.name,
        value:  resultArray[35]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[35]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[36]?.name,
        value:  resultArray[36]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[36]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[37]?.name,
        value:  resultArray[37]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[37]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[38]?.name,
        value:  resultArray[38]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[38]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[39]?.name,
        value:  resultArray[39]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[39]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[40]?.name,
        value:  resultArray[40]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[40]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[41]?.name,
        value:  resultArray[41]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[41]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[42]?.name,
        value:  resultArray[42]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[42]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[43]?.name,
        value:  resultArray[43]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[43]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[44]?.name,
        value:  resultArray[44]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[44]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[45]?.name,
        value:  resultArray[45]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[45]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[46]?.name,
        value:  resultArray[46]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[46]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[47]?.name,
        value:  resultArray[47]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[47]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[48]?.name,
        value:  resultArray[48]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[48]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[49]?.name,
        value:  resultArray[49]?.percent + '%',
        chart: {
          type: 'radialBar',
          series: [resultArray[49]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[50]?.name,
        value:  `${resultArray[50]?.percent === undefined ? '' : resultArray[50]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[50]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[51]?.name,
        value:  `${resultArray[51]?.percent === undefined ? '' : resultArray[51]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[51]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[52]?.name,
        value:  `${resultArray[52]?.percent === undefined ? '' : resultArray[52]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[52]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[53]?.name,
        value:  `${resultArray[53]?.percent === undefined ? '' : resultArray[53]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[53]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[54]?.name,
        value:  `${resultArray[54]?.percent === undefined ? '' : resultArray[54]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[54]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[55]?.name,
        value:  `${resultArray[55]?.percent === undefined ? '' : resultArray[55]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[55]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[56]?.name,
        value:  `${resultArray[56]?.percent === undefined ? '' : resultArray[56]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[56]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[57]?.name,
        value:  `${resultArray[57]?.percent === undefined ? '' : resultArray[57]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[57]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[58]?.name,
        value:  `${resultArray[58]?.percent === undefined ? '' : resultArray[58]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[58]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[59]?.name,
        value:  `${resultArray[59]?.percent === undefined ? '' : resultArray[59]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[59]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[60]?.name,
        value:  `${resultArray[60]?.percent === undefined ? '' : resultArray[60]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[60]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[61]?.name,
        value:  `${resultArray[61]?.percent === undefined ? '' : resultArray[61]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[61]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[62]?.name,
        value:  `${resultArray[62]?.percent === undefined ? '' : resultArray[62]?.percent + '%'}`,
        chart: {
          type: 'radialBar',
          series: [resultArray[62]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
      {
        title: resultArray[63]?.name,
        value: `${resultArray[63]?.percent === undefined ? '' : resultArray[63]?.percent + '%'}` ,
        chart: {
          type: 'radialBar',
          series: [resultArray[63]?.percent],
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
            fill: {
              colors: [function({ value, seriesIndex, w }) {
                if(value < 30) {
                    return '#FF0000'
                } else if (value >= 30 && value < 60) {
                    return '#FF6600'
                } else if(value > 60){
                    return '#16a34a'
                }
              }]
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '22%'
                },
                track: {
                  background: ['#C0C0C0']
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
      }},
  ]

  const renderStates = () => {
    return statesArr.map((state) => {
      return (
        <div key={state.title} className="d-flex browser-states flex-nowrap justify-content-between">
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

  const renderArea = () => {
    return chartArea.map((state) => {
      return (
        <div key={state.title} className="d-flex browser-states flex-nowrap justify-content-between">
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

  return listStationArea !== null ? (
    <Row>
      <Col>
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
      className={`modal-dialog-centered`}
      >
        <ModalHeader>
        {intl.formatMessage({ id: "Area" })}
        </ModalHeader>
        <ModalBody>
          <div className="area_text">
             {renderArea()}
          </div>
        </ModalBody>
      </Modal>
    </Row>
  ) : ( <Card className='d-flex justify-content-center align-items-center'>
          <CardHeader>
            <Loader size={60}/>
          </CardHeader>
        </Card>)
}

export default injectIntl(memo(ActiveCenter))
