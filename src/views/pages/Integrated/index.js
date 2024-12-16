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

    const handleSearch = () => {
      const newParams = {
        ...paramsFilter,
        searchText: searchValue
      }
      if (newParams.searchText) {
        getData(newParams)
      } else {
        getData(paramsFilter)
      }
    }
    const columns = [
        {
            name: intl.formatMessage({ id: 'index' }),
            selector: row => row.stationsId,
            sortable: true,
            minWidth: '70px',
            maxWidth: '70px',
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
            minWidth: '150px',
            maxWidth: '500px',
            selector: row => row.stationsName
        },{
          name: intl.formatMessage({ id: 'pay' }),
          center: true,
          minWidth: '140px',
          maxWidth: '140px',
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
        },{
            name: intl.formatMessage({ id: 'momo' }),
            center: true,
            minWidth: '100px',
            maxWidth: '100px',
            cell: (row) => {
                const { stationEnableUseMomo } = row
                return (
                  <MySwitch
                    checked={stationEnableUseMomo === 1 ? true : false}
                    onChange={e => {
                      onUpdateStationEnableUse(row.stationsId,{
                        stationEnableUseMomo: e.target.checked ? 1 : 0
                      })
                    }}
                  />
                )
              }
        },{
            name: intl.formatMessage({ id: 'Zalo_ZNS' }),
            center: true,
            minWidth: '120px',
            maxWidth: '120px',
            cell: (row) => {
                const { stationEnableUseZNS } = row
                return (
                  <MySwitch
                    checked={stationEnableUseZNS === 1 ? true : false}
                    onChange={e => {
                      onUpdateStationEnableUse(row.stationsId, {
                        stationEnableUseZNS: e.target.checked ? 1 : 0
                      })
                    }}
                  />
                )
              }
        },{
            name: intl.formatMessage({ id: 'sms' }),
            center: true,
            minWidth: '100px',
            maxWidth: '100px',
            cell: (row) => {
                const { stationEnableUseSMS } = row
                return (
                  <MySwitch
                    checked={stationEnableUseSMS === 1 ? true : false}
                    onChange={e => {
                      onUpdateStationEnableUse(row.stationsId, {
                        stationEnableUseSMS: e.target.checked ? 1 : 0
                      })
                    }}
                  />
                )
              }
        },{
            name: intl.formatMessage({ id: 'stationsEmail' }),
            center: true,
            minWidth: '100px',
            maxWidth: '100px',
            cell: (row) => {
                const { stationEnableUseEmail } = row
                return (
                  <MySwitch
                    checked={stationEnableUseEmail === 1 ? true : false}
                    onChange={e => {
                      onUpdateStationEnableUse(row.stationsId, {
                        stationEnableUseEmail: e.target.checked ? 1 : 0
                      })
                    }}
                  />
                )
              }
        },{
            name: intl.formatMessage({ id: 'VNPAY' }),
            center: true,
            minWidth: '100px',
            maxWidth: '100px',
            cell: (row) => {
                const { stationEnableUseVNPAY } = row
                return (
                  <MySwitch
                    checked={stationEnableUseVNPAY === 1 ? true : false}
                    onChange={e => {
                      onUpdateStationEnableUse(row.stationsId, {
                        stationEnableUseVNPAY: e.target.checked ? 1 : 0
                      })
                    }}
                  />
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
