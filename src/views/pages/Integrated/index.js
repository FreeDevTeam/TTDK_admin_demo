import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Search } from 'react-feather'
import { Card, Col, Row, Table, InputGroup, Button, Input } from 'reactstrap'
import MySwitch from '../../components/switch'
import { useHistory } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { injectIntl } from "react-intl";
import '@styles/react/libs/tables/react-dataTable-component.scss'
import IntegratedService from '../../../services/Integrated'
import addKeyLocalStorage from '../../../helper/localStorage'
import { toast } from 'react-toastify'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import SationService from '../../../services/station'
import { STATION_TYPES, STATUS_OPTIONS } from './../../../constants/app'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}
const IntegratedPage = ({intl}) =>{
    const [searchValue, setSearchValue] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [total, setTotal] = useState(20)
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [listStationArea, setListStationArea] = useState()
    const dataUser = JSON.parse(localStorage.getItem("TTDK_ADMIN_WEB_userData"));
    
    const history = useHistory()
    const onUpdateStationEnableUse = (id,data) => {
     const dataUpdate = {
      id: id,
      data : data
     }
     const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      if (token) {
        const newToken = token.replace(/"/g, '')
     IntegratedService.handleUpdateData(dataUpdate,newToken).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          const newParams = {
            ...paramsFilter,
            skip: (currentPage - 1) * paramsFilter.limit
          }
          getData(newParams)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })}
    }
    const onUpdateEnableUsePayMent = (id,data) => {
      const dataUpdate = {
       id: id,
       data : data
      }
      const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
       if (token) {
         const newToken = token.replace(/"/g, '')
      IntegratedService.handleUpdateDataPayment(dataUpdate,newToken).then(res => {
       if (res) {
         const { statusCode } = res
         if (statusCode === 200) {
           const newParams = {
             ...paramsFilter,
             skip: (currentPage - 1) * paramsFilter.limit
           }
           getData(newParams)
           toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
         } else {
           toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
         }
       }
     })}
     }
     function getListStationArea() {
      SationService.getListStationArea().then((res) => {
        if (res) {
          const { statusCode, data } = res
          if (statusCode === 200) {
            setListStationArea(data)
          }
        }
      })
    }
     const handleFilterChange = (name, value) => {
      const newParams = {
        ...paramsFilter,
        filter: {
          ...paramsFilter.filter,
          [name]: value ? value : undefined
        },
        skip: 0,
      }
      setParamsFilter(newParams)
      getData(newParams)
    }
    const handleSearch = () => {
      const newParams = {
        ...paramsFilter,
        searchText: searchValue
      }
      if (newParams.searchText) {
        setParamsFilter(newParams)
        getData(newParams)
      } else {
        setParamsFilter(newParams)
        getData(paramsFilter)
      }
    }
    const columns = [
        {
            name: intl.formatMessage({ id: 'index' }),
            selector: row => row.stationsId,
            sortable: true,
            minWidth: '12px',
            maxWidth: '120px',
            cell: (row) => {
             return <a 
             className='text-primary'
             onClick={()=> history.push(`/pages/detail-integrated/${row.stationsId}`)}>
                {row.stationsId}
             </a>
            }
        },{
            name: intl.formatMessage({ id: 'code' }),
            minWidth: '90px',
            maxWidth: '90px',
            center: true,
            selector: row => row.stationCode,
            cell: (row) => {
             return <a 
             className='text-primary'
             onClick={()=> history.push(`/pages/detail-integrated/${row.stationsId}`)}>
                {row.stationCode}
             </a>
            }
        },{
            name: intl.formatMessage({ id: 'stationsName' }),
            minWidth: '300px',
            maxWidth: '300px',
            selector: row => row.stationsName
        },{
          name: intl.formatMessage({ id: 'pay_olnine' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { enablePaymentGateway } = row
              return (
                <MySwitch
                  checked={enablePaymentGateway === 1 ? true : false}
                  onChange={e => {
                    onUpdateEnableUsePayMent(row.stationsId,{
                      enablePaymentGateway: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },
        {
          name: intl.formatMessage({ id: 'marketing_online' }),
          center: true,
          minWidth: '100px',
          maxWidth: '100px',
          cell: (row) => {
              const { enableMarketingMessages } = row
              return (
                <MySwitch
                  checked={enableMarketingMessages === 1 ? true : false}
                  onChange={e => {
                    onUpdateStationEnableUse(row.stationsId, {
                      enableMarketingMessages: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
      },
        {
          name: intl.formatMessage({ id: 'operation' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { enableOperateMenu } = row
              return (
                <MySwitch
                  checked={enableOperateMenu === 1 ? true : false}
                  onChange={e => {
                    onUpdateStationEnableUse(row.stationsId,{
                      enableOperateMenu: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },{
          name: intl.formatMessage({ id: 'customer' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { enableCustomerMenu } = row
              return (
                <MySwitch
                  checked={enableCustomerMenu === 1 ? true : false}
                  onChange={e => {
                    onUpdateStationEnableUse(row.stationsId,{
                      enableCustomerMenu: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },{
          name: intl.formatMessage({ id: 'documentEnable' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { enableDocumentMenu } = row
              return (
                <MySwitch
                  checked={enableDocumentMenu === 1 ? true : false}
                  onChange={e => {
                    onUpdateStationEnableUse(row.stationsId,{
                      enableDocumentMenu: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },
        {
          name: intl.formatMessage({ id: 'devices' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { enableDeviceMenu } = row
              return (
                <MySwitch
                  checked={enableDeviceMenu === 1 ? true : false}
                  onChange={e => {
                    onUpdateStationEnableUse(row.stationsId,{
                      enableDeviceMenu: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },
        {
          name: intl.formatMessage({ id: 'schedule' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { enableScheduleMenu } = row
              return (
                <MySwitch
                  checked={enableScheduleMenu === 1 ? true : false}
                  onChange={e => {
                    onUpdateStationEnableUse(row.stationsId,{
                      enableScheduleMenu: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },
        {
          name: intl.formatMessage({ id: 'management' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { enableManagerMenu } = row
              return (
                <MySwitch
                  checked={enableManagerMenu === 1 ? true : false}
                  onChange={e => {
                    onUpdateStationEnableUse(row.stationsId,{
                      enableManagerMenu: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },
        {
          name: intl.formatMessage({ id: 'vehicleRegistration' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { enableVehicleRegistrationMenu } = row
              return (
                <MySwitch
                  checked={enableVehicleRegistrationMenu === 1 ? true : false}
                  onChange={e => {
                    onUpdateStationEnableUse(row.stationsId,{
                      enableVehicleRegistrationMenu: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },
        {
          name: intl.formatMessage({ id: 'contact' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { enableContactMenu } = row
              return (
                <MySwitch
                  checked={enableContactMenu === 1 ? true : false}
                  onChange={e => {
                    onUpdateStationEnableUse(row.stationsId,{
                      enableContactMenu: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },
        {
          name: intl.formatMessage({ id: 'chat' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { enableChatMenu } = row
              return (
                <MySwitch
                  checked={enableChatMenu === 1 ? true : false}
                  onChange={e => {
                    onUpdateStationEnableUse(row.stationsId,{
                      enableChatMenu: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },
        // {
        //     name: intl.formatMessage({ id: 'road_online' }),
        //     center: true,
        //     minWidth: '150px',
        //     maxWidth: '200px',
        //     cell: (row) => {
        //         const { enableOnlineRoadTollPayment } = row
        //         return (
        //           <MySwitch
        //             checked={enableOnlineRoadTollPayment === 1 ? true : false}
        //             onChange={e => {
        //               onUpdateStationEnableUse(row.stationsId,{
        //                 enableOnlineRoadTollPayment: e.target.checked ? 1 : 0
        //               })
        //             }}
        //           />
        //         )
        //       }
        // },{
        //     name: intl.formatMessage({ id: 'insurance_online' }),
        //     center: true,
        //     minWidth: '200px',
        //     maxWidth: '200px',
        //     cell: (row) => {
        //         const { enableOnlineInsurancePayment } = row
        //         return (
        //           <MySwitch
        //             checked={enableOnlineInsurancePayment === 1 ? true : false}
        //             onChange={e => {
        //               onUpdateStationEnableUse(row.stationsId, {
        //                 enableOnlineInsurancePayment: e.target.checked ? 1 : 0
        //               })
        //             }}
        //           />
        //         )
        //       }
        // },{
        //     name: intl.formatMessage({ id: 'registration_online' }),
        //     center: true,
        //     minWidth: '200px',
        //     maxWidth: '200px',
        //     cell: (row) => {
        //         const { enableOnlineRegistrationFeePayment } = row
        //         return (
        //           <MySwitch
        //             checked={enableOnlineRegistrationFeePayment === 1 ? true : false}
        //             onChange={e => {
        //               onUpdateStationEnableUse(row.stationsId, {
        //                 enableOnlineRegistrationFeePayment: e.target.checked ? 1 : 0
        //               })
        //             }}
        //           />
        //         )
        //       }
        // },{
        //     name: intl.formatMessage({ id: 'apns_message' }),
        //     center: true,
        //     minWidth: '200px',
        //     maxWidth: '200px',
        //     cell: (row) => {
        //         const { enableUseAPNSMessages } = row
        //         return (
        //           <MySwitch
        //             checked={enableUseAPNSMessages === 1 ? true : false}
        //             onChange={e => {
        //               onUpdateStationEnableUse(row.stationsId, {
        //                 enableUseAPNSMessages: e.target.checked ? 1 : 0
        //               })
        //             }}
        //           />
        //         )
        //       }
        // },
        // {
        //   name: intl.formatMessage({ id: 'multichannel_CSKH' }),
        //   minWidth: '300px',
        //   maxWidth: '300px',
        //   selector: row => row.stationsName
        // }
    ]

    const handlePagination = (page) => {
      const newParams = {
        ...paramsFilter,
        skip: page.selected * paramsFilter.limit
      }
      getData(newParams)
      setCurrentPage(page.selected + 1)
    }

    const CustomPagination = () => {
        const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))  
        return (
          <ReactPaginate
            previousLabel={''}
            nextLabel={''}
            breakLabel='...'
            pageCount={count || 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            activeClassName='active'
            forcePage={currentPage !== 0 ? currentPage - 1 : 0}
            onPageChange={page => handlePagination(page)}
            pageClassName={'page-item'}
            nextLinkClassName={'page-link'}
            nextClassName={'page-item next'}
            previousClassName={'page-item prev'}
            previousLinkClassName={'page-link'}
            pageLinkClassName={'page-link'}
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName={
              'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
            }
          />
        )
      }

    function getData(params){
      const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      if (token) {
        const newToken = token.replace(/"/g, '')
        IntegratedService.getList(params, newToken).then((res) => {
          if (res) {
            const { statusCode, data, message } = res
            if (statusCode === 200) {
              setItems(data.data)
              setTotal(data.total)
            } else {
              toast.warn(intl.formatMessage({ id: 'actionFailed' }))
            }
          } else {
            setTotal(1)
            setItems([])
          }
        })
      } else {
        window.localStorage.clear()
      }
    }
    useEffect(() => {
      getData(paramsFilter)
      getListStationArea()
    }, [])
  return (
    <Fragment>
        <Card>
        <Row className='mx-0 mt-1 mb-50'>
        <Col   md = '2' sm='4' xs='12' className='d-flex mt-sm-0 mt-1'>
          <InputGroup className="input-search-group">
            <Input
              placeholder={intl.formatMessage({ id: 'Search' })}
              className='dataTable-filter'
              type="search"
              bsSize='sm'
              id='search-input' 
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value) }}
            />
            </InputGroup>
            <Button color='primary'
              size="sm"
              className='mb-1'
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
          </Col>
          <Col sm='2' md = '2' lg='2' xs='6' className='mb-1'>
            <Input onChange={(e) => {
              const { name, value } = e.target
              handleFilterChange(name, value)
            }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.stationStatus || '') : ''} name='stationStatus' bsSize='sm' >
              {
                Object.values(STATUS_OPTIONS)?.map(item => {
                  return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
                })
              }
            </Input>
          </Col>
          <Col sm='2' md = '2' lg='2' xs='6' className='mb-1'>
            <Input
              onChange={(e) => {
                const { name, value } = e.target
                handleFilterChange(name, value)
              }}
              type='select'
              name='stationArea'
              bsSize='sm'
            >
              <option value={''}>
                {' '}
                {intl.formatMessage({ id: "Area" })}
              </option>
              {
                listStationArea?.map((item) => (
                  <option value={item.id}>{item.value}</option>
                ))}
            </Input>
          </Col>
          {dataUser?.roleId === 1 ?  
          <Col sm='2' md = '2' lg='2' xs='6' className='mb-1'>
            <Input onChange={(e) => {
              const { name, value } = e.target
              handleFilterChange(name, value)
            }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.stationType || '') : ''} name='stationType' bsSize='sm' >
              {
                Object.values(STATION_TYPES).map(item => {
                  return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
                })
              }
            </Input>
          </Col> : null
          }
        </Row>

        <div className='mx-0 mb-50 [dir]'>
            <DataTable
            noHeader
            pagination
            paginationServer
            className='react-dataTable'
            columns= {columns}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
        </div>
        </Card>

    </Fragment>
  )
}

export default injectIntl(memo(IntegratedPage)) 
