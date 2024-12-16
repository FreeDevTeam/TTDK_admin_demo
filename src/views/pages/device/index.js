import React, { memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { ChevronDown, Lock, Unlock, Trash } from 'react-feather'
import {
  Card, Input, Row, Col
} from 'reactstrap'
import './device.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import ReactPaginate from 'react-paginate';
import DeviceService from '../../../services/deviceService'
import _ from 'lodash';
import { toast } from 'react-toastify';
import 'moment/dist/locale/vi'
import moment from 'moment';
import { injectIntl } from 'react-intl';

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc"
  }
}

const STATUS = [
  "locked",
  'ok'
]

function Devices({ intl }) {
  const [isLoading, setIsLoading] = useState(false)
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [currentPage, setCurrentPage] = useState(1)
  const [dataDevice, setDataDevice] = useState({
    data: [],
    total: 0
  })
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState("ALL")

  async function deleteDeivce(data) {
    DeviceService.deleteDeviceById(data.appDeviceId).then(result => {
      let action = {action: intl.formatMessage({id: "delete"})}
      if(result && result.isSuccess) {
        toast.success(intl.formatMessage({id: 'actionSuccess'}, action))
        fetchDataDevices(paramsFilter, true)
      } else {
        toast.error(intl.formatMessage({id: 'actionFailed'}, action))
      }
    })
  }

  function changeStatusDevice(data) {
    DeviceService.updateDevice({
      id: data.appDeviceId,
      data: {
        deviceStatus: data.deviceStatus === 0 ? 1 : 0
      }
    }).then(result => {
      let action = {action: intl.formatMessage({id: "update"})}
      if(result.isSuccess) {
        toast.success(intl.formatMessage({id: 'actionSuccess'}, action ))
        fetchDataDevices(paramsFilter, true)
      } else {
        toast.error(intl.formatMessage({id: 'actionFailed'}, action ))
      }
    })
  }

  const columns = [
    {
      name: intl.formatMessage({ id:'index' }),
      selector: row => row.key,      
      sortable: true,
      maxWidth: '60px'
    },
    {
      name: intl.formatMessage({  id: 'deviceName' }),
      selector: row => row.devicePrettyProductName,
    },
    {
      name: intl.formatMessage({  id: 'stations' }),
      minWidth: "240px",
      maxWidth: "320px",
      cell: (row) => {
        const { stationUrl, stationsName } = row
        return (
          <div className="text-link text-line-clamp pointer" onClick={() => window.open(`https://${stationUrl}`, '_blank')}>
           {stationsName}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({  id: 'status' }),
      cell: row => {
        return (
          <>
            <div>{intl.formatMessage({ id:STATUS[Number(row.deviceStatus)] })}</div>
          </>
        )
      },
    },
    {
      name: intl.formatMessage({  id: 'createdAt' }),
      cell: (row) => {
        const { createdAt } = row

        return (
          <div>
           {moment(createdAt).locale('vi').format('hh:mm DD/MM/YYYY')}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({  id: 'deviceOS' }),
      selector: row => row.deviceOSName
    },
    {
      name: '',
      cell: (row) => {
        return (
          <>
            {
              row.deviceStatus === 0 ? (
                <Unlock size={20} onClick={() => changeStatusDevice(row)} className="mr-2 pointer" />
              ) : (
                <Lock size={20} onClick={() => changeStatusDevice(row)} className="mr-2 pointer" />
              )
            }
            <Trash size={20} onClick={() => deleteDeivce(row)} className="pointer" />
          </>
        )
      }
    },
  ];

  const handlePagination = page => {
    const newParams = {
      ...paramsFilter,
      skip: (page.selected) * paramsFilter.limit
    }
    fetchDataDevices(newParams)
    setCurrentPage(page.selected + 1)

  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(dataDevice / 20).toFixed(0))

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

  const fetchDataDevices = (params, isNoLoading) => {
    if (!isNoLoading) {
      setIsLoading(true)
    }

    Object.keys(params.filter).forEach(key => {
      if (!params.filter[key] || params.filter[key] === '') {
        delete params.filter[key]
      }
    })

    DeviceService.getList(params).then(result => {
      setParamsFilter(params)
      if(result && !_.isEmpty(result)) {
        setDataDevice(result)
      } else {
        toast.warn('Có lỗi xảy ra. Vui lòngt thử lại sau!')
        setDataDevice({
          total: 0,
          data: []
        })
      }
      if (!isNoLoading) {
        setIsLoading(false)
      }
    })
  }

  useEffect(() => {
    fetchDataDevices(paramsFilter)
  },[])

  const handleFilter = (searchText, dataFilter) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        ...dataFilter,
        deviceStatus: dataFilter.deviceStatus
      },
      searchText: searchText ? searchText : undefined,
      skip: 0
    }
    fetchDataDevices(newParams, true)
  }

  const onPressEnter = (e) => {
    const { value } = e.target
    if(e.keyCode === 13) {
      handleFilter(value ? value : undefined)
    }
  }

  function handleFilterStatus(e) {
    const { name, value } = e.target
    setFilterStatus(value)
    if(value !== "ALL") {
      handleFilter(undefined, { [name]: value })
    } else {
      handleFilter(undefined, { [name]: undefined })
    }
  }

  return (
    <>
      <Card>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='4'>
            <div className='d-flex align-items-center'>
              <Input
                className='dataTable-select'
                value={searchText}
                name="searchText"
                bsSize='sm'
                placeholder={intl.formatMessage({id:"Search"})}
                className="w-75 ml-2"
                onChange={(e) => {
                  setSearchText(e.target.value)
                }}
                onKeyDown={onPressEnter}
              />
            </div>
          </Col>
          <Col sm='4'>
            <div className='d-flex align-items-center'>
              <Input
                className='dataTable-select'
                name="deviceStatus"
                bsSize='sm'
                type="select"
                placeholder="Lọc trạng thái"
                className="w-75 ml-2"
                id='sort-select'
                value={filterStatus}
                onChange={handleFilterStatus}
              >
                <option value="ALL">{intl.formatMessage({id:'all'})}</option>
                {
                  STATUS.map((item, value) => {
                    return (
                      <option value={Number(value)} key={Math.random()}>{intl.formatMessage({id:item})}</option>
                    )
                  })
                }
              </Input>
            </div>
          </Col>
          <Col sm="4"/>
        </Row>
        
        <DataTable
          noHeader
          pagination
          paginationServer
          className='react-dataTable'
          columns={columns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={dataDevice.data}
          progressPending={isLoading}
        />
      </Card>
    </>
  )
}

export default injectIntl(memo(Devices))