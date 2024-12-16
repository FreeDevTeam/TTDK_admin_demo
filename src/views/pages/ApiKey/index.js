import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Search } from 'react-feather'
import { injectIntl } from "react-intl"
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Card, Row, Col, InputGroup, Input, Button } from 'reactstrap'
import addKeyLocalStorage from '../../../helper/localStorage'
import ApiKey from '../../../services/apiKeyService'
import MySwitch from '../../components/switch'
import BasicTextCopy from '../../components/BasicCopyText'
import BasicTablePaging from '../../components/BasicTablePaging'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}

const DataTables = ({intl}) => {
  const history = useHistory()
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [total, setTotal] = useState(20)
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [searchValue, setSearchValue] = useState("")

    const onUpdateEnableUse = (id,data) => {
     const dataUpdate = {
      id: id,
      data : data
     }
     const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      if (token) {
        const newToken = token.replace(/"/g, '')
        ApiKey.handleUpdateData(dataUpdate,newToken).then(res => {
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

    const columns = [
        {
            name: intl.formatMessage({ id: 'partner_name' }),
            sortable: true,
            minWidth: '300px',
            maxWidth: '300px',
            cell: (row) => {
              const { apiKeyName } = row
             return <div className='d-flex'>
             <span>{ apiKeyName }</span>
             <span><BasicTextCopy value={apiKeyName}/></span>
             </div>
            }
        },
        {
          name: intl.formatMessage({ id: 'code_api' }),
          sortable: true,
          minWidth: '500px',
          maxWidth: '500px',
          cell: (row) => {
            const { apiKey } = row
           return <div className='d-flex'>
            <span>{ apiKey }</span>
            <span><BasicTextCopy value={apiKey}/></span>
            </div>
          }
        },
        {
          name: intl.formatMessage({ id: 'on/off_code' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { apiKeyEnable } = row
              return (
                <MySwitch
                  checked={apiKeyEnable === 1 ? true : false}
                  onChange={e => {
                    onUpdateEnableUse(row.apiKey,{
                      apiKeyEnable: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },
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
        ApiKey.getList(params, newToken).then((res) => {
          if (res) {
            const { statusCode, data, message } = res
            setParamsFilter(params);
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

    const handleSearch = () => {
      const newParams = {
        ...paramsFilter,
        searchText: searchValue || undefined,
        skip: 0
      }
      getData(newParams)
    } 

    const handlePaginations = (page) => {
      const newParams = {
        ...paramsFilter,
        skip: (page - 1) * paramsFilter.limit
      }
      if(page === 1){
        getData(newParams)
        return null
      }
      getData(newParams)
      setCurrentPage(page + 1)
    }
  
    const CustomPaginations = () =>{
      const lengthItem = items.length
      return (
        <BasicTablePaging 
          items={lengthItem}
          handlePaginations={handlePaginations}
          skip={paramsFilter.skip}
        />
      )
    }

  return (
    <Fragment>
        <Card>
        <Row className='mx-0 mt-1 mb-50'>
         <Col sm='6' md = '4' lg='2' xs='12' className='d-flex mt-sm-0 mt-1'>
          <InputGroup className="input-search-group">
            <Input
              placeholder={intl.formatMessage({ id: "Search" })}
              className='dataTable-filter'
              type="search"
              bsSize='md'
              id='search-input' 
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value) }}
            />
            </InputGroup>
            <Button color='primary'
              size="md"
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

export default injectIntl(memo(DataTables)) 
