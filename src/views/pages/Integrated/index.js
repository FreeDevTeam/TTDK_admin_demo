import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Briefcase, ChevronDown, Mail, MessageSquare, MoreVertical, Search } from 'react-feather'
import { injectIntl } from "react-intl"
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, Row, UncontrolledDropdown } from 'reactstrap'
import addKeyLocalStorage, { APP_USER_DATA_KEY } from '../../../helper/localStorage'
import IntegratedService from '../../../services/Integrated'
import SationService from '../../../services/station'
import MySwitch from '../../components/switch'
import { STATUS_OPTIONS } from './../../../constants/app'
import { stationTypes } from "../../../constants/dateFormats";
import BasicTablePaging from '../../components/BasicTablePaging'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}
const IntegratedPage = ({intl}) =>{

    const stations_location = [
      { value: '', label: 'all_location'},
      { value: [1,2,3,4,5,6,7,8,9,10], label:  'has_position'}, 
      { value: [0], label:  'not_position'},
    ]

    const [searchValue, setSearchValue] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [total, setTotal] = useState(20)
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [listStationArea, setListStationArea] = useState()
    const [number, setNumber] = useState()
    const dataUser = JSON.parse(localStorage.getItem(APP_USER_DATA_KEY));
    console.log(items);
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
      if(name === 'enablePriorityMode'){
        var arr = value.split(',');
        const newParams = {
          ...paramsFilter,
          filter: {
            ...paramsFilter.filter,
            enablePriorityMode : arr ? arr : undefined
          },
          skip: 0,
        }
        if(value.length === 0){
          delete newParams.filter.enablePriorityMode
        }
        setParamsFilter(newParams)
        getData(newParams)
        return null
      }
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

    const handleInputChange = (e, row) => {
        onUpdateStationEnableUse(row.stationsId,{
          enablePriorityMode: Number(e.target.value)
        })
    }

    const columns = [
        {
            name: intl.formatMessage({ id: 'display_location' }),
            selector: row => row.stationsId,
            sortable: true,
            minWidth: '170px',
            maxWidth: '170px',
            cell: (row) => {
              const { enablePriorityMode } = row
              const prioritize = 10 - enablePriorityMode
             return <span>
              {enablePriorityMode === null ? <span>-</span> :
               <Input  
               type='number'
               defaultValue={enablePriorityMode}
               value={ number }
               onBlur={e => handleInputChange(e, row)}
               />
            }
             </span>
            }
        },
        {
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
        },
        // {
        //     name: intl.formatMessage({ id: 'stationsName' }),
        //     minWidth: '300px',
        //     maxWidth: '300px',
        //     selector: row => row.stationsName
        // },
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
        },
        {
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
        // { 
        //   name: intl.formatMessage({ id: 'pay_olnine' }),
        //   center: true,
        //   minWidth: '150px',
        //   maxWidth: '150px',
        //   cell: (row) => {
        //       const { enablePaymentGateway } = row
        //       return (
        //         <MySwitch
        //           checked={enablePaymentGateway === 1 ? true : false}
        //           onChange={e => {
        //             onUpdateEnableUsePayMent(row.stationsId,{
        //               enablePaymentGateway: e.target.checked ? 1 : 0
        //             })
        //           }}
        //         />
        //       )
        //     }
        // },
        {
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
          name: intl.formatMessage({ id: 'phone_book' }),
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
        {
          name: intl.formatMessage({ id: 'News' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { enableNewsMenu } = row
              return (
                <MySwitch
                  checked={enableNewsMenu === 1 ? true : false}
                  onChange={e => {
                    onUpdateStationEnableUse(row.stationsId,{
                      enableNewsMenu: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },
        {
          name: intl.formatMessage({ id: 'action' }),
          selector: 'action',
          minWidth: "150px",
          maxWidth: '150px',
          cell: (row) => {
            const { stationsId } = row
            return (
              <>
                <UncontrolledDropdown>
                  <DropdownToggle className='icon-btn hide-arrow mt-0.5' color='transparent' size='sm' caret>
                    <MoreVertical size={15} />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem href='/' onClick={e => {
                      e.preventDefault();
                      history.push("/pages/form-SMS", row)
                    }}>
                      <MessageSquare className='mr-50' size={15} /> <span className='align-middle'>
                        {intl.formatMessage({ id: 'setting' })}{" "}SMS
                      </span>
                    </DropdownItem>
    
                    <DropdownItem href='/' onClick={e => {
                      e.preventDefault();
                      history.push("/pages/form-ZNS", row)
                    }}>
                      <MessageSquare className='mr-50' size={15} /> <span className='align-middle'>
                        {intl.formatMessage({ id: 'setting' })}{" "}ZNS
                      </span>
                    </DropdownItem>
    
                    <DropdownItem href='/' onClick={e => {
                      e.preventDefault();
                      history.push("/pages/form-email", row)
                    }}>
                      <Mail className='mr-50' size={15} /> <span className='align-middle'>
                        {intl.formatMessage({ id: 'setting' })}{" "}Email
                      </span>
                    </DropdownItem>
    
                    <DropdownItem href='/' onClick={e => {
                      e.preventDefault();
                      history.push("/pages/form-vnpay", row)
                    }}>
                      <Briefcase className='mr-50' size={15} /> <span className='align-middle'>
                        {intl.formatMessage({ id: 'setting' })}{" "}VNPay
                      </span>
                    </DropdownItem>
    
                  </DropdownMenu>
                </UncontrolledDropdown>
              </>
            )
          }
        }
    ]

    const handlePagination = (page) => {
      const newParams = {
        ...paramsFilter,
        skip: page.selected * paramsFilter.limit
      }
      getData(newParams)
      setCurrentPage(page.selected + 1)
    }

    const handlePaginations = (page) => {
      const newParams = {
        ...paramsFilter,
        skip: (page - 1) * paramsFilter.limit
      }
      if(page === 1){
        getData(paramsFilter)
        return null
      }
      getData(newParams)
      setCurrentPage(page + 1)
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

    const CustomPaginations = () =>{
      const lengthItem = items.length
      return (
        <BasicTablePaging 
          items={lengthItem}
          handlePaginations={handlePaginations}
        />
      )
    }

  return (
    <Fragment>
      {/* <NumberInput /> */}
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
            <Input onChange={(e) => {
              const { name, value } = e.target
              handleFilterChange(name, value)
            }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.enablePriorityMode || '') : ''} name='enablePriorityMode' bsSize='sm' >
              {
                Object.values(stations_location)?.map(item => {
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
                (stationTypes).map(item => {
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
            // pagination
            paginationServer
            className='react-dataTable'
            columns= {columns}
            sortIcon={<ChevronDown size={10} />}
            // paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
        </Card>

    </Fragment>
  )
}

export default injectIntl(memo(IntegratedPage)) 
