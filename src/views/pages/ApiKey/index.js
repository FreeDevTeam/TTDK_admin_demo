import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import { injectIntl } from "react-intl"
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Card } from 'reactstrap'
import addKeyLocalStorage from '../../../helper/localStorage'
import ApiKey from '../../../services/apiKeyService'
import MySwitch from '../../components/switch'
import BasicTextCopy from '../../components/BasicCopyText'

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
    const [number, setNumber] = useState()

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

export default injectIntl(memo(DataTables)) 
