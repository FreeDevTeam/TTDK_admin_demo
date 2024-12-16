import '@styles/react/libs/flatpickr/flatpickr.scss'
import _, { pickBy } from 'lodash'
import moment from 'moment'
import { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, Col, Label, Row } from 'reactstrap'

import Flatpickr from 'react-flatpickr'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

import Service from '../../../services/request'
import './messages.scss'

const date = new Date()
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

const DefaultFilter = {
  filter: {
    customerMessageCategories: 'SMS',
  },
  startDate: moment(firstDay).format('DD/MM/YYYY'),
  endDate: moment(lastDay).format('DD/MM/YYYY'),
  skip: 0,
  limit: 20,
  order: {
    key: 'createdAt',
    value: 'desc',
  },
}

const providers = [
  { value: 'VIETTEL', label: 'VIETTEL' },
  { value: 'VIVAS', label: 'VIVAS' },
  { value: 'VMG', label: 'VMG' },
]

function Messages({ intl }) {
  const messageStatus = [
    { value: 'NEW', label: intl.formatMessage({ id: 'new' }) },
    { value: 'PENDING', label: intl.formatMessage({ id: 'pending' }) },
    { value: 'SENDING', label: intl.formatMessage({ id: 'sending' }) },
    { value: 'COMPLETED', label: intl.formatMessage({ id: 'completed' }) },
    { value: 'CANCELED', label: intl.formatMessage({ id: 'canceled' }) },
    { value: 'FAILED', label: intl.formatMessage({ id: 'failed' }) },
  ]

  const history = useHistory()

  const [messages, setMessages] = useState([])
  const [stations, setStations] = useState([])
  const [total, setTotal] = useState(20)
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)

  const [isLoading, setIsLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const [filterObj, setFilterObj] = useState(DefaultFilter)
  const [stationsName, setStationName] = useState('')
  const [externalProvider, setExternalProvider] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  //   const [isLoading, setIsLoading] = useState(false);

  function fetchMessages(params, isNoLoading) {
    const newParams = {
      ...params,
    }
    if (!isNoLoading) {
      setIsLoading(true)
    }

    Service.send({
      method: 'POST',
      path: 'CustomerMessage/getList',
      data: newParams,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        setParamsFilter(newParams)
        if (statusCode === 200) {
          setTotal(data.total)
          setMessages(data.data)
        } else {
          toast.warn(
            intl.formatMessage(
              { id: 'actionFailed' },
              { action: intl.formatMessage({ id: 'fetchData' }) }
            )
          )
        }
      } else {
        setTotal(1)
        setMessages([])
      }
      if (!isNoLoading) {
        setIsLoading(false)
      }
    })
  }

  function fetchStations() {
    Service.send({
      method: 'POST',
      path: 'Stations/getList',
      data: {
        filter: {},
        skip: 0,
        limit: 500,
        order: {
          key: 'createdAt',
          value: 'desc',
        },
      },
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setStations(
            data.data.map((station) => {
              return { label: station.stationsName, value: station.stationsId }
            })
          )
        } else {
          toast.warn(
            intl.formatMessage(
              { id: 'actionFailed' },
              { action: intl.formatMessage({ id: 'fetchData' }) }
            )
          )
        }
      }
    })
  }

  useEffect(() => {
    fetchStations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterChange = (name, value) => {
    if (name === 'date') {
      const ms = name === 'startDate' ? 1000 : 8639999
      const newFilterObj = pickBy(
        {
          ...filterObj,
          startDate: value[0]
            ? moment(new Date(new Date(value[0]).getTime() + ms)).format(
                'DD/MM/YYYY'
              )
            : undefined,
          endDate: value[1]
            ? moment(new Date(new Date(value[1]).getTime() + ms)).format(
                'DD/MM/YYYY'
              )
            : undefined,
          filter: pickBy({ ...filterObj.filter }, (v) => v !== ''),
        },
        (v) => v !== ''
      )
      setFilterObj(newFilterObj)
      return
    }

    const newFilterObj = pickBy(
      {
        ...filterObj,
        filter: pickBy(
          {
            ...filterObj.filter,
            [name]: value.trim(),
          },
          (v) => v !== ''
        ),
        skip: 0,
      },
      (v) => v !== ''
    )

    setFilterObj(newFilterObj)
  }

  const getDataSearch = _.debounce((params) => {
    fetchMessages(params, false)
  }, 300)

  const handleFilter = () => {
    getDataSearch(filterObj)
  }

  const handleClearFilter = () => {
    getDataSearch(DefaultFilter)
  }

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit,
    }
    fetchMessages(newParams)
    setCurrentPage(page.selected + 1)
  }

  // ** Custom Pagination
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
        onPageChange={(page) => handlePagination(page)}
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

  const serverSideColumns = [
    {
      name: 'ID',
      selector: 'messageCustomerId',
      sortable: true,
      maxWidth: '60px',
    },
    {
      name: intl.formatMessage({ id: 'phone' }),
      selector: 'customerMessagePhone',
      maxWidth: '120px',
    },
    {
      name: intl.formatMessage({ id: 'plateNumber' }),
      selector: 'customerMessagePlateNumber',
      maxWidth: '220px',
    },
    {
      name: intl.formatMessage({ id: 'stations' }),
      selector: 'stationsName',
      maxWidth: '250px',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'provider' }),
      selector: 'externalProvider',
      maxWidth: '250px',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: 'messageStatus' }),
      selector: 'messageSendStatus',
      sortable: true,
      maxWidth: '120px',
      cell: (row) => {
        return row.messageSendStatus
          ? intl.formatMessage({ id: row.messageSendStatus.toLowerCase() })
          : ''
      },
    },
    {
      name: intl.formatMessage({ id: 'smsContent' }),
      selector: 'customerMessageContent',
      minWidth: '320px',
    },
    {
      name: intl.formatMessage({ id: 'messagesDetail-messageSendDate' }),
      selector: 'messageSendDate',
      sortable: true,
      maxWidth: '150px',
      cell: (row) => {
        const { messageSendDate } = row

        return messageSendDate ? (
          <div>{moment(messageSendDate).format('hh:mm DD/MM/YYYY')}</div>
        ) : (
          ''
        )
      },
    },
  ]

  return (
    <Fragment>
      <Card>
        <h1 className='text-center my-4'>
          {intl.formatMessage({ id: 'table-message-title' })}
        </h1>

        <Row className='p-4'>
          <Col className='mb-1' md='6' sm='12'>
            <Label>{intl.formatMessage({ id: 'stationsName' })} </Label>
            <Select
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              isClearable={true}
              placeholder={'Chọn trạm'}
              options={_.uniqBy(stations, (e) => e.label)}
              disabled={isLoading}
              onChange={(row) => {
                if (!row) {
                  setStationName('')
                  handleFilterChange('stationsName', '')
                  return
                }
                const { label } = row
                setStationName(label)
                handleFilterChange('stationsName', label)
              }}
            />
          </Col>
          <Col className='mb-1' md='6' sm='12'>
            <Label>
              {intl.formatMessage({ id: 'messagesDetail-messageSendStatus' })}{' '}
            </Label>
            <Select
              placeholder={'Chọn trạng thái'}
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              isClearable={true}
              options={messageStatus}
              disabled={isLoading}
              onChange={(row) => {
                if (!row) {
                  handleFilterChange('messageSendStatus', '')
                  return
                }
                const { value } = row
                handleFilterChange('messageSendStatus', value)
              }}
            />
          </Col>
          <Col className='mb-1' md='6' sm='12'>
            <Label for='default-picker' className='white-space-nowrap'>
              {intl.formatMessage({ id: 'startDate' })} -{' '}
              {intl.formatMessage({ id: 'endDate' })}
            </Label>

            <Flatpickr
              id='range-picker'
              className='form-control'
              disabled={isLoading}
              onChange={(date) => {
                setStartDate(date[0])
                setEndDate(date[1])

                handleFilterChange('date', date)
              }}
              options={{
                mode: 'range',
                defaultDate: [firstDay, lastDay],
              }}
            />
          </Col>

          <Col className='mb-1' md='6' sm='12'>
            <Label>{intl.formatMessage({ id: 'provider' })} </Label>
            <Select
              placeholder={'Chọn nhà cung cấp'}
              theme={selectThemeColors}
              className='react-select w-100'
              classNamePrefix='select'
              isClearable={true}
              options={providers}
              disabled={isLoading}
              onChange={(row) => {
                if (!row) {
                  handleFilterChange('externalProvider', '')
                  setExternalProvider('')
                  return
                }
                const { value } = row
                handleFilterChange('externalProvider', value)
                setExternalProvider(value)
              }}
            />
          </Col>
          <Col className='mb-1' size='12'>
            <div className='d-flex justify-content-end' style={{ gap: 10 }}>
              <Button.Ripple
                color='primary'
                type='button'
                onClick={handleFilter}
                disabled={isLoading}
              >
                Lọc
              </Button.Ripple>
              {!_.isEqual(filterObj, DefaultFilter) && (
                <Button.Ripple
                  outline
                  type='button'
                  disabled={isLoading}
                  onClick={handleClearFilter}
                >
                  Huỷ
                </Button.Ripple>
              )}
            </div>
          </Col>
        </Row>

        <DataTable
          noHeader
          pagination
          paginationServer
          className='react-dataTable'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={messages}
          progressPending={isLoading}
          onRowClicked={(row, event) => {
            event.preventDefault()
            history.push('/pages/sent-messages/detail', row)
          }}
          pointerOnHover={true}
          highlightOnHover={true}
        />
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(Messages))
