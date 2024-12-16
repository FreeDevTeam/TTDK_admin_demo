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
import MySwitch from '../../components/switch'
import BasicTextCopy from '../../components/BasicCopyText'
import BasicTablePaging from '../../components/BasicTablePaging'
import SystemConfigurationsService from '../../../services/SystemConfigurationsService'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 50
}

const SystemSchedule = ({intl}) => {
  const history = useHistory()
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])

    const onUpdateEnableUse = (id,data) => {
     const dataUpdate = {
      id: id,
      data : data
     }
     const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      if (token) {
        const newToken = token.replace(/"/g, '')
        SystemConfigurationsService.handleUpdateSystemSetting(dataUpdate,newToken).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })}
    }

    const columns = [
        {
            name: intl.formatMessage({ id: 'feature' }),
            minWidth: '450px',
            maxWidth: '450px',
            cell: (row) => {
              const { note } = row
             return <div className='text-table'>
             <span>{ note.replaceAll('( ','(').replaceAll(' )',')') }</span>
             </div>
            }
        },
        {
          name: intl.formatMessage({ id: 'on/off' }),
          center: true,
          minWidth: '150px',
          maxWidth: '150px',
          cell: (row) => {
              const { key,value } = row
              return (
                <MySwitch
                  checked={value === 1 ? true : false}
                  onChange={e => {
                    onUpdateEnableUse(key,{
                      value: e.target.checked ? 1 : 0,
                    })
                  }}
                />
              )
            }
        },
    ]

    function getData(params){
      const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      if (token) {
        const newToken = token.replace(/"/g, '')
        SystemConfigurationsService.getSystemSetting(params, newToken).then((res) => {
          if (res) {
            const { statusCode, data, message } = res
            if (statusCode === 200) {
              setItems(data)
            } else {
              toast.warn(intl.formatMessage({ id: 'no_data' }))
            }
          } else {
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
        <div className='mx-0 mb-50'>
            <DataTable
            noHeader
            // pagination
            paginationServer
            className='react-dataTable'
            columns= {columns}
            sortIcon={<ChevronDown size={10} />}
            data={items}
            progressPending={isLoading}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(SystemSchedule)) 
